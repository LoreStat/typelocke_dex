import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DoubleType, EffectivenessesCodes, PokemonInfo, SavedMatch, Settings, UsedMoveFilter } from '../models/models';
import { POKEMON_EVOS, TYPES_LIST } from 'src/assets/constants/PokemonData';
import { EFFECTIVENESSES } from 'src/assets/constants/MovesData';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() {
    this.resetTypesCombinations();
  }

  private savedMatches: SavedMatch[] = [];

  private pokemon = new BehaviorSubject<string>("undefined");
  public selectedPokemon = this.pokemon.asObservable();

  private match = new BehaviorSubject<string>("");
  public selectedMatch = this.match.asObservable();
  public lastSelectedMatch = "";

  private matchData: Record<string, PokemonInfo> = {};

  private settings!: Settings;

  private typesCombinations!: DoubleType[];
  private typesCombinationsFilters: UsedMoveFilter[] = [];

  public getSavedMatches() {
    return this.savedMatches;
  }

  public setSavedMatches(savedMatches: SavedMatch[]) {
    this.savedMatches = savedMatches;
  }

  public setPokemon(pokemon: string) {
    this.pokemon.next(pokemon);
  }

  public setLoadedMatch(match: string) {
    this.match.next(match);
    this.lastSelectedMatch = match;
    if (match) {
      const saveIndex = this.savedMatches.findIndex(x => x.matchName + '.txt' === match);
      this.savedMatches[saveIndex].lastLogin = new Date().toISOString();
    }
  }

  public getLoadedData() {
    return this.matchData;
  }

  public getSinglePokemonData(name: string) {
    return this.matchData[name];
  }

  public copySpeciesEvoPokemonData(name: string) {
    const evolutionsGroup = POKEMON_EVOS[name];
    evolutionsGroup.forEach(e => {
      if (e !== name) {
        this.matchData[e] = { ...this.matchData[name], name: e }
      }
    })
  }

  public setLoadedData(data: Record<string, PokemonInfo>) {
    this.matchData = data;
  }

  public getSettings() {
    return this.settings;
  }

  public setSettings(value: Settings) {
    this.settings = value;
  }

  public getIconsPath() {
    if (this.settings.hdImages)
      return 'assets/images/hd-pokemon/';
    else
      return 'assets/images/pokemon-images/';
  }

  public getTypesCombinations() {
    return this.typesCombinations;
  }

  public setTypesCombinations(value: DoubleType[]) {
    this.typesCombinations = value;
  }

  public resetTypesCombinations() {
    this.typesCombinations = this.getAllTypesCombinations();
  }

  public getAllTypesCombinations() {
    return TYPES_LIST.flatMap(
      (t1, i) => TYPES_LIST.slice(i + 1).map(t2 =>{
        const combinationsVulnerabilities: Record<string, EffectivenessesCodes> = {};
        TYPES_LIST.forEach((type) => {
          const eff1 = EFFECTIVENESSES[type][t1] !== undefined ? EFFECTIVENESSES[type][t1] : 1;
          const eff2 = EFFECTIVENESSES[type][t2] !== undefined ? EFFECTIVENESSES[type][t2] : 1;
          const eff = eff1 * eff2;
          if(eff > 1) combinationsVulnerabilities[type] = EffectivenessesCodes.SUPEREFFECTIVE;
          else if(eff === 1) combinationsVulnerabilities[type] = EffectivenessesCodes.EFFECTIVE;
          else if(eff === 0) combinationsVulnerabilities[type] = EffectivenessesCodes.IMMUNE;
          else combinationsVulnerabilities[type] = EffectivenessesCodes.NOT_EFFECTIVE;
        })
        return {
          type1: t1,
          type2: t2,
          vulnerabilities: combinationsVulnerabilities
        }
      })
    );
  }

  public getTypesCombinationsFilters() {
    return this.typesCombinationsFilters;
  }

  public setTypesCombinationsFilters(val: UsedMoveFilter[]) {
    this.typesCombinationsFilters = val;
  }

  public getSavedMatch() {
    return this.savedMatches.find(x => (x.matchName + ".txt") === this.lastSelectedMatch)
  }
}
