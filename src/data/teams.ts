import type { Team } from '../types'

export const TEAMS: Team[] = [
  // Group A
  { name: 'Mexico',               flagCode: 'mx',     impliedPct: 1.41,  fifaRanking: 15,  group: 'A' },
  { name: 'South Korea',          flagCode: 'kr',     impliedPct: 0.28,  fifaRanking: 25,  group: 'A' },
  { name: 'South Africa',         flagCode: 'za',     impliedPct: 0.12,  fifaRanking: 60,  group: 'A' },
  { name: 'Czechia',              flagCode: 'cz',     impliedPct: 0.66,  fifaRanking: 41,  group: 'A' },
  // Group B
  { name: 'Canada',               flagCode: 'ca',     impliedPct: 0.50,  fifaRanking: 30,  group: 'B' },
  { name: 'Bosnia & Herzegovina', flagCode: 'ba',     impliedPct: 0.40,  fifaRanking: 65,  group: 'B' },
  { name: 'Qatar',                flagCode: 'qa',     impliedPct: 0.10,  fifaRanking: 55,  group: 'B' },
  { name: 'Switzerland',          flagCode: 'ch',     impliedPct: 0.99,  fifaRanking: 19,  group: 'B' },
  // Group C
  { name: 'Brazil',               flagCode: 'br',     impliedPct: 10.53, fifaRanking: 6,   group: 'C' },
  { name: 'Morocco',              flagCode: 'ma',     impliedPct: 1.64,  fifaRanking: 8,   group: 'C' },
  { name: 'Haiti',                flagCode: 'ht',     impliedPct: 0.067, fifaRanking: 83,  group: 'C' },
  { name: 'Scotland',             flagCode: 'gb-sct', impliedPct: 0.50,  fifaRanking: 43,  group: 'C' },
  // Group D
  { name: 'United States',        flagCode: 'us',     impliedPct: 1.52,  fifaRanking: 16,  group: 'D' },
  { name: 'Paraguay',             flagCode: 'py',     impliedPct: 0.50,  fifaRanking: 40,  group: 'D' },
  { name: 'Australia',            flagCode: 'au',     impliedPct: 0.22,  fifaRanking: 27,  group: 'D' },
  { name: 'Türkiye',              flagCode: 'tr',     impliedPct: 1.52,  fifaRanking: 22,  group: 'D' },
  // Group E
  { name: 'Germany',              flagCode: 'de',     impliedPct: 6.67,  fifaRanking: 10,  group: 'E' },
  { name: "Côte d'Ivoire",        flagCode: 'ci',     impliedPct: 0.40,  fifaRanking: 34,  group: 'E' },
  { name: 'Ecuador',              flagCode: 'ec',     impliedPct: 1.23,  fifaRanking: 23,  group: 'E' },
  { name: 'Curaçao',              flagCode: 'cw',     impliedPct: 0.067, fifaRanking: 82,  group: 'E' },
  // Group F
  { name: 'Netherlands',          flagCode: 'nl',     impliedPct: 4.76,  fifaRanking: 7,   group: 'F' },
  { name: 'Japan',                flagCode: 'jp',     impliedPct: 1.96,  fifaRanking: 18,  group: 'F' },
  { name: 'Sweden',               flagCode: 'se',     impliedPct: 1.23,  fifaRanking: 38,  group: 'F' },
  { name: 'Tunisia',              flagCode: 'tn',     impliedPct: 0.20,  fifaRanking: 44,  group: 'F' },
  // Group G
  { name: 'Belgium',              flagCode: 'be',     impliedPct: 2.78,  fifaRanking: 9,   group: 'G' },
  { name: 'Egypt',                flagCode: 'eg',     impliedPct: 0.33,  fifaRanking: 29,  group: 'G' },
  { name: 'Iran',                 flagCode: 'ir',     impliedPct: 0.33,  fifaRanking: 21,  group: 'G' },
  { name: 'New Zealand',          flagCode: 'nz',     impliedPct: 0.10,  fifaRanking: 85,  group: 'G' },
  // Group H
  { name: 'Spain',                flagCode: 'es',     impliedPct: 18.18, fifaRanking: 2,   group: 'H' },
  { name: 'Saudi Arabia',         flagCode: 'sa',     impliedPct: 0.10,  fifaRanking: 61,  group: 'H' },
  { name: 'Uruguay',              flagCode: 'uy',     impliedPct: 1.52,  fifaRanking: 17,  group: 'H' },
  { name: 'Cape Verde',           flagCode: 'cv',     impliedPct: 0.10,  fifaRanking: 69,  group: 'H' },
  // Group I
  { name: 'France',               flagCode: 'fr',     impliedPct: 15.38, fifaRanking: 1,   group: 'I' },
  { name: 'Senegal',              flagCode: 'sn',     impliedPct: 0.99,  fifaRanking: 14,  group: 'I' },
  { name: 'Iraq',                 flagCode: 'iq',     impliedPct: 0.10,  fifaRanking: 57,  group: 'I' },
  { name: 'Norway',               flagCode: 'no',     impliedPct: 3.45,  fifaRanking: 31,  group: 'I' },
  // Group J
  { name: 'Argentina',            flagCode: 'ar',     impliedPct: 10.53, fifaRanking: 3,   group: 'J' },
  { name: 'Algeria',              flagCode: 'dz',     impliedPct: 0.28,  fifaRanking: 28,  group: 'J' },
  { name: 'Austria',              flagCode: 'at',     impliedPct: 0.99,  fifaRanking: 24,  group: 'J' },
  { name: 'Jordan',               flagCode: 'jo',     impliedPct: 0.067, fifaRanking: 63,  group: 'J' },
  // Group K
  { name: 'Portugal',             flagCode: 'pt',     impliedPct: 8.33,  fifaRanking: 5,   group: 'K' },
  { name: 'Colombia',             flagCode: 'co',     impliedPct: 2.44,  fifaRanking: 13,  group: 'K' },
  { name: 'Uzbekistan',           flagCode: 'uz',     impliedPct: 0.067, fifaRanking: 50,  group: 'K' },
  { name: 'DR Congo',             flagCode: 'cd',     impliedPct: 0.14,  fifaRanking: 46,  group: 'K' },
  // Group L
  { name: 'England',              flagCode: 'gb-eng', impliedPct: 13.33, fifaRanking: 4,   group: 'L' },
  { name: 'Croatia',              flagCode: 'hr',     impliedPct: 1.10,  fifaRanking: 11,  group: 'L' },
  { name: 'Ghana',                flagCode: 'gh',     impliedPct: 0.28,  fifaRanking: 74,  group: 'L' },
  { name: 'Panama',               flagCode: 'pa',     impliedPct: 0.10,  fifaRanking: 33,  group: 'L' },
]

export const TEAM_MAP = new Map(TEAMS.map(t => [t.name, t]))

export const HOME_ADVANTAGE_TEAMS = new Set(['United States', 'Mexico', 'Canada'])
