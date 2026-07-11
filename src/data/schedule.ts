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
export const KNOWN_RESULTS: Record<number, { homeScore: number; awayScore: number; penaltyWinner?: 'home' | 'away'; psoHomeScore?: number; psoAwayScore?: number; resultType?: 'aet'; official: true }> = {
  // GROUP A
  1:  { homeScore: 2, awayScore: 0, official: true }, // Mexico 2-0 South Africa
  2:  { homeScore: 2, awayScore: 1, official: true }, // South Korea 2-1 Czechia
  3:  { homeScore: 1, awayScore: 1, official: true }, // Czechia 1-1 South Africa
  4:  { homeScore: 1, awayScore: 0, official: true }, // Mexico 1-0 South Korea
  5:  { homeScore: 0, awayScore: 3, official: true }, // Czechia 0-3 Mexico
  6:  { homeScore: 1, awayScore: 0, official: true }, // South Africa 1-0 South Korea
  // GROUP B
  7:  { homeScore: 1, awayScore: 1, official: true }, // Canada 1-1 Bosnia & Herzegovina
  8:  { homeScore: 1, awayScore: 1, official: true }, // Qatar 1-1 Switzerland
  9:  { homeScore: 4, awayScore: 1, official: true }, // Switzerland 4-1 Bosnia & Herzegovina
  10: { homeScore: 6, awayScore: 0, official: true }, // Canada 6-0 Qatar
  11: { homeScore: 2, awayScore: 1, official: true }, // Switzerland 2-1 Canada
  12: { homeScore: 3, awayScore: 1, official: true }, // Bosnia & Herzegovina 3-1 Qatar
  // GROUP C
  13: { homeScore: 1, awayScore: 1, official: true }, // Brazil 1-1 Morocco
  14: { homeScore: 0, awayScore: 1, official: true }, // Haiti 0-1 Scotland
  15: { homeScore: 3, awayScore: 0, official: true }, // Brazil 3-0 Haiti
  16: { homeScore: 0, awayScore: 1, official: true }, // Scotland 0-1 Morocco
  17: { homeScore: 0, awayScore: 3, official: true }, // Scotland 0-3 Brazil
  18: { homeScore: 4, awayScore: 2, official: true }, // Morocco 4-2 Haiti
  // GROUP D
  19: { homeScore: 4, awayScore: 1, official: true }, // USA 4-1 Paraguay
  20: { homeScore: 2, awayScore: 0, official: true }, // Australia 2-0 Türkiye
  21: { homeScore: 2, awayScore: 0, official: true }, // USA 2-0 Australia
  22: { homeScore: 0, awayScore: 1, official: true }, // Türkiye 0-1 Paraguay
  23: { homeScore: 3, awayScore: 2, official: true }, // Türkiye 3-2 USA
  24: { homeScore: 0, awayScore: 0, official: true }, // Paraguay 0-0 Australia
  // GROUP E
  25: { homeScore: 7, awayScore: 1, official: true }, // Germany 7-1 Curaçao
  26: { homeScore: 1, awayScore: 0, official: true }, // Côte d'Ivoire 1-0 Ecuador
  27: { homeScore: 2, awayScore: 1, official: true }, // Germany 2-1 Côte d'Ivoire
  28: { homeScore: 0, awayScore: 0, official: true }, // Ecuador 0-0 Curaçao
  29: { homeScore: 0, awayScore: 2, official: true }, // Curaçao 0-2 Côte d'Ivoire
  30: { homeScore: 2, awayScore: 1, official: true }, // Ecuador 2-1 Germany
  // GROUP F
  31: { homeScore: 2, awayScore: 2, official: true }, // Netherlands 2-2 Japan
  32: { homeScore: 5, awayScore: 1, official: true }, // Sweden 5-1 Tunisia
  33: { homeScore: 5, awayScore: 1, official: true }, // Netherlands 5-1 Sweden
  34: { homeScore: 0, awayScore: 4, official: true }, // Tunisia 0-4 Japan
  35: { homeScore: 1, awayScore: 1, official: true }, // Japan 1-1 Sweden
  36: { homeScore: 1, awayScore: 3, official: true }, // Tunisia 1-3 Netherlands
  // GROUP G
  37: { homeScore: 1, awayScore: 1, official: true }, // Belgium 1-1 Egypt
  38: { homeScore: 2, awayScore: 2, official: true }, // Iran 2-2 New Zealand
  39: { homeScore: 0, awayScore: 0, official: true }, // Belgium 0-0 Iran
  40: { homeScore: 1, awayScore: 3, official: true }, // New Zealand 1-3 Egypt
  41: { homeScore: 1, awayScore: 1, official: true }, // Egypt 1-1 Iran
  42: { homeScore: 1, awayScore: 5, official: true }, // New Zealand 1-5 Belgium
  // GROUP H
  43: { homeScore: 0, awayScore: 0, official: true }, // Spain 0-0 Cape Verde
  44: { homeScore: 1, awayScore: 1, official: true }, // Saudi Arabia 1-1 Uruguay
  45: { homeScore: 4, awayScore: 0, official: true }, // Spain 4-0 Saudi Arabia
  46: { homeScore: 2, awayScore: 2, official: true }, // Uruguay 2-2 Cape Verde
  47: { homeScore: 0, awayScore: 0, official: true }, // Cape Verde 0-0 Saudi Arabia
  48: { homeScore: 0, awayScore: 1, official: true }, // Uruguay 0-1 Spain
  // GROUP I
  49: { homeScore: 3, awayScore: 1, official: true }, // France 3-1 Senegal
  50: { homeScore: 1, awayScore: 4, official: true }, // Iraq 1-4 Norway
  51: { homeScore: 3, awayScore: 0, official: true }, // France 3-0 Iraq
  52: { homeScore: 3, awayScore: 2, official: true }, // Norway 3-2 Senegal
  53: { homeScore: 1, awayScore: 4, official: true }, // Norway 1-4 France
  54: { homeScore: 5, awayScore: 0, official: true }, // Senegal 5-0 Iraq
  // GROUP J
  55: { homeScore: 3, awayScore: 0, official: true }, // Argentina 3-0 Algeria
  56: { homeScore: 3, awayScore: 1, official: true }, // Austria 3-1 Jordan
  57: { homeScore: 2, awayScore: 0, official: true }, // Argentina 2-0 Austria
  58: { homeScore: 1, awayScore: 2, official: true }, // Jordan 1-2 Algeria
  59: { homeScore: 3, awayScore: 3, official: true }, // Algeria 3-3 Austria
  60: { homeScore: 1, awayScore: 3, official: true }, // Jordan 1-3 Argentina
  // GROUP K
  61: { homeScore: 1, awayScore: 1, official: true }, // Portugal 1-1 DR Congo
  62: { homeScore: 1, awayScore: 3, official: true }, // Uzbekistan 1-3 Colombia
  63: { homeScore: 5, awayScore: 0, official: true }, // Portugal 5-0 Uzbekistan
  64: { homeScore: 1, awayScore: 0, official: true }, // Colombia 1-0 DR Congo
  65: { homeScore: 0, awayScore: 0, official: true }, // Colombia 0-0 Portugal
  66: { homeScore: 3, awayScore: 1, official: true }, // DR Congo 3-1 Uzbekistan
  // GROUP L
  67: { homeScore: 4, awayScore: 2, official: true }, // England 4-2 Croatia
  68: { homeScore: 1, awayScore: 0, official: true }, // Ghana 1-0 Panama
  69: { homeScore: 0, awayScore: 0, official: true }, // England 0-0 Ghana
  70: { homeScore: 0, awayScore: 1, official: true }, // Panama 0-1 Croatia
  71: { homeScore: 0, awayScore: 2, official: true }, // Panama 0-2 England
  72: { homeScore: 2, awayScore: 1, official: true }, // Croatia 2-1 Ghana
  // R32
  73: { homeScore: 0, awayScore: 1, official: true }, // South Africa 0-1 Canada
  74: { homeScore: 1, awayScore: 1, penaltyWinner: 'away', psoHomeScore: 3, psoAwayScore: 4, official: true }, // Germany 1-1 Paraguay (Paraguay 4-3 pens)
  75: { homeScore: 1, awayScore: 1, penaltyWinner: 'away', psoHomeScore: 2, psoAwayScore: 3, official: true }, // Netherlands 1-1 Morocco (Morocco 3-2 pens)
  76: { homeScore: 2, awayScore: 1, official: true }, // Brazil 2-1 Japan
  77: { homeScore: 3, awayScore: 0, official: true }, // France 3-0 Sweden
  78: { homeScore: 1, awayScore: 2, official: true }, // Côte d'Ivoire 1-2 Norway
  79: { homeScore: 2, awayScore: 0, official: true }, // Mexico 2-0 Ecuador
  80: { homeScore: 2, awayScore: 1, official: true }, // England 2-1 DR Congo
  81: { homeScore: 2, awayScore: 0, official: true }, // USA 2-0 Bosnia & Herzegovina
  82: { homeScore: 3, awayScore: 2, resultType: 'aet', official: true }, // Belgium 3-2 Senegal (AET)
  83: { homeScore: 2, awayScore: 1, official: true }, // Portugal 2-1 Croatia
  84: { homeScore: 3, awayScore: 0, official: true }, // Spain 3-0 Austria
  85: { homeScore: 2, awayScore: 0, official: true }, // Switzerland 2-0 Algeria
  86: { homeScore: 3, awayScore: 2, resultType: 'aet', official: true }, // Argentina 3-2 Cape Verde (AET)
  87: { homeScore: 1, awayScore: 0, official: true }, // Colombia 1-0 Ghana
  88: { homeScore: 1, awayScore: 1, penaltyWinner: 'away', psoHomeScore: 2, psoAwayScore: 4, official: true }, // Australia 1-1 Egypt (Egypt 4-2 pens)
  // R16
  89: { homeScore: 0, awayScore: 1, official: true }, // Paraguay 0-1 France
  90: { homeScore: 0, awayScore: 3, official: true }, // Canada 0-3 Morocco
  91: { homeScore: 1, awayScore: 2, official: true }, // Brazil 1-2 Norway
  92: { homeScore: 2, awayScore: 3, official: true }, // Mexico 2-3 England
  93: { homeScore: 0, awayScore: 1, official: true }, // Portugal 0-1 Spain
  94: { homeScore: 1, awayScore: 4, official: true }, // USA 1-4 Belgium
  95: { homeScore: 3, awayScore: 2, official: true }, // Argentina 3-2 Egypt
  96: { homeScore: 0, awayScore: 0, penaltyWinner: 'home', psoHomeScore: 4, psoAwayScore: 3, official: true }, // Switzerland 0-0 Colombia (Switzerland 4-3 pens)
  // QF
  97: { homeScore: 2, awayScore: 0, official: true }, // France 2-0 Morocco
  98: { homeScore: 2, awayScore: 1, official: true }, // Spain 2-1 Belgium
}
