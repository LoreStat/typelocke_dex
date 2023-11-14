import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DataService } from 'src/app/services/data.service';
import { POKEMON_IMAGES_PATH } from 'src/assets/constants/devConstants';

@Component({
  selector: 'app-recently-watched',
  templateUrl: './recently-watched.component.html',
  styleUrls: ['./recently-watched.component.scss']
})

export class RecentlyWatchedComponent {

  public mostRecentlyWatched: MenuItem[] = [];
  private recentlyWatched: string[] = [];

  constructor(private dataService: DataService) {
    this.dataService.selectedPokemon.subscribe(pokemon => {
      if(pokemon !== "undefined") {
        const pokemonIndex = this.recentlyWatched.findIndex(recentlyPoke => recentlyPoke === pokemon);
        if(pokemonIndex !== -1) this.recentlyWatched.splice(pokemonIndex, 1)
        this.recentlyWatched.unshift(pokemon);

        this.mostRecentlyWatched = this.recentlyWatched.slice(0, 5).map(el => {
          return {
            label: el,
            icon: `${POKEMON_IMAGES_PATH + el}.png`,
            command: () => {
              this.dataService.setPokemon(el);
            }
          }
        })
      }
    });
  }
}
