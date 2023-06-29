import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { TYPE, TYPES_LIST } from 'src/assets/constants/PokemonData';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.scss']
})
export class TrackerComponent {

  public pokemon = "";
  public pokemonImage = "";

  public availableTypes = TYPES_LIST;

  constructor(private dataService: DataService) {
    this.dataService.selectedPokemon.subscribe(pokemon => {
      this.pokemon = pokemon;
      this.pokemonImage = `/assets/pokemon-images/${pokemon}.png`
    });
  }
}
