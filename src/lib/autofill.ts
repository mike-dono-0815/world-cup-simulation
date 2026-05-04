import type { GroupMatch, KOMatch, MatchResult, AutoFillStrategy } from '../types'
import { deriveMatchOdds } from './odds'

export const STRATEGY_LABELS: Record<AutoFillStrategy, { label: string; short: string; description: string }> = {
  follow_odds:     { label: 'Follow the Odds',  short: 'ODDS FAV',  description: 'Always back the bookmaker favourite' },
  fifa_ranking:    { label: 'FIFA Ranking',      short: 'FIFA RNK',  description: 'Higher-ranked team wins; no draws' },
  weighted_random: { label: 'Weighted Random',   short: 'RANDOM',    description: 'Odds-weighted random picks with varied scores' },
  value_hunter:    { label: 'Value Hunter',      short: 'VALUE',     description: 'Targets the outcome with the best perceived value' },
  upset_machine:   { label: 'Upset Machine',     short: 'UPSETS',    description: 'Always pick the biggest underdog' },
  draw_specialist: { label: 'Draw Specialist',   short: 'DRAWS',     description: 'Group stage: draws. Knockouts: back the favourite' },
  giant_killer:    { label: 'Giant Killer',      short: 'GIANT KLR', description: 'Group: follow odds. Knockout: always the underdog' },
  totally_random:  { label: 'Totally Random',    short: 'CHAOS',     description: 'Outcome and score picked fully at random — pure chaos' },
}

const HOME_WIN_SCORES = [
  { s: [1, 0], w: 30 }, { s: [2, 0], w: 22 }, { s: [2, 1], w: 25 },
  { s: [3, 1], w: 13 }, { s: [3, 0], w: 10 },
] as const

const DRAW_SCORES = [
  { s: [1, 1], w: 45 }, { s: [0, 0], w: 32 }, { s: [2, 2], w: 20 }, { s: [3, 3], w: 3 },
] as const

const AWAY_WIN_SCORES = [
  { s: [0, 1], w: 30 }, { s: [0, 2], w: 22 }, { s: [1, 2], w: 25 },
  { s: [1, 3], w: 13 }, { s: [0, 3], w: 10 },
] as const

function weightedPick<T extends { w: number }>(items: readonly T[], rng: () => number): T {
  const total = items.reduce((s, i) => s + i.w, 0)
  let r = rng() * total
  for (const item of items) {
    r -= item.w
    if (r <= 0) return item
  }
  return items[items.length - 1]
}

type Outcome = 'home' | 'draw' | 'away'

function sampleScore(outcome: Outcome, rng: () => number): [number, number] {
  if (outcome === 'home') return [...weightedPick(HOME_WIN_SCORES, rng).s] as [number, number]
  if (outcome === 'draw') return [...weightedPick(DRAW_SCORES, rng).s]     as [number, number]
  return [...weightedPick(AWAY_WIN_SCORES, rng).s] as [number, number]
}

function implied(odds: number): number { return 1 / odds }

function pickPenaltyWinner(
  homeImpliedPct: number, awayImpliedPct: number,
  strategy: AutoFillStrategy, rng: () => number,
): 'home' | 'away' {
  if (strategy === 'upset_machine' || strategy === 'giant_killer') {
    // underdog wins
    return homeImpliedPct <= awayImpliedPct ? 'home' : 'away'
  }
  if (strategy === 'totally_random' || strategy === 'weighted_random') {
    const total = homeImpliedPct + awayImpliedPct
    return rng() < homeImpliedPct / total ? 'home' : 'away'
  }
  // favourite wins
  return homeImpliedPct >= awayImpliedPct ? 'home' : 'away'
}

