export type Lang = 'en' | 'de' | 'es'

export interface StrategyLabel {
  label: string
  short: string
  description: string
}

export interface Translations {
  // Masthead
  masthead_meta: string
  matches_reported: (n: number) => string
  title: string
  tagline: string
  btn_autofill: string
  btn_reset: string
  // Phase nav
  phase_groups: string
  phase_r32: string
  phase_r16: string
  phase_qf: string
  phase_sf: string
  phase_3rd: string
  phase_final: string
  n_reported: (played: number, total: number) => string
  // Champion banner
  world_champion: string
  // Reset dialog
  erratum: string
  reset_title: string
  reset_body: (n: number) => string
  btn_cancel: string
  // Footer
  footer: string
  // Group tab
  the_fixtures: string
  six_matches_tagline: string
  // Standings table
  the_table: string
  group_label: (g: string, played: number) => string
  top_two_advance: string
  best_eight_third: string
  col_club: string
  col_pld: string
  col_w: string
  col_d: string
  col_l: string
  col_gf: string
  col_ga: string
  col_gd: string
  col_pts: string
  col_status: string
  tiebreakers: string
  updated_continuously: string
  status_advance: string
  status_third: string
  status_out: string
  // Match card
  reported: string
  pending: string
  clear_result_aria: string
  penalties_won_by: string
  the_odds: string
  // KO section
  ko_reported: (played: number, total: number) => string
  awaiting_finalists: string
  the_final_title: string
  tbd_awaits: string
  // AutoFill modal
  oracle_eyebrow: string
  autofill_title: string
  autofill_desc: (n: number, phase: string) => string
  btn_fill: (n: number) => string
  // Best 3rd tab
  best3rd_tab: string
  best3rd_title: string
  best3rd_title_2: string
  best3rd_groups_done: (n: number) => string
  col_group: string
  // Help modal
  help_eyebrow: string
  help_title: string
  help_s1_heading: string
  help_s1_body: string
  help_s2_heading: string
  help_s2_body: string
  help_s3_heading: string
  help_s3_body: string
  help_s4_heading: string
  help_s4_body: string
  help_s5_heading: string
  help_s5_body: string
  btn_close: string
  // Team names
  teamName: (name: string) => string
  // Strategies
  strategies: Record<string, StrategyLabel>
}

const DE_TEAM_NAMES: Record<string, string> = {
  'Mexico':               'Mexiko',
  'South Korea':          'Südkorea',
  'South Africa':         'Südafrika',
  'Czechia':              'Tschechien',
  'Canada':               'Kanada',
  'Bosnia & Herzegovina': 'Bosnien-Herzegowina',
  'Qatar':                'Katar',
  'Switzerland':          'Schweiz',
  'Brazil':               'Brasilien',
  'Morocco':              'Marokko',
  'Scotland':             'Schottland',
  'United States':        'USA',
  'Australia':            'Australien',
  'Türkiye':              'Türkei',
  'Germany':              'Deutschland',
  "Côte d'Ivoire":        'Elfenbeinküste',
  'Netherlands':          'Niederlande',
  'Sweden':               'Schweden',
  'Tunisia':              'Tunesien',
  'Belgium':              'Belgien',
  'Egypt':                'Ägypten',
  'New Zealand':          'Neuseeland',
  'Spain':                'Spanien',
  'Saudi Arabia':         'Saudi-Arabien',
  'Cape Verde':           'Kap Verde',
  'France':               'Frankreich',
  'Iraq':                 'Irak',
  'Norway':               'Norwegen',
  'Argentina':            'Argentinien',
  'Algeria':              'Algerien',
  'Austria':              'Österreich',
  'Jordan':               'Jordanien',
  'Colombia':             'Kolumbien',
  'Uzbekistan':           'Usbekistan',
  'DR Congo':             'DR Kongo',
  'Croatia':              'Kroatien',
}

