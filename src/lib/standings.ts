import type { GroupMatch, GroupStanding, MatchResult } from '../types'
import { TEAM_MAP } from '../data/teams'

/** Head-to-head stats among a subset of teams (Step 1 criteria). */
function computeH2H(
  teams: GroupStanding[],
  matches: GroupMatch[],
  results: Record<number, MatchResult>,
): Map<string, { pts: number; gd: number; gf: number }> {
  const inGroup = new Set(teams.map(t => t.team))
  const stats = new Map<string, { pts: number; gd: number; gf: number }>()
  for (const t of teams) stats.set(t.team, { pts: 0, gd: 0, gf: 0 })

  for (const m of matches) {
    if (!inGroup.has(m.home) || !inGroup.has(m.away)) continue
    const r = results[m.serial]
    if (r?.homeScore == null || r?.awayScore == null) continue
    const { homeScore: h, awayScore: a } = r
    const hs = stats.get(m.home)!
    const as_ = stats.get(m.away)!
    hs.gf += h; hs.gd += h - a
    as_.gf += a; as_.gd += a - h
    if (h > a)       hs.pts  += 3
    else if (h === a) { hs.pts++; as_.pts++ }
    else              as_.pts += 3
  }
  return stats
}

/**
 * Rank a set of teams that are tied on overall points.
 *
 * Step 1 — H2H among the tied teams: pts → GD → GF
 * Step 2 — for teams still tied after Step 1: overall GD → overall GF → FIFA ranking
 */
function rankTied(
  teams: GroupStanding[],
  matches: GroupMatch[],
  results: Record<number, MatchResult>,
): GroupStanding[] {
  if (teams.length <= 1) return teams

  const h2h = computeH2H(teams, matches, results)

  // Sort by Step 1
  const sorted = [...teams].sort((a, b) => {
    const ah = h2h.get(a.team)!, bh = h2h.get(b.team)!
    if (bh.pts !== ah.pts) return bh.pts - ah.pts
    if (bh.gd  !== ah.gd)  return bh.gd  - ah.gd
    if (bh.gf  !== ah.gf)  return bh.gf  - ah.gf
    return 0
  })

  // For teams still equal on all H2H criteria, fall through to Step 2
  const out: GroupStanding[] = []
  let i = 0
  while (i < sorted.length) {
    const ai = h2h.get(sorted[i].team)!
    let j = i + 1
    while (j < sorted.length) {
      const aj = h2h.get(sorted[j].team)!
      if (aj.pts !== ai.pts || aj.gd !== ai.gd || aj.gf !== ai.gf) break
      j++
    }
    const stillTied = sorted.slice(i, j)
    if (stillTied.length > 1) {
      // Step 2: overall GD → overall GF → FIFA ranking (Step 3)
      stillTied.sort((a, b) => {
        if (b.gd !== a.gd)                   return b.gd - a.gd
        if (b.gf !== a.gf)                   return b.gf - a.gf
        return a.fifaRanking - b.fifaRanking
      })
    }
    out.push(...stillTied)
    i = j
  }
  return out
}

export function calculateGroupStandings(
  groupMatches: GroupMatch[],
  results: Record<number, MatchResult>,
): GroupStanding[] {
  const map = new Map<string, GroupStanding>()

  for (const m of groupMatches) {
    for (const name of [m.home, m.away]) {
      if (!map.has(name)) {
        const t = TEAM_MAP.get(name)!
        map.set(name, {
          team: name, flagCode: t.flagCode,
          impliedPct: t.impliedPct, fifaRanking: t.fifaRanking,
          played: 0, won: 0, drawn: 0, lost: 0,
          gf: 0, ga: 0, gd: 0, points: 0,
        })
      }
    }

    const r = results[m.serial]
    if (r?.homeScore == null || r?.awayScore == null) continue

    const hs = map.get(m.home)!
    const as_ = map.get(m.away)!
    const { homeScore: h, awayScore: a } = r

    hs.played++; as_.played++
    hs.gf += h; hs.ga += a; hs.gd += h - a
    as_.gf += a; as_.ga += h; as_.gd += a - h

    if (h > a)        { hs.won++;   hs.points += 3; as_.lost++ }
    else if (h === a) { hs.drawn++; hs.points++;    as_.drawn++; as_.points++ }
    else              { hs.lost++;  as_.won++;       as_.points += 3 }
  }

  const allTeams = Array.from(map.values())

  // Group by overall points, then apply tiebreakers within each group
  const byPoints = new Map<number, GroupStanding[]>()
  for (const t of allTeams) {
    const bucket = byPoints.get(t.points) ?? []
    bucket.push(t)
    byPoints.set(t.points, bucket)
  }

  const result: GroupStanding[] = []
  for (const pts of Array.from(byPoints.keys()).sort((a, b) => b - a)) {
    result.push(...rankTied(byPoints.get(pts)!, groupMatches, results))
  }
  return result
}

export function rankThirdPlaceTeams(
  allGroupStandings: Map<string, GroupStanding[]>,
): Array<{ group: string; standing: GroupStanding }> {
  const thirds: Array<{ group: string; standing: GroupStanding }> = []
  for (const [group, standings] of allGroupStandings) {
    if (standings[2]) thirds.push({ group, standing: standings[2] })
  }
  // Third-place teams come from different groups — no H2H, go straight to overall criteria
  return thirds.sort((a, b) => {
    const x = a.standing, y = b.standing
    if (y.points !== x.points) return y.points - x.points
    if (y.gd     !== x.gd)    return y.gd     - x.gd
    if (y.gf     !== x.gf)    return y.gf     - x.gf
    return x.fifaRanking - y.fifaRanking
  })
}
