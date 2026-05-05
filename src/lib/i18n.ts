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
  // Strategies
  strategies: Record<string, StrategyLabel>
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
  col_club: 'Club',
  col_pld: 'Pld',
  col_w: 'W',
  col_d: 'D',
  col_l: 'L',
  col_gf: 'GF',
  col_ga: 'GA',
  col_gd: 'GD',
  col_pts: 'Pts',
  col_status: 'Status',
  tiebreakers: 'Tiebreakers · Pts → GD → GF → FIFA rank',
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
  six_matches_tagline: 'Sechs Spiele · die Top Zwei steigen auf',
  the_table: 'Die Tabelle',
  group_label: (g, p) => p > 0 ? `Gruppe ${g} (${p}/6)` : `Gruppe ${g}`,
  top_two_advance: '↑ Zwei Ersten steigen auf',
  best_eight_third: '↗ Acht beste Dritte qualifizieren sich',
  col_club: 'Verein',
  col_pld: 'Sp',
  col_w: 'S',
  col_d: 'U',
  col_l: 'N',
  col_gf: 'T+',
  col_ga: 'T-',
  col_gd: 'TD',
  col_pts: 'Pkt',
  col_status: 'Status',
  tiebreakers: 'Tiebreaker · Pkt → TD → T+ → FIFA-Rang',
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
  the_fixtures: 'Los Partidos',
  six_matches_tagline: 'Seis partidos · los dos primeros avanzan',
  the_table: 'La Tabla',
  group_label: (g, p) => p > 0 ? `Grupo ${g} (${p}/6)` : `Grupo ${g}`,
  top_two_advance: '↑ Los dos primeros avanzan',
  best_eight_third: '↗ Los mejores ocho terceros califican',
  col_club: 'Club',
  col_pld: 'PJ',
  col_w: 'G',
  col_d: 'E',
  col_l: 'P',
  col_gf: 'GF',
  col_ga: 'GC',
  col_gd: 'DG',
  col_pts: 'Pts',
  col_status: 'Estado',
  tiebreakers: 'Desempate · Pts → DG → GF → Ranking FIFA',
  updated_continuously: 'Actualizado continuamente',
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
