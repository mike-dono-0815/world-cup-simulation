import type { KOMatch, KOTeam, MatchResult, GroupStanding } from '../types'
import { GROUP_MATCHES } from '../data/schedule'
import { calculateGroupStandings, rankThirdPlaceTeams } from './standings'
import assignmentTableRaw from '../data/AssignmentTable.md?raw'

// AssignmentTable column order: 1A, 1B, 1D, 1E, 1G, 1I, 1K, 1L
const BEST3_SLOT_SERIALS = [79, 85, 81, 74, 82, 77, 87, 80]

let cachedLookup: Map<string, string[]> | null = null

function getAssignmentLookup(): Map<string, string[]> {
  if (cachedLookup) return cachedLookup
  const lookup = new Map<string, string[]>()
  for (const line of assignmentTableRaw.split(/\r?\n/)) {
    const cols = line.split('\t')
    const qualGroups = cols.filter((c: string) => /^[A-L]$/.test(c)).sort()
    const assignments = cols.filter((c: string) => /^3[A-L]$/.test(c))
    if (qualGroups.length !== 8 || assignments.length !== 8) continue
    lookup.set(qualGroups.join(''), assignments.map((a: string) => a[1]))
  }
  cachedLookup = lookup
  return lookup
}

// Confirmed R32 qualifiers keyed by group slot.
// Used as a fallback when group results haven't been loaded yet — computed standings
// take precedence once any match in the group has a result.
const CONFIRMED_R32_SLOTS: Record<string, KOTeam> = {
  '1A': { name: 'Mexico',        flagCode: 'mx', impliedPct: 1.41,  fifaRanking: 15, qualLabel: '1A' },
  '2A': { name: 'South Africa',  flagCode: 'za', impliedPct: 0.12,  fifaRanking: 60, qualLabel: '2A' },
  '1B': { name: 'Switzerland',   flagCode: 'ch', impliedPct: 0.99,  fifaRanking: 19, qualLabel: '1B' },
  '2B': { name: 'Canada',        flagCode: 'ca', impliedPct: 0.50,  fifaRanking: 30, qualLabel: '2B' },
  '1C': { name: 'Brazil',        flagCode: 'br', impliedPct: 10.53, fifaRanking: 6,  qualLabel: '1C' },
  '2C': { name: 'Morocco',       flagCode: 'ma', impliedPct: 1.64,  fifaRanking: 8,  qualLabel: '2C' },
  '1D': { name: 'United States', flagCode: 'us', impliedPct: 1.52,  fifaRanking: 16, qualLabel: '1D' },
  '1E': { name: 'Germany',       flagCode: 'de', impliedPct: 6.67,  fifaRanking: 10, qualLabel: '1E' },
  '1J': { name: 'Argentina',     flagCode: 'ar', impliedPct: 10.53, fifaRanking: 3,  qualLabel: '1J' },
}

// R32 fixed slots (no 3rd-place team)
const R32_FIXED: Array<{ serial: number; homeSlot: string; awaySlot: string }> = [
  { serial: 73, homeSlot: '2A', awaySlot: '2B' },
  { serial: 75, homeSlot: '1F', awaySlot: '2C' },
  { serial: 76, homeSlot: '1C', awaySlot: '2F' },
  { serial: 78, homeSlot: '2E', awaySlot: '2I' },
  { serial: 83, homeSlot: '2K', awaySlot: '2L' },
  { serial: 84, homeSlot: '1H', awaySlot: '2J' },
  { serial: 86, homeSlot: '1J', awaySlot: '2H' },
  { serial: 88, homeSlot: '2D', awaySlot: '2G' },
]

// R32 "Best 3rd" slots: serial → group winner slot
const R32_BEST3: Record<number, string> = {
  74: '1E', 77: '1I', 79: '1A', 80: '1L',
  81: '1D', 82: '1G', 85: '1B', 87: '1K',
}

// Eligible third-place groups per Best-3rd slot (shown before assignment is resolved)
const R32_BEST3_GROUPS: Record<number, string> = {
  74: 'A/B/C/D/F', 77: 'C/D/F/G/H', 79: 'C/E/F/H/I', 80: 'E/H/I/J/K',
  81: 'B/E/F/I/J', 82: 'A/E/H/I/J', 85: 'E/F/G/I/J', 87: 'D/E/I/J/L',
}

