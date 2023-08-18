export interface SavedMatch {
  matchName: string,
  file: string,
  startDate: string,
  lastModified: string,
  iconName: string
}

export interface Settings {
  suggestions: boolean,
  automatic: boolean,
  language: string
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
  removedTypes: string[]
}