const ES_TEAM_NAMES: Record<string, string> = {
  'Mexico':               'México',
  'South Korea':          'Corea del Sur',
  'South Africa':         'Sudáfrica',
  'Czechia':              'Chequia',
  'Canada':               'Canadá',
  'Bosnia & Herzegovina': 'Bosnia y Herzegovina',
  'Qatar':                'Catar',
  'Switzerland':          'Suiza',
  'Brazil':               'Brasil',
  'Morocco':              'Marruecos',
  'Haiti':                'Haití',
  'Scotland':             'Escocia',
  'United States':        'Estados Unidos',
  'Türkiye':              'Turquía',
  'Germany':              'Alemania',
  "Côte d'Ivoire":        'Costa de Marfil',
  'Curaçao':              'Curazao',
  'Netherlands':          'Países Bajos',
  'Japan':                'Japón',
  'Sweden':               'Suecia',
  'Tunisia':              'Túnez',
  'Belgium':              'Bélgica',
  'Egypt':                'Egipto',
  'Iran':                 'Irán',
  'New Zealand':          'Nueva Zelanda',
  'Spain':                'España',
  'Saudi Arabia':         'Arabia Saudita',
  'Cape Verde':           'Cabo Verde',
  'France':               'Francia',
  'Iraq':                 'Irak',
  'Norway':               'Noruega',
  'Algeria':              'Argelia',
  'Jordan':               'Jordania',
  'Uzbekistan':           'Uzbekistán',
  'DR Congo':             'RD Congo',
  'England':              'Inglaterra',
  'Croatia':              'Croacia',
  'Panama':               'Panamá',
}

