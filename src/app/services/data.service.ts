import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PokemonInfo, SavedMatch, Settings } from '../models/models';
import { POKEMON_EVOS } from 'src/assets/constants/PokemonData';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  private savedMatches: SavedMatch[] = [];

  private pokemon = new BehaviorSubject<string>("undefined");
  public selectedPokemon = this.pokemon.asObservable();

  private match = new BehaviorSubject<string>("");
  public selectedMatch = this.match.asObservable();
  public lastSelectedMatch = "";

  private matchData: Record<string, PokemonInfo> = {};

  private settings!: Settings;

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
    if(match) {
      const saveIndex = this.savedMatches.findIndex(x => x.matchName +  '.txt' === match);
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
      if(e !== name) {
        this.matchData[e] = {...this.matchData[name], name: e}
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
}
