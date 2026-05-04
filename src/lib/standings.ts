import type { GroupMatch, GroupStanding, MatchResult } from '../types'
import { TEAM_MAP } from '../data/teams'

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

    if (h > a)       { hs.won++;   hs.points += 3; as_.lost++ }
    else if (h === a){ hs.drawn++; hs.points++;    as_.drawn++; as_.points++ }
    else             { hs.lost++;  as_.won++;      as_.points += 3 }
  }

  return Array.from(map.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (b.gd !== a.gd)         return b.gd - a.gd
    if (b.gf !== a.gf)         return b.gf - a.gf
    return a.fifaRanking - b.fifaRanking
  })
}

export function rankThirdPlaceTeams(
  allGroupStandings: Map<string, GroupStanding[]>,
): Array<{ group: string; standing: GroupStanding }> {
  const thirds: Array<{ group: string; standing: GroupStanding }> = []
  for (const [group, standings] of allGroupStandings) {
    if (standings[2]) thirds.push({ group, standing: standings[2] })
  }
  return thirds.sort((a, b) => {
    const x = a.standing, y = b.standing
    if (y.points !== x.points) return y.points - x.points
    if (y.gd !== x.gd)         return y.gd - x.gd
    if (y.gf !== x.gf)         return y.gf - x.gf
    return x.fifaRanking - y.fifaRanking
  })
}
