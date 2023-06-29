import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.scss']
})
export class TrackerComponent {

  public pokemon = "";
  public pokemonImage = "";

  constructor(private dataService: DataService) {
    this.dataService.selectedPokemon.subscribe(pokemon => {
      this.pokemon = pokemon;
      this.pokemonImage = `/assets/pokemon-images/${pokemon}.png`
    });
  }
}
