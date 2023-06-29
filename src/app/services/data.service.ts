import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  private pokemon = new BehaviorSubject<string>("undefined");
  public selectedPokemon = this.pokemon.asObservable();


  public setPokemon(pokemon: string) {
    this.pokemon.next(pokemon);
  }
}
