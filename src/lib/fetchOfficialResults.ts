import type { KOMatch, MatchResult } from '../types'
import { GROUP_MATCHES } from '../data/schedule'

const API_KEY = import.meta.env.VITE_FOOTBALL_DATA_API_KEY as string

// Maps football-data.org team names to simulation's canonical names
const TEAM_NAME_MAP: Record<string, string> = {
  'USA':                           'United States',
  'United States':                 'United States',
  'Korea Republic':                'South Korea',
  'Turkey':                        'Türkiye',
  'Turkiye':                       'Türkiye',
  'Curacao':                       'Curaçao',
  "Cote d'Ivoire":                 "Côte d'Ivoire",
  'Ivory Coast':                   "Côte d'Ivoire",
  'Bosnia and Herzegovina':        'Bosnia & Herzegovina',
  'Bosnia & Herzegovina':          'Bosnia & Herzegovina',
  'Congo DR':                      'DR Congo',
  'Democratic Republic of Congo':  'DR Congo',
  'Czech Republic':                'Czechia',
}

function normalize(name: string): string {
  return TEAM_NAME_MAP[name] ?? name
}

interface ApiMatch {
  homeTeam: { name: string }
  awayTeam: { name: string }
  status: string
  score: {
    winner: string | null
    duration: string
    fullTime: { home: number | null; away: number | null }
  }
}

export async function fetchOfficialResults(koMatches: KOMatch[]): Promise<Record<number, MatchResult>> {
  const res = await fetch(
    'https://api.football-data.org/v4/competitions/WC/matches?dateFrom=2026-06-11&dateTo=2026-07-20',
    { headers: { 'X-Auth-Token': API_KEY } }
  )
  if (!res.ok) throw new Error(`API ${res.status}`)

  const data: { matches: ApiMatch[] } = await res.json()

  // Build (homeTeam|awayTeam) → serial lookup for all known matches
  const lookup = new Map<string, number>()
  for (const m of GROUP_MATCHES) {
    lookup.set(`${m.home}|${m.away}`, m.serial)
  }
  for (const m of koMatches) {
    if (m.home && m.away) {
      lookup.set(`${m.home.name}|${m.away.name}`, m.serial)
    }
  }

  const official: Record<number, MatchResult> = {}
  for (const apiMatch of data.matches) {
    if (apiMatch.status !== 'FINISHED') continue
    const hs = apiMatch.score.fullTime.home
    const as_ = apiMatch.score.fullTime.away
    if (hs == null || as_ == null) continue

    const home = normalize(apiMatch.homeTeam.name)
    const away = normalize(apiMatch.awayTeam.name)
    const serial = lookup.get(`${home}|${away}`)
    if (serial == null) continue

    const result: MatchResult = { homeScore: hs, awayScore: as_, official: true }
    if (apiMatch.score.duration === 'PENALTY_SHOOTOUT') {
      result.penaltyWinner = apiMatch.score.winner === 'HOME_TEAM' ? 'home' : 'away'
    }
    official[serial] = result
  }

  return official
}
