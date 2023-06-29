import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-recently-watched',
  templateUrl: './recently-watched.component.html',
  styleUrls: ['./recently-watched.component.scss']
})
export class RecentlyWatchedComponent {

  public recentlyWatched: string[] = [];

  constructor(private dataService: DataService) {
    this.dataService.selectedPokemon.subscribe(pokemon => {
      const pokemonIndex = this.recentlyWatched.findIndex(recentlyPoke => recentlyPoke === pokemon);
      if(pokemonIndex !== -1) this.recentlyWatched.splice(pokemonIndex, 1)
      this.recentlyWatched.unshift(pokemon);
    });
  }

  public selectPokemon(pokemon: string) {
    this.dataService.setPokemon(pokemon);
  }
}
