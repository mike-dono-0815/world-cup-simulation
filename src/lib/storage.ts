import type { MatchResult } from '../types'

const KEY = 'wc2026_sim'

export function loadResults(): Record<number, MatchResult> {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Record<number, MatchResult>
  } catch {
    return {}
  }
}

export function saveResults(results: Record<number, MatchResult>): void {
  localStorage.setItem(KEY, JSON.stringify(results))
}

export function clearResults(): void {
  localStorage.removeItem(KEY)
}
