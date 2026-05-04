const BOOKMAKER_MARGIN = 0.05

export function deriveMatchOdds(
  impliedPctHome: number,
  impliedPctAway: number,
  homeAdvantage = 0.0,
): { oddsHome: number; oddsDraw: number; oddsAway: number } {
  const diff =
    Math.log(Math.max(0.01, impliedPctHome)) -
    Math.log(Math.max(0.01, impliedPctAway)) +
    homeAdvantage

  let pA = 1 / (1 + Math.exp(-diff * 0.30))
  let pDraw = Math.max(0.03, 0.26 * Math.exp(-0.04 * diff * diff))
  let pB = Math.max(0.015, 1 - pA - pDraw)

  const total = pA + pDraw + pB
  pA /= total; pDraw /= total; pB /= total

  const m = 1 + BOOKMAKER_MARGIN
  return {
    oddsHome: parseFloat((m / pA).toFixed(2)),
    oddsDraw: parseFloat((m / pDraw).toFixed(2)),
    oddsAway: parseFloat((m / pB).toFixed(2)),
  }
}
