import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PokemonInfo, SavedMatch, Settings } from '../models/models';

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
  }

  public getLoadedData() {
    return this.matchData;
  }

  public getSinglePokemonData(name: string) {
    return this.matchData[name];
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
