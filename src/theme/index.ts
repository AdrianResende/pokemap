export const Colors = {
  yellow: '#FFD93D',
  yellowDark: '#F4C005',
  red: '#FF4757',
  blue: '#3D88F4',
  green: '#2ED573',
  purple: '#A55EEA',
  bg: '#0F0F1A',
  surface: '#1A1A2E',
  surface2: '#252540',
  text: '#F0F0FF',
  textMuted: '#8888AA',
  border: 'rgba(255,255,255,0.06)',
};

export const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  electric: { bg: 'rgba(247,208,44,0.2)', text: '#F7D02C', border: 'rgba(247,208,44,0.3)' },
  fire:     { bg: 'rgba(238,129,48,0.2)',  text: '#EE8130', border: 'rgba(238,129,48,0.3)' },
  water:    { bg: 'rgba(99,144,240,0.2)',  text: '#6390F0', border: 'rgba(99,144,240,0.3)' },
  grass:    { bg: 'rgba(122,199,76,0.2)',  text: '#7AC74C', border: 'rgba(122,199,76,0.3)' },
  poison:   { bg: 'rgba(249,85,135,0.2)', text: '#F95587', border: 'rgba(249,85,135,0.3)' },
  ghost:    { bg: 'rgba(165,94,234,0.2)', text: '#A55EEA', border: 'rgba(165,94,234,0.3)' },
  normal:   { bg: 'rgba(168,167,122,0.2)',text: '#A8A77A', border: 'rgba(168,167,122,0.3)' },
  psychic:  { bg: 'rgba(249,85,135,0.2)', text: '#F95587', border: 'rgba(249,85,135,0.3)' },
};

export const TYPE_EMOJIS: Record<string, string> = {
  electric: '⚡', fire: '🔥', water: '💧', grass: '🌿',
  poison: '☠️', ghost: '👻', normal: '⭕', psychic: '🔮',
};

export const POKEMON_LIST = [
  { id: 25,  name: 'Pikachu',    types: ['electric'], dist: '320m',  weight: '6,2 kg', height: '0,4 m', hp: 45, atk: 55, def: 40, spa: 50, spd: 50, spe: 90 },
  { id: 4,   name: 'Charmander', types: ['fire'],     dist: '510m',  weight: '8,5 kg', height: '0,6 m', hp: 39, atk: 52, def: 43, spa: 60, spd: 50, spe: 65 },
  { id: 7,   name: 'Squirtle',   types: ['water'],    dist: '780m',  weight: '9,0 kg', height: '0,5 m', hp: 44, atk: 48, def: 65, spa: 50, spd: 64, spe: 43 },
  { id: 1,   name: 'Bulbasaur',  types: ['grass','poison'], dist: '1,2km', weight: '6,9 kg', height: '0,7 m', hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 },
  { id: 94,  name: 'Gengar',     types: ['ghost','poison'], dist: '1,8km', weight: '40,5 kg',height: '1,5 m', hp: 60, atk: 65, def: 60, spa: 130,spd: 75, spe: 110 },
  { id: 133, name: 'Eevee',      types: ['normal'],   dist: '2,4km', weight: '6,5 kg', height: '0,3 m', hp: 55, atk: 55, def: 50, spa: 45, spd: 65, spe: 55 },
];

export const SPRITE_URL = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

export const ARTWORK_URL = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
