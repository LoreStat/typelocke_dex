export enum EffectivenessesCodes {
  SUPEREFFECTIVE = 'superEffective',
  EFFECTIVE = 'effective',
  NOT_EFFECTIVE = 'notEffective',
  IMMUNE = 'immune'
}

export interface SavedMatch {
  matchName: string,
  file: string,
  startDate: string,
  lastLogin: string,
  iconName: string,
  generation: string
}

export interface Settings {
  automaticSummary: boolean,
  automatic: boolean,
  language: string,
  hideRecentPokemon: boolean,
  hdImages: boolean
}

export interface DropdownItem {
  label: string,
  value: string
}

export interface PokemonInfo {
  name: string,
  confirmedTypes: string[],
  availableTypes: string [],
  dubiousTypes: string[],
  removedTypes: string[],
  registeredMoves: string[],
  notes: string
}

export interface DoubleType {
  type1: string,
  type2: string,
  vulnerabilities: Record<string, EffectivenessesCodes>
}

export interface UsedMoveFilter {
  type: string,
  effectiveness: string
}
