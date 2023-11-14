export interface SavedMatch {
  matchName: string,
  file: string,
  startDate: string,
  lastLogin: string,
  iconName: string
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