const en: Translations = {
  masthead_meta: 'Vol. XXIII · Estd. 2026 · United Hosts: USA · CAN · MEX',
  matches_reported: n => `${n}/104 matches reported`,
  title: 'The World Cup Chronicle',
  tagline: '"All Eyes on the Beautiful Game" — Predicting the 2026 World Cup Outcome',
  btn_autofill: 'Auto-fill',
  btn_reset: 'Reset',
  phase_groups: 'Group Stage',
  phase_r32: 'Round of 32',
  phase_r16: 'Round of 16',
  phase_qf: 'Quarter-Finals',
  phase_sf: 'Semi-Finals',
  phase_3rd: '3rd Place',
  phase_final: 'The Final',
  n_reported: (p, t) => `${p}/${t} reported`,
  world_champion: 'World Champion',
  erratum: 'Erratum',
  reset_title: 'Reset all results?',
  reset_body: n => `This clears all ${n} entered results and starts the simulation from scratch. This cannot be undone.`,
  btn_cancel: 'Cancel',
  footer: 'The World Cup Chronicle · Forecasted, not foretold · 2026 ed.',
  the_fixtures: 'The Fixtures',
  six_matches_tagline: 'Six matches · top two advance',
  the_table: 'The Table',
  group_label: (g, p) => p > 0 ? `Group ${g} (${p}/6)` : `Group ${g}`,
  top_two_advance: '↑ Top two advance',
  best_eight_third: '↗ Best eight 3rd qualify',
  col_club: 'Nation',
  col_pld: 'Pld',
  col_w: 'W',
  col_d: 'D',
  col_l: 'L',
  col_gf: 'GF',
  col_ga: 'GA',
  col_gd: 'GD',
  col_pts: 'Pts',
  col_status: 'Status',
  tiebreakers: 'Tiebreakers: Pts · H2H · GD · GF · FIFA rank',
  updated_continuously: 'Updated continuously',
  status_advance: '✓ Advance',
  status_third: '~ Third',
  status_out: '— Out',
  reported: '✓ Reported',
  pending: 'Pending',
  clear_result_aria: 'Clear result',
  penalties_won_by: 'Penalties won by',
  the_odds: 'The Odds',
  ko_reported: (p, t) => `${p}/${t} reported`,
  awaiting_finalists: 'Awaiting finalists',
  the_final_title: 'The Final',
  tbd_awaits: 'Awaits',
  oracle_eyebrow: 'The Oracle',
  autofill_title: 'Auto-fill',
  autofill_desc: (n, phase) => `Filling ${n} game${n !== 1 ? 's' : ''} in the ${phase} only.`,
  btn_fill: n => `Fill ${n} game${n !== 1 ? 's' : ''}`,
  best3rd_tab: 'Best 3rd',
  best3rd_title: 'Best Third-Place',
  best3rd_title_2: 'Teams',
  best3rd_groups_done: n => `${n}/12 groups complete`,
  col_group: 'Grp',
  help_eyebrow: 'The Guide',
  help_title: 'How to Use',
  help_s1_heading: 'Simulate the Tournament',
  help_s1_body: 'Enter home and away scores for any match — the bracket updates live. Work through all 104 matches (72 group stage + 32 knockout) or mix manual entries with Auto-fill.',
  help_s2_heading: 'Auto-fill & Strategies',
  help_s2_body: 'Auto-fill completes every unplayed game in the current phase using one of eight strategies — from following bookmaker odds to pure chaos. Your manual picks are never overwritten.',
  help_s3_heading: 'Experiment Freely',
  help_s3_body: 'Click × on any result to clear it. If the change affects which teams advance, all downstream knockout scores are reset automatically so results stay consistent.',
  help_s4_heading: 'Tournament Structure',
  help_s4_body: 'The top two from each of the 12 groups advance automatically (24 teams). The 8 best third-place finishers across all groups also qualify — ranked by points, goal difference, goals scored, and FIFA ranking. Their slots in the Round of 32 are fixed by a 495-entry lookup table that depends on exactly which groups produced advancing thirds. From there it is straight knockout: Round of 32 → Round of 16 → Quarter-Finals → Semi-Finals → Third-Place Play-off and The Final.',
  help_s5_heading: 'Group Tiebreakers',
  help_s5_body: 'Teams level on points are separated by head-to-head record among the tied teams (pts → GD → GF), then overall goal difference, goals scored, and finally FIFA ranking.',
  btn_close: 'Close',
  teamName: name => name,
  strategies: {
    follow_odds:     { label: 'Follow the Odds',    short: 'ODDS FAV',  description: 'Always back the bookmaker favourite' },
    fifa_ranking:    { label: 'FIFA Ranking',        short: 'FIFA RNK',  description: 'Higher-ranked team wins; no draws' },
    weighted_random: { label: 'Weighted Random',     short: 'RANDOM',    description: 'Odds-weighted random picks with varied scores' },
    value_hunter:    { label: 'Value Hunter',        short: 'VALUE',     description: 'Targets the outcome with the best perceived value' },
    upset_machine:   { label: 'Upset Machine',       short: 'UPSETS',    description: 'Always pick the biggest underdog' },
    draw_specialist: { label: 'Draw Specialist',     short: 'DRAWS',     description: 'Group stage: draws. Knockouts: back the favourite' },
    giant_killer:    { label: 'Giant Killer',        short: 'GIANT KLR', description: 'Group: follow odds. Knockout: always the underdog' },
    totally_random:  { label: 'Totally Random',      short: 'CHAOS',     description: 'Outcome and score picked fully at random — pure chaos' },
  },
}