export function autoFillGroupMatch(
  match: GroupMatch,
  strategy: AutoFillStrategy,
  rng: () => number = Math.random,
): MatchResult {
  const { oddsHome, oddsDraw, oddsAway } = match
  let outcome: Outcome
  let homeScore: number
  let awayScore: number

  switch (strategy) {
    case 'follow_odds': {
      const min = Math.min(oddsHome, oddsDraw, oddsAway)
      outcome = min === oddsHome ? 'home' : min === oddsAway ? 'away' : 'draw'
      ;[homeScore, awayScore] = sampleScore(outcome, rng)
      break
    }
    case 'fifa_ranking': {
      outcome = oddsHome <= oddsAway ? 'home' : 'away'
      ;[homeScore, awayScore] = sampleScore(outcome, rng)
      break
    }
    case 'weighted_random': {
      const pH = implied(oddsHome), pD = implied(oddsDraw), pA = implied(oddsAway)
      const total = pH + pD + pA
      let r = rng() * total
      if ((r -= pH) <= 0) outcome = 'home'
      else if ((r -= pD) <= 0) outcome = 'draw'
      else outcome = 'away'
      ;[homeScore, awayScore] = sampleScore(outcome, rng)
      break
    }
    case 'value_hunter': {
      const evH = implied(oddsHome) * oddsHome
      const evD = implied(oddsDraw) * oddsDraw
      const evA = implied(oddsAway) * oddsAway
      const scores: Array<[Outcome, number]> = [['home', evH], ['draw', evD], ['away', evA]]
      scores.sort((a, b) => b[1] - a[1])
      outcome = scores[0][0]
      if (outcome === 'home') { homeScore = 2; awayScore = 1 }
      else if (outcome === 'away') { homeScore = 1; awayScore = 2 }
      else { homeScore = 1; awayScore = 1 }
      break
    }
    case 'upset_machine': {
      const max = Math.max(oddsHome, oddsDraw, oddsAway)
      outcome = max === oddsHome ? 'home' : max === oddsAway ? 'away' : 'draw'
      if (outcome === 'home') { homeScore = 3; awayScore = 1 }
      else if (outcome === 'away') { homeScore = 1; awayScore = 3 }
      else { homeScore = 2; awayScore = 2 }
      break
    }
    case 'draw_specialist': {
      outcome = 'draw'
      homeScore = 1; awayScore = 1
      break
    }
    case 'giant_killer': {
      const min = Math.min(oddsHome, oddsDraw, oddsAway)
      outcome = min === oddsHome ? 'home' : min === oddsAway ? 'away' : 'draw'
      ;[homeScore, awayScore] = sampleScore(outcome, rng)
      break
    }
    case 'totally_random':
    default: {
      const r = rng()
      outcome = r < 1/3 ? 'home' : r < 2/3 ? 'draw' : 'away'
      ;[homeScore, awayScore] = sampleScore(outcome, rng)
      break
    }
  }

  return { homeScore, awayScore }
}

export function autoFillKOMatch(
  match: KOMatch,
  strategy: AutoFillStrategy,
  rng: () => number = Math.random,
): MatchResult | null {
  if (!match.home || !match.away) return null

  const { oddsHome, oddsDraw, oddsAway } = deriveMatchOdds(match.home.impliedPct, match.away.impliedPct)
  let outcome: Outcome
  let homeScore: number
  let awayScore: number

  switch (strategy) {
    case 'follow_odds': {
      const min = Math.min(oddsHome, oddsAway)
      outcome = min === oddsHome ? 'home' : 'away'
      ;[homeScore, awayScore] = sampleScore(outcome, rng)
      break
    }
    case 'fifa_ranking': {
      outcome = match.home.fifaRanking <= match.away.fifaRanking ? 'home' : 'away'
      ;[homeScore, awayScore] = sampleScore(outcome, rng)
      break
    }
    case 'weighted_random': {
      const pH = implied(oddsHome), pD = implied(oddsDraw), pA = implied(oddsAway)
      const total = pH + pD + pA
      let r = rng() * total
      if ((r -= pH) <= 0) outcome = 'home'
      else if ((r -= pD) <= 0) outcome = 'draw'
      else outcome = 'away'
      ;[homeScore, awayScore] = sampleScore(outcome, rng)
      break
    }
    case 'value_hunter': {
      const evH = implied(oddsHome) * oddsHome
      const evA = implied(oddsAway) * oddsAway
      outcome = evH >= evA ? 'home' : 'away'
      if (outcome === 'home') { homeScore = 2; awayScore = 1 }
      else { homeScore = 1; awayScore = 2 }
      break
    }
    case 'upset_machine': {
      outcome = oddsHome >= oddsAway ? 'home' : 'away'
      if (outcome === 'home') { homeScore = 2; awayScore = 1 }
      else { homeScore = 1; awayScore = 2 }
      break
    }
    case 'draw_specialist': {
      const min = Math.min(oddsHome, oddsAway)
      outcome = min === oddsHome ? 'home' : 'away'
      ;[homeScore, awayScore] = sampleScore(outcome, rng)
      break
    }
    case 'giant_killer': {
      outcome = oddsHome >= oddsAway ? 'home' : 'away'
      if (outcome === 'home') { homeScore = 2; awayScore = 1 }
      else { homeScore = 1; awayScore = 2 }
      break
    }
    case 'totally_random':
    default: {
      const r = rng()
      outcome = r < 1/3 ? 'home' : r < 2/3 ? 'draw' : 'away'
      ;[homeScore, awayScore] = sampleScore(outcome, rng)
      break
    }
  }

  let penaltyWinner: 'home' | 'away' | undefined
  if (homeScore === awayScore) {
    penaltyWinner = pickPenaltyWinner(match.home.impliedPct, match.away.impliedPct, strategy, rng)
  }

  return { homeScore, awayScore, penaltyWinner }
}