// Full KO bracket tree: output serial → [input1 serial, input2 serial]
export const BRACKET_TREE: Record<number, [number, number]> = {
  89:  [74,  77],  90:  [73,  75],  91:  [76,  78],  92:  [79,  80],
  93:  [83,  84],  94:  [81,  82],  95:  [86,  88],  96:  [85,  87],
  97:  [89,  90],  98:  [93,  94],  99:  [91,  92],  100: [95,  96],
  101: [97,  98],  102: [99, 100],
  104: [101, 102],
}

export const KO_STAGE: Record<number, KOMatch['stage']> = {
  73: 'r32', 74: 'r32', 75: 'r32', 76: 'r32', 77: 'r32', 78: 'r32',
  79: 'r32', 80: 'r32', 81: 'r32', 82: 'r32', 83: 'r32', 84: 'r32',
  85: 'r32', 86: 'r32', 87: 'r32', 88: 'r32',
  89: 'r16', 90: 'r16', 91: 'r16', 92: 'r16',
  93: 'r16', 94: 'r16', 95: 'r16', 96: 'r16',
  97: 'qf', 98: 'qf', 99: 'qf', 100: 'qf',
  101: 'sf', 102: 'sf',
  103: '3rd',
  104: 'final',
}

export const KO_SERIALS_BY_STAGE: Record<KOMatch['stage'], number[]> = {
  r32:   [73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88],
  r16:   [89,90,91,92,93,94,95,96],
  qf:    [97,98,99,100],
  sf:    [101,102],
  '3rd': [103],
  final: [104],
}

export const STAGE_LABELS: Record<KOMatch['stage'], string> = {
  r32: 'Round of 32',
  r16: 'Round of 16',
  qf: 'Quarter-Finals',
  sf: 'Semi-Finals',
  '3rd': '3rd Place',
  final: 'Final',
}

export function serialToLabel(serial: number): string {
  if (serial === 103) return '3PO'
  if (serial === 104) return 'M31'
  return `M${serial - 72}`
}

function standingToKOTeam(s: GroupStanding, qualLabel: string): KOTeam {
  return { name: s.team, flagCode: s.flagCode, impliedPct: s.impliedPct, fifaRanking: s.fifaRanking, qualLabel }
}


export function getWinnerOfMatch(
  serial: number,
  results: Record<number, MatchResult>,
  koTeams: Map<number, { home: KOTeam | null; away: KOTeam | null }>,
): KOTeam | null {
  const r = results[serial]
  if (r?.homeScore == null || r?.awayScore == null) return null
  const teams = koTeams.get(serial)
  if (!teams?.home || !teams?.away) return null

  if (r.homeScore > r.awayScore) return teams.home
  if (r.awayScore > r.homeScore) return teams.away
  // Draw — check penalty winner
  if (r.penaltyWinner === 'home') return teams.home
  if (r.penaltyWinner === 'away') return teams.away
  return null
}

export function getLoserOfMatch(
  serial: number,
  results: Record<number, MatchResult>,
  koTeams: Map<number, { home: KOTeam | null; away: KOTeam | null }>,
): KOTeam | null {
  const winner = getWinnerOfMatch(serial, results, koTeams)
  if (!winner) return null
  const teams = koTeams.get(serial)
  if (!teams?.home || !teams?.away) return null
  return winner.name === teams.home.name ? teams.away : teams.home
}