const de: Translations = {
  masthead_meta: 'Bd. XXIII · Gegr. 2026 · Gastgeber: USA · KAN · MEX',
  matches_reported: n => `${n}/104 Spiele eingetragen`,
  title: 'Die WM-Chronik',
  tagline: '„Alle Augen auf das schöne Spiel" — Das Ergebnis der WM 2026 voraussagen',
  btn_autofill: 'Auto-Füllen',
  btn_reset: 'Rücksetzen',
  phase_groups: 'Gruppenphase',
  phase_r32: 'Runde der 32',
  phase_r16: 'Achtelfinale',
  phase_qf: 'Viertelfinale',
  phase_sf: 'Halbfinale',
  phase_3rd: 'Spiel um Platz 3',
  phase_final: 'Das Finale',
  n_reported: (p, t) => `${p}/${t} eingetragen`,
  world_champion: 'Weltmeister',
  erratum: 'Erratum',
  reset_title: 'Alle Ergebnisse zurücksetzen?',
  reset_body: n => `Dies löscht alle ${n} eingetragenen Ergebnisse und startet die Simulation neu. Dies kann nicht rückgängig gemacht werden.`,
  btn_cancel: 'Abbrechen',
  footer: 'Die WM-Chronik · Prognostiziert, nicht vorherbestimmt · Ausg. 2026',
  the_fixtures: 'Begegnungen',
  six_matches_tagline: '6 Spiele · Top 2 steigen auf',
  the_table: 'Die Tabelle',
  group_label: (g, p) => p > 0 ? `Gruppe ${g} (${p}/6)` : `Gruppe ${g}`,
  top_two_advance: '↑ 2 Ersten steigen auf',
  best_eight_third: '↗ 8 beste Dritte qualifizieren sich',
  col_club: 'Nation',
  col_pld: 'Sp',
  col_w: 'S',
  col_d: 'U',
  col_l: 'N',
  col_gf: 'T+',
  col_ga: 'T-',
  col_gd: 'TD',
  col_pts: 'Pkt',
  col_status: 'Status',
  tiebreakers: 'Tiebreaker: Pkt · H2H · TD · T+ · FIFA-Rang',
  updated_continuously: 'Laufend aktualisiert',
  status_advance: '✓ Aufstieg',
  status_third: '~ Dritter',
  status_out: '— Aus',
  reported: '✓ Eingetragen',
  pending: 'Ausstehend',
  clear_result_aria: 'Ergebnis löschen',
  penalties_won_by: 'Elfmeter gewonnen von',
  the_odds: 'Die Quoten',
  ko_reported: (p, t) => `${p}/${t} eingetragen`,
  awaiting_finalists: 'Warten auf Finalisten',
  the_final_title: 'Das Finale',
  tbd_awaits: 'Ausstehend',
  oracle_eyebrow: 'Das Orakel',
  autofill_title: 'Auto-Füllen',
  autofill_desc: (n, phase) => `Füllt ${n} Spiel${n !== 1 ? 'e' : ''} in der ${phase}.`,
  btn_fill: n => `${n} Spiel${n !== 1 ? 'e' : ''} füllen`,
  best3rd_tab: 'Beste Dritte',
  best3rd_title: 'Beste',
  best3rd_title_2: 'Drittplatzierte',
  best3rd_groups_done: n => `${n}/12 Gruppen abgeschlossen`,
  col_group: 'Gr.',
  help_eyebrow: 'Der Leitfaden',
  help_title: 'So funktioniert\'s',
  help_s1_heading: 'Das Turnier simulieren',
  help_s1_body: 'Ergebnisse für beliebige Spiele eingeben — das Tableau aktualisiert sich live. Alle 104 Spiele manuell eintragen (72 Gruppenphase + 32 K.O.) oder mit Auto-Füllen kombinieren.',
  help_s2_heading: 'Auto-Füllen & Strategien',
  help_s2_body: 'Auto-Füllen füllt alle offenen Spiele der aktuellen Phase mit einer von acht Strategien — von Buchmacherquoten bis totales Chaos. Bereits eingetragene Ergebnisse werden nie überschrieben.',
  help_s3_heading: 'Frei experimentieren',
  help_s3_body: 'Auf × einer Ergebniskarte klicken, um das Ergebnis zu löschen. Ändert sich dadurch, welche Teams aufsteigen, werden alle späteren K.O.-Ergebnisse automatisch zurückgesetzt.',
  help_s4_heading: 'Turniermechanismus',
  help_s4_body: 'Die ersten zwei Teams jeder der 12 Gruppen steigen direkt auf (24 Teams). Die 8 besten Drittplatzierten aller Gruppen qualifizieren sich ebenfalls — nach Punkten, Tordifferenz, Toren und FIFA-Rang. Ihre Platzierung in der Runde der 32 ergibt sich aus einer Tabelle mit 495 Einträgen abhängig davon, aus welchen Gruppen die Drittplatzierten kommen. Danach folgt K.O.: Runde der 32 → Achtelfinale → Viertelfinale → Halbfinale → Spiel um Platz 3 und Finale.',
  help_s5_heading: 'Gruppenentscheidungen',
  help_s5_body: 'Bei Punktgleichheit: direkter Vergleich der betroffenen Teams (Pkt → TD → T+), danach Gesamt-Tordifferenz, Gesamttore, FIFA-Rang.',
  btn_close: 'Schließen',
  teamName: name => DE_TEAM_NAMES[name] ?? name,
  strategies: {
    follow_odds:     { label: 'Den Quoten folgen',        short: 'FAVORIT',  description: 'Immer den Buchmacherfavoriten unterstützen' },
    fifa_ranking:    { label: 'FIFA-Rangliste',            short: 'FIFA RNK', description: 'Das höher eingestufte Team gewinnt; keine Unentschieden' },
    weighted_random: { label: 'Gewichteter Zufall',        short: 'ZUFALL',   description: 'Quotengewichtete Zufallsergebnisse mit variierenden Toren' },
    value_hunter:    { label: 'Wert-Jäger',                short: 'WERT',     description: 'Zielt auf das Ergebnis mit dem besten wahrgenommenen Wert' },
    upset_machine:   { label: 'Überraschungsmaschine',     short: 'UPSET',    description: 'Immer den größten Außenseiter wählen' },
    draw_specialist: { label: 'Unentschieden-Spezialist',  short: 'REMIS',    description: 'Gruppenphase: Unentschieden. KO: den Favoriten' },
    giant_killer:    { label: 'Riesenkiller',               short: 'RIESEN',   description: 'Gruppe: Quoten folgen. KO: immer der Außenseiter' },
    totally_random:  { label: 'Totales Chaos',              short: 'CHAOS',    description: 'Ergebnis und Tore vollständig zufällig — pures Chaos' },
  },
}

