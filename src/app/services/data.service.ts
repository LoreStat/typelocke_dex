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
}