export function buildAllKOMatches(results: Record<number, MatchResult>): KOMatch[] {
  // Step 1: compute all group standings
  const allStandings = new Map<string, GroupStanding[]>()
  for (const g of 'ABCDEFGHIJKL'.split('')) {
    const gMatches = GROUP_MATCHES.filter(m => m.group === g)
    allStandings.set(g, calculateGroupStandings(gMatches, results))
  }

  // Step 2: rank 3rd place teams; find top 8
  const rankedThirds = rankThirdPlaceTeams(allStandings)
  const top8Thirds = rankedThirds.slice(0, 8)
  const top8Groups = top8Thirds.map(t => t.group)
  const thirdByGroup = new Map(top8Thirds.map(t => [t.group, t.standing]))

  // Whether all 12 groups have finished (used only for slot label display)
  const allGroupsDone = 'ABCDEFGHIJKL'.split('').every(g => {
    const gMatches = GROUP_MATCHES.filter(m => m.group === g)
    return gMatches.every(m => {
      const r = results[m.serial]
      return r?.homeScore != null && r?.awayScore != null
    })
  })

  // Step 3: look up assignment using current top-8 thirds ("as it stands")
  const lookup = getAssignmentLookup()
  const key = [...top8Groups].sort().join('')
  const assignments = lookup.get(key)
  const slotAssignment = new Map<number, string>()
  if (assignments) {
    for (let i = 0; i < 8; i++) {
      slotAssignment.set(BEST3_SLOT_SERIALS[i], assignments[i])
    }
  }

  // Helper: resolve group slot → KOTeam.
  // Returns computed standings once any group match has a result;
  // falls back to CONFIRMED_R32_SLOTS for known qualifiers when no results are loaded.
  function resolveGroupSlot(slot: string): KOTeam | null {
    const rank = slot[0]  // '1', '2', '3'
    const grp  = slot[1]  // 'A'–'L'
    const standings = allStandings.get(grp)
    const gMatches = GROUP_MATCHES.filter(m => m.group === grp)
    const anyDone = gMatches.some(m => {
      const r = results[m.serial]
      return r?.homeScore != null && r?.awayScore != null
    })
    if (!anyDone) return CONFIRMED_R32_SLOTS[slot] ?? null
    if (!standings) return CONFIRMED_R32_SLOTS[slot] ?? null
    const idx = rank === '1' ? 0 : rank === '2' ? 1 : 2
    const s = standings[idx]
    if (!s) return null
    return standingToKOTeam(s, slot)
  }

  // Step 4: build R32 teams map (serial → { home, away })
  const r32Teams = new Map<number, { home: KOTeam | null; away: KOTeam | null }>()

  for (const { serial, homeSlot, awaySlot } of R32_FIXED) {
    r32Teams.set(serial, { home: resolveGroupSlot(homeSlot), away: resolveGroupSlot(awaySlot) })
  }

  for (const [serialStr, homeSlot] of Object.entries(R32_BEST3)) {
    const serial = Number(serialStr)
    const homeTeam = resolveGroupSlot(homeSlot)
    let awayTeam: KOTeam | null = null
    const assignedGroup = slotAssignment.get(serial)
    if (assignedGroup) {
      const gMatches = GROUP_MATCHES.filter(m => m.group === assignedGroup)
      const anyDone = gMatches.some(m => {
        const r = results[m.serial]
        return r?.homeScore != null && r?.awayScore != null
      })
      if (anyDone) {
        const s = thirdByGroup.get(assignedGroup)
        if (s) awayTeam = standingToKOTeam(s, `3${assignedGroup}`)
      }
    }
    r32Teams.set(serial, { home: homeTeam, away: awayTeam })
  }

  // Build slot labels for every KO match (shown even before teams are determined)
  const slotLabels = new Map<number, { homeSlot: string; awaySlot: string }>()
  for (const { serial, homeSlot, awaySlot } of R32_FIXED) {
    slotLabels.set(serial, { homeSlot, awaySlot })
  }
  for (const [serialStr, homeSlot] of Object.entries(R32_BEST3)) {
    const serial = Number(serialStr)
    // Only show specific "3X" slot label once assignment is final; otherwise show eligible groups
    const assignedGroup = allGroupsDone ? slotAssignment.get(serial) : undefined
    slotLabels.set(serial, { homeSlot, awaySlot: assignedGroup ? `3${assignedGroup}` : `${R32_BEST3_GROUPS[serial]} 3rd` })
  }
  for (const serial of KO_SERIALS_BY_STAGE.r16) {
    const [s1, s2] = BRACKET_TREE[serial]
    slotLabels.set(serial, { homeSlot: `Winner ${serialToLabel(s1)}`, awaySlot: `Winner ${serialToLabel(s2)}` })
  }
  for (const serial of KO_SERIALS_BY_STAGE.qf) {
    const [s1, s2] = BRACKET_TREE[serial]
    slotLabels.set(serial, { homeSlot: `Winner ${serialToLabel(s1)}`, awaySlot: `Winner ${serialToLabel(s2)}` })
  }
  for (const serial of KO_SERIALS_BY_STAGE.sf) {
    const [s1, s2] = BRACKET_TREE[serial]
    slotLabels.set(serial, { homeSlot: `Winner ${serialToLabel(s1)}`, awaySlot: `Winner ${serialToLabel(s2)}` })
  }
  slotLabels.set(103, { homeSlot: 'Loser M29', awaySlot: 'Loser M30' })
  slotLabels.set(104, { homeSlot: 'Winner M29', awaySlot: 'Winner M30' })

  // Step 5: build all KO team maps (needed for winner resolution)
  // We iterate rounds in order so each round can resolve from the previous
  const allKOTeams = new Map<number, { home: KOTeam | null; away: KOTeam | null }>()
  for (const [serial, teams] of r32Teams) {
    allKOTeams.set(serial, teams)
  }

  // R16
  for (const serial of KO_SERIALS_BY_STAGE.r16) {
    const [s1, s2] = BRACKET_TREE[serial]
    const w1 = getWinnerOfMatch(s1, results, allKOTeams)
    const w2 = getWinnerOfMatch(s2, results, allKOTeams)
    const qualLabel1 = w1 ? `Winner ${serialToLabel(s1)}` : `Winner ${serialToLabel(s1)}`
    const qualLabel2 = w2 ? `Winner ${serialToLabel(s2)}` : `Winner ${serialToLabel(s2)}`
    allKOTeams.set(serial, {
      home: w1 ? { ...w1, qualLabel: qualLabel1 } : null,
      away: w2 ? { ...w2, qualLabel: qualLabel2 } : null,
    })
  }

  // QF
  for (const serial of KO_SERIALS_BY_STAGE.qf) {
    const [s1, s2] = BRACKET_TREE[serial]
    const w1 = getWinnerOfMatch(s1, results, allKOTeams)
    const w2 = getWinnerOfMatch(s2, results, allKOTeams)
    allKOTeams.set(serial, {
      home: w1 ? { ...w1, qualLabel: `Winner ${serialToLabel(s1)}` } : null,
      away: w2 ? { ...w2, qualLabel: `Winner ${serialToLabel(s2)}` } : null,
    })
  }

  // SF
  for (const serial of KO_SERIALS_BY_STAGE.sf) {
    const [s1, s2] = BRACKET_TREE[serial]
    const w1 = getWinnerOfMatch(s1, results, allKOTeams)
    const w2 = getWinnerOfMatch(s2, results, allKOTeams)
    allKOTeams.set(serial, {
      home: w1 ? { ...w1, qualLabel: `Winner ${serialToLabel(s1)}` } : null,
      away: w2 ? { ...w2, qualLabel: `Winner ${serialToLabel(s2)}` } : null,
    })
  }

  // 3rd place (103) = losers of SF
  const l1 = getLoserOfMatch(101, results, allKOTeams)
  const l2 = getLoserOfMatch(102, results, allKOTeams)
  allKOTeams.set(103, {
    home: l1 ? { ...l1, qualLabel: 'Loser M29' } : null,
    away: l2 ? { ...l2, qualLabel: 'Loser M30' } : null,
  })

  // Final (104) = winners of SF
  const w1 = getWinnerOfMatch(101, results, allKOTeams)
  const w2 = getWinnerOfMatch(102, results, allKOTeams)
  allKOTeams.set(104, {
    home: w1 ? { ...w1, qualLabel: 'Winner M29' } : null,
    away: w2 ? { ...w2, qualLabel: 'Winner M30' } : null,
  })

  // Step 6: build final KOMatch array
  const allSerials = [
    ...KO_SERIALS_BY_STAGE.r32,
    ...KO_SERIALS_BY_STAGE.r16,
    ...KO_SERIALS_BY_STAGE.qf,
    ...KO_SERIALS_BY_STAGE.sf,
    ...KO_SERIALS_BY_STAGE['3rd'],
    ...KO_SERIALS_BY_STAGE.final,
  ]

  return allSerials.map(serial => {
    const teams = allKOTeams.get(serial) ?? { home: null, away: null }
    const slots = slotLabels.get(serial) ?? { homeSlot: '?', awaySlot: '?' }
    return {
      serial,
      label: serialToLabel(serial),
      home: teams.home,
      away: teams.away,
      homeSlot: slots.homeSlot,
      awaySlot: slots.awaySlot,
      stage: KO_STAGE[serial],
    }
  })
}

export function getTournamentWinner(
  results: Record<number, MatchResult>,
  koMatches: KOMatch[],
): KOTeam | null {
  const final = koMatches.find(m => m.serial === 104)
  if (!final) return null
  const r = results[104]
  if (r?.homeScore == null || r?.awayScore == null) return null
  if (r.homeScore > r.awayScore) return final.home
  if (r.awayScore > r.homeScore) return final.away
  if (r.penaltyWinner === 'home') return final.home
  if (r.penaltyWinner === 'away') return final.away
  return null
}