const es: Translations = {
  masthead_meta: 'Vol. XXIII · Fundado 2026 · Anfitriones: EUA · CAN · MEX',
  matches_reported: n => `${n}/104 partidos registrados`,
  title: 'La Crónica del Mundial',
  tagline: '"Todos los Ojos en el Bello Juego" — Prediciendo el Resultado del Mundial 2026',
  btn_autofill: 'Auto-rellenar',
  btn_reset: 'Reiniciar',
  phase_groups: 'Fase de Grupos',
  phase_r32: 'Ronda de 32',
  phase_r16: 'Octavos de Final',
  phase_qf: 'Cuartos de Final',
  phase_sf: 'Semifinales',
  phase_3rd: 'Tercer Lugar',
  phase_final: 'La Final',
  n_reported: (p, t) => `${p}/${t} registrados`,
  world_champion: 'Campeón del Mundo',
  erratum: 'Erratum',
  reset_title: '¿Reiniciar todos los resultados?',
  reset_body: n => `Esto borra los ${n} resultados ingresados y reinicia la simulación. No se puede deshacer.`,
  btn_cancel: 'Cancelar',
  footer: 'La Crónica del Mundial · Pronosticado, no predestinado · Ed. 2026',
  the_fixtures: 'Partidos',
  six_matches_tagline: '6 partidos · los 2 primeros avanzan',
  the_table: 'La Tabla',
  group_label: (g, p) => p > 0 ? `Grupo ${g} (${p}/6)` : `Grupo ${g}`,
  top_two_advance: '↑ Los 2 primeros avanzan',
  best_eight_third: '↗ Los mejores 8 terceros califican',
  col_club: 'Nación',
  col_pld: 'PJ',
  col_w: 'G',
  col_d: 'E',
  col_l: 'P',
  col_gf: 'GF',
  col_ga: 'GC',
  col_gd: 'DG',
  col_pts: 'Pts',
  col_status: 'Estado',
  tiebreakers: 'Desempate: Pts · H2H · DG · GF · FIFA Rank',
  updated_continuously: 'Actualizado',
  status_advance: '✓ Avanza',
  status_third: '~ Tercero',
  status_out: '— Eliminado',
  reported: '✓ Registrado',
  pending: 'Pendiente',
  clear_result_aria: 'Borrar resultado',
  penalties_won_by: 'Penaltis ganados por',
  the_odds: 'Las Cuotas',
  ko_reported: (p, t) => `${p}/${t} registrados`,
  awaiting_finalists: 'Esperando finalistas',
  the_final_title: 'La Final',
  tbd_awaits: 'Pendiente',
  oracle_eyebrow: 'El Oráculo',
  autofill_title: 'Auto-rellenar',
  autofill_desc: (n, phase) => `Rellenando ${n} partido${n !== 1 ? 's' : ''} de ${phase}.`,
  btn_fill: n => `Rellenar ${n} partido${n !== 1 ? 's' : ''}`,
  best3rd_tab: 'Mejor 3°',
  best3rd_title: 'Mejores',
  best3rd_title_2: 'Terceros',
  best3rd_groups_done: n => `${n}/12 grupos completos`,
  col_group: 'Gr.',
  help_eyebrow: 'La Guía',
  help_title: 'Cómo usar',
  help_s1_heading: 'Simular el torneo',
  help_s1_body: 'Introduce marcadores local y visitante para cualquier partido — el cuadro se actualiza en tiempo real. Completa los 104 partidos (72 de grupos + 32 eliminatorias) o combina entradas manuales con Auto-rellenar.',
  help_s2_heading: 'Auto-rellenar y Estrategias',
  help_s2_body: 'Auto-rellenar completa todos los partidos pendientes de la fase actual con una de ocho estrategias — desde las cuotas hasta el caos total. Los resultados ya introducidos nunca se modifican.',
  help_s3_heading: 'Experimenta libremente',
  help_s3_body: 'Haz clic en × de cualquier resultado para borrarlo. Si el cambio afecta qué equipos avanzan, todos los resultados eliminatorios posteriores se reinician automáticamente.',
  help_s4_heading: 'Estructura del torneo',
  help_s4_body: 'Los dos primeros de cada uno de los 12 grupos avanzan automáticamente (24 equipos). Los 8 mejores terceros de todos los grupos también se clasifican — por puntos, diferencia de goles, goles anotados y ranking FIFA. Su ubicación en los treintaidosavos de final se determina mediante una tabla de 495 entradas según qué grupos generaron terceros clasificados. A partir de ahí es eliminación directa: Ronda de 32 → Octavos → Cuartos → Semifinales → Tercer lugar y La Final.',
  help_s5_heading: 'Desempate en grupos',
  help_s5_body: 'En igualdad de puntos: resultado directo entre los equipos empatados (pts → DG → GF), luego diferencia de goles global, goles anotados y ranking FIFA.',
  btn_close: 'Cerrar',
  teamName: name => ES_TEAM_NAMES[name] ?? name,
  strategies: {
    follow_odds:     { label: 'Seguir las Cuotas',        short: 'FAVORITO',  description: 'Siempre apostar por el favorito de las apuestas' },
    fifa_ranking:    { label: 'Ranking FIFA',              short: 'FIFA RNK',  description: 'Gana el equipo mejor clasificado; sin empates' },
    weighted_random: { label: 'Aleatorio Ponderado',       short: 'ALEATORIO', description: 'Resultados aleatorios ponderados por cuotas' },
    value_hunter:    { label: 'Cazador de Valor',          short: 'VALOR',     description: 'Apunta al resultado con el mejor valor percibido' },
    upset_machine:   { label: 'Máquina de Sorpresas',      short: 'SORPRESA',  description: 'Siempre elegir al mayor candidato sorpresa' },
    draw_specialist: { label: 'Especialista en Empates',   short: 'EMPATES',   description: 'Fase de grupos: empates. Eliminatorias: favorito' },
    giant_killer:    { label: 'Cazagigantes',               short: 'GIGANTE',   description: 'Grupos: seguir cuotas. KO: siempre el más débil' },
    totally_random:  { label: 'Totalmente Aleatorio',      short: 'CAOS',      description: 'Resultado y marcador elegidos al azar — puro caos' },
  },
}

export const translations: Record<Lang, Translations> = { en, de, es }
