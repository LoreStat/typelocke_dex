import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SavedMatch } from '../models/models';

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

  private matchData: string = "";

  private loadedData = {};

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

  public getLoadedMatch() {
    return this.matchData;
  }

  public setLoadedData(data: string) {
    this.matchData = data;
  }

}
