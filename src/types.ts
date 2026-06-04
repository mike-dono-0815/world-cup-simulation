export interface Team {
  name: string
  flagCode: string
  impliedPct: number
  fifaRanking: number
  group: string
}

export interface GroupMatch {
  serial: number
  home: string
  away: string
  homeFlagCode: string
  awayFlagCode: string
  group: string
  date: string
  venue: string
  oddsHome: number
  oddsDraw: number
  oddsAway: number
}

export interface KOTeam {
  name: string
  flagCode: string
  impliedPct: number
  fifaRanking: number
  qualLabel: string  // '1A', '2B', '3E', 'W(M1)', 'L(M29)', etc.
}

export interface KOMatch {
  serial: number
  label: string           // 'M1'–'M31', '3PO'
  home: KOTeam | null     // null = not yet determined
  away: KOTeam | null
  homeSlot: string        // e.g. '2A', '1F', 'W(M1)', 'Best 3rd'
  awaySlot: string
  stage: 'r32' | 'r16' | 'qf' | 'sf' | '3rd' | 'final'
}

export interface MatchResult {
  homeScore: number | null
  awayScore: number | null
  penaltyWinner?: 'home' | 'away'   // KO only when scores level
  official?: boolean                 // fetched from real API — not editable by user
}

export type AutoFillStrategy =
  | 'follow_odds'
  | 'fifa_ranking'
  | 'weighted_random'
  | 'value_hunter'
  | 'upset_machine'
  | 'draw_specialist'
  | 'giant_killer'
  | 'totally_random'

export interface GroupStanding {
  team: string
  flagCode: string
  impliedPct: number
  fifaRanking: number
  played: number
  won: number
  drawn: number
  lost: number
  gf: number
  ga: number
  gd: number
  points: number
}
