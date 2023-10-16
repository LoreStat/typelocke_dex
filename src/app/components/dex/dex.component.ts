import { KeyValue } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PokemonInfo } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';
import { EVOLUTIONS_GROUPS } from 'src/assets/constants/PokemonData';
import { POKEMON_IMAGES_PATH } from 'src/assets/constants/devConstants';

@Component({
  selector: 'app-dex',
  templateUrl: './dex.component.html',
  styleUrls: ['./dex.component.scss']
})
export class DexComponent {

  public speciesGroups: Record<string, string[]> = EVOLUTIONS_GROUPS;

  public originalOrder = (a: KeyValue<string,string[]>, b: KeyValue<string,string[]>): number => {
    return 0;
  }

  public matchData?: Record<string, PokemonInfo>;

  constructor(private dataService: DataService, private router: Router) {
    this.matchData = this.dataService.getLoadedData();
  }

  public getPokemonImagePath(pokemonName: string) {
    return `${POKEMON_IMAGES_PATH + pokemonName}.png`
  }

  public goToTracker(speciesGroup: string[]) {
    this.dataService.setPokemon(speciesGroup[0]);
    this.router.navigate(["tracker"]);
  }


}
