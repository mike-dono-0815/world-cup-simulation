import type { GroupMatch } from '../types'
import { deriveMatchOdds } from '../lib/odds'
import { TEAM_MAP, HOME_ADVANTAGE_TEAMS } from './teams'

function match(
  serial: number, home: string, away: string,
  date: string, venue: string, group: string,
): GroupMatch {
  const h = TEAM_MAP.get(home)!
  const a = TEAM_MAP.get(away)!
  const homeAdv = HOME_ADVANTAGE_TEAMS.has(home) ? 0.45 : 0
  const odds = deriveMatchOdds(h.impliedPct, a.impliedPct, homeAdv)
  return {
    serial, home, away,
    homeFlagCode: h.flagCode,
    awayFlagCode: a.flagCode,
    group, date, venue,
    oddsHome: odds.oddsHome,
    oddsDraw: odds.oddsDraw,
    oddsAway: odds.oddsAway,
  }
}

export const GROUP_MATCHES: GroupMatch[] = [
  // GROUP A
  match(1,  'Mexico',              'South Africa',        '2026-06-11T19:00:00Z', 'Estadio Azteca, Mexico City',           'A'),
  match(2,  'South Korea',         'Czechia',             '2026-06-12T02:00:00Z', 'Estadio Akron, Guadalajara',            'A'),
  match(3,  'Czechia',             'South Africa',        '2026-06-18T16:00:00Z', 'Mercedes-Benz Stadium, Atlanta',        'A'),
  match(4,  'Mexico',              'South Korea',         '2026-06-19T01:00:00Z', 'Estadio Akron, Guadalajara',            'A'),
  match(5,  'Czechia',             'Mexico',              '2026-06-25T01:00:00Z', 'Estadio Azteca, Mexico City',           'A'),
  match(6,  'South Africa',        'South Korea',         '2026-06-25T01:00:00Z', 'Estadio BBVA, Monterrey',               'A'),
  // GROUP B
  match(7,  'Canada',              'Bosnia & Herzegovina','2026-06-12T19:00:00Z', 'BMO Field, Toronto',                    'B'),
  match(8,  'Qatar',               'Switzerland',         '2026-06-13T19:00:00Z', "Levi's Stadium, Santa Clara",           'B'),
  match(9,  'Switzerland',         'Bosnia & Herzegovina','2026-06-18T19:00:00Z', 'SoFi Stadium, Los Angeles',             'B'),
  match(10, 'Canada',              'Qatar',               '2026-06-17T22:00:00Z', 'BC Place, Vancouver',                   'B'),
  match(11, 'Switzerland',         'Canada',              '2026-06-24T19:00:00Z', 'BC Place, Vancouver',                   'B'),
  match(12, 'Bosnia & Herzegovina','Qatar',               '2026-06-24T19:00:00Z', 'Lumen Field, Seattle',                  'B'),
  // GROUP C
  match(13, 'Brazil',              'Morocco',             '2026-06-12T22:00:00Z', 'MetLife Stadium, East Rutherford',      'C'),
  match(14, 'Haiti',               'Scotland',            '2026-06-14T01:00:00Z', 'Gillette Stadium, Foxborough',          'C'),
  match(15, 'Brazil',              'Haiti',               '2026-06-19T00:30:00Z', 'Lincoln Financial Field, Philadelphia', 'C'),
  match(16, 'Scotland',            'Morocco',             '2026-06-19T22:00:00Z', 'Gillette Stadium, Foxborough',          'C'),
  match(17, 'Scotland',            'Brazil',              '2026-06-23T22:00:00Z', 'Hard Rock Stadium, Miami',              'C'),
  match(18, 'Morocco',             'Haiti',               '2026-06-23T22:00:00Z', 'Mercedes-Benz Stadium, Atlanta',        'C'),
  // GROUP D
  match(19, 'United States',       'Paraguay',            '2026-06-13T01:00:00Z', 'SoFi Stadium, Los Angeles',             'D'),
  match(20, 'Australia',           'Türkiye',             '2026-06-14T04:00:00Z', 'BC Place, Vancouver',                   'D'),
  match(21, 'United States',       'Australia',           '2026-06-19T19:00:00Z', 'Lumen Field, Seattle',                  'D'),
  match(22, 'Türkiye',             'Paraguay',            '2026-06-20T03:00:00Z', "Levi's Stadium, Santa Clara",           'D'),
  match(23, 'Türkiye',             'United States',       '2026-06-26T02:00:00Z', 'SoFi Stadium, Los Angeles',             'D'),
  match(24, 'Paraguay',            'Australia',           '2026-06-26T02:00:00Z', "Levi's Stadium, Santa Clara",           'D'),
  // GROUP E
  match(25, 'Germany',             'Curaçao',             '2026-06-14T17:00:00Z', 'NRG Stadium, Houston',                  'E'),
  match(26, "Côte d'Ivoire",       'Ecuador',             '2026-06-14T23:00:00Z', 'Lincoln Financial Field, Philadelphia', 'E'),
  match(27, 'Germany',             "Côte d'Ivoire",       '2026-06-20T20:00:00Z', 'BMO Field, Toronto',                    'E'),
  match(28, 'Ecuador',             'Curaçao',             '2026-06-21T00:00:00Z', 'Arrowhead Stadium, Kansas City',        'E'),
  match(29, 'Curaçao',             "Côte d'Ivoire",       '2026-06-25T20:00:00Z', 'Lincoln Financial Field, Philadelphia', 'E'),
  match(30, 'Ecuador',             'Germany',             '2026-06-25T20:00:00Z', 'MetLife Stadium, East Rutherford',      'E'),
  // GROUP F
  match(31, 'Netherlands',         'Japan',               '2026-06-14T20:00:00Z', 'AT&T Stadium, Arlington',               'F'),
  match(32, 'Sweden',              'Tunisia',             '2026-06-15T02:00:00Z', 'Estadio BBVA, Monterrey',               'F'),
  match(33, 'Netherlands',         'Sweden',              '2026-06-20T17:00:00Z', 'NRG Stadium, Houston',                  'F'),
  match(34, 'Tunisia',             'Japan',               '2026-06-21T04:00:00Z', 'Estadio BBVA, Monterrey',               'F'),
  match(35, 'Japan',               'Sweden',              '2026-06-25T23:00:00Z', 'AT&T Stadium, Arlington',               'F'),
  match(36, 'Tunisia',             'Netherlands',         '2026-06-25T23:00:00Z', 'Arrowhead Stadium, Kansas City',        'F'),
  // GROUP G
  match(37, 'Belgium',             'Egypt',               '2026-06-15T19:00:00Z', 'Lumen Field, Seattle',                  'G'),
  match(38, 'Iran',                'New Zealand',         '2026-06-16T01:00:00Z', 'SoFi Stadium, Los Angeles',             'G'),
  match(39, 'Belgium',             'Iran',                '2026-06-21T19:00:00Z', 'SoFi Stadium, Los Angeles',             'G'),
  match(40, 'New Zealand',         'Egypt',               '2026-06-22T01:00:00Z', 'BC Place, Vancouver',                   'G'),
  match(41, 'Egypt',               'Iran',                '2026-06-27T03:00:00Z', 'Lumen Field, Seattle',                  'G'),
  match(42, 'New Zealand',         'Belgium',             '2026-06-27T03:00:00Z', 'BC Place, Vancouver',                   'G'),
  // GROUP H
  match(43, 'Spain',               'Cape Verde',          '2026-06-15T16:00:00Z', 'Mercedes-Benz Stadium, Atlanta',        'H'),
  match(44, 'Saudi Arabia',        'Uruguay',             '2026-06-15T22:00:00Z', 'Hard Rock Stadium, Miami',              'H'),
  match(45, 'Spain',               'Saudi Arabia',        '2026-06-21T16:00:00Z', 'Mercedes-Benz Stadium, Atlanta',        'H'),
  match(46, 'Uruguay',             'Cape Verde',          '2026-06-21T22:00:00Z', 'Hard Rock Stadium, Miami',              'H'),
  match(47, 'Cape Verde',          'Saudi Arabia',        '2026-06-27T00:00:00Z', 'NRG Stadium, Houston',                  'H'),
  match(48, 'Uruguay',             'Spain',               '2026-06-27T00:00:00Z', 'Estadio Akron, Guadalajara',            'H'),
  // GROUP I
  match(49, 'France',              'Senegal',             '2026-06-16T19:00:00Z', 'MetLife Stadium, East Rutherford',      'I'),
  match(50, 'Iraq',                'Norway',              '2026-06-16T22:00:00Z', 'Gillette Stadium, Foxborough',          'I'),
  match(51, 'France',              'Iraq',                '2026-06-22T21:00:00Z', 'Lincoln Financial Field, Philadelphia', 'I'),
  match(52, 'Norway',              'Senegal',             '2026-06-23T00:00:00Z', 'MetLife Stadium, East Rutherford',      'I'),
  match(53, 'Norway',              'France',              '2026-06-26T19:00:00Z', 'Gillette Stadium, Foxborough',          'I'),
  match(54, 'Senegal',             'Iraq',                '2026-06-26T19:00:00Z', 'BMO Field, Toronto',                    'I'),
  // GROUP J
  match(55, 'Argentina',           'Algeria',             '2026-06-17T01:00:00Z', 'Arrowhead Stadium, Kansas City',        'J'),
  match(56, 'Austria',             'Jordan',              '2026-06-17T04:00:00Z', "Levi's Stadium, Santa Clara",           'J'),
  match(57, 'Argentina',           'Austria',             '2026-06-22T17:00:00Z', 'AT&T Stadium, Arlington',               'J'),
  match(58, 'Jordan',              'Algeria',             '2026-06-23T03:00:00Z', "Levi's Stadium, Santa Clara",           'J'),
  match(59, 'Algeria',             'Austria',             '2026-06-28T02:00:00Z', 'Arrowhead Stadium, Kansas City',        'J'),
  match(60, 'Jordan',              'Argentina',           '2026-06-28T02:00:00Z', 'AT&T Stadium, Arlington',               'J'),
  // GROUP K
  match(61, 'Portugal',            'DR Congo',            '2026-06-17T17:00:00Z', 'NRG Stadium, Houston',                  'K'),
  match(62, 'Uzbekistan',          'Colombia',            '2026-06-18T02:00:00Z', 'Estadio Azteca, Mexico City',           'K'),
  match(63, 'Portugal',            'Uzbekistan',          '2026-06-23T17:00:00Z', 'NRG Stadium, Houston',                  'K'),
  match(64, 'Colombia',            'DR Congo',            '2026-06-24T02:00:00Z', 'Estadio Akron, Guadalajara',            'K'),
  match(65, 'Colombia',            'Portugal',            '2026-06-27T23:30:00Z', 'Hard Rock Stadium, Miami',              'K'),
  match(66, 'DR Congo',            'Uzbekistan',          '2026-06-27T23:30:00Z', 'Mercedes-Benz Stadium, Atlanta',        'K'),
  // GROUP L
  match(67, 'England',             'Croatia',             '2026-06-17T20:00:00Z', 'AT&T Stadium, Arlington',               'L'),
  match(68, 'Ghana',               'Panama',              '2026-06-17T23:00:00Z', 'BMO Field, Toronto',                    'L'),
  match(69, 'England',             'Ghana',               '2026-06-23T20:00:00Z', 'Gillette Stadium, Foxborough',          'L'),
  match(70, 'Panama',              'Croatia',             '2026-06-23T23:00:00Z', 'BMO Field, Toronto',                    'L'),
  match(71, 'Panama',              'England',             '2026-06-27T21:00:00Z', 'MetLife Stadium, East Rutherford',      'L'),
  match(72, 'Croatia',             'Ghana',               '2026-06-27T21:00:00Z', 'Lincoln Financial Field, Philadelphia', 'L'),
]

export const GROUP_MATCH_MAP = new Map(GROUP_MATCHES.map(m => [m.serial, m]))

export const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'] as const
export type GroupId = typeof GROUPS[number]

// Confirmed group-stage results. Used as initial state so the sim reflects
// reality even before the API sync fires. Keyed by serial number.
export const KNOWN_RESULTS: Record<number, { homeScore: number; awayScore: number; penaltyWinner?: 'home' | 'away'; official: true }> = {
  59: { homeScore: 3, awayScore: 3, official: true }, // Algeria 3-3 Austria
  60: { homeScore: 1, awayScore: 3, official: true }, // Jordan 1-3 Argentina
  // R32 results
  73: { homeScore: 0, awayScore: 1, official: true }, // South Africa 0-1 Canada
  74: { homeScore: 1, awayScore: 1, penaltyWinner: 'away', official: true }, // Germany 1-1 Paraguay AET (Paraguay 4-3 pens)
  75: { homeScore: 1, awayScore: 1, penaltyWinner: 'away', official: true }, // Netherlands 1-1 Morocco AET (Morocco 3-2 pens)
  76: { homeScore: 2, awayScore: 1, official: true }, // Brazil 2-1 Japan
}
