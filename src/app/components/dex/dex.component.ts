import { KeyValue } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PokemonInfo, SavedMatch, Settings } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';
import { getEvolutionsGroupsByGeneration } from 'src/app/services/utils';

@Component({
  selector: 'app-dex',
  templateUrl: './dex.component.html',
  styleUrls: ['./dex.component.scss']
})
export class DexComponent {

  public speciesGroups: Record<string, string[]>;
  private imagesPath = "";

  public originalOrder = (a: KeyValue<string,string[]>, b: KeyValue<string,string[]>): number => {
    return 0;
  }

  public matchData?: Record<string, PokemonInfo>;

  constructor(private dataService: DataService, private router: Router) {
    this.matchData = this.dataService.getLoadedData();
    this.imagesPath = this.dataService.getIconsPath();
    const generation = +((this.dataService.getSavedMatch() as SavedMatch).generation);
    console.log(generation);
    this.speciesGroups = getEvolutionsGroupsByGeneration(generation);
    console.log(this.speciesGroups);
  }

  public getPokemonImagePath(pokemonName: string) {
    return `${this.imagesPath + pokemonName}.png`
  }

  public goToTracker(speciesGroup: string[]) {
    this.dataService.setPokemon(speciesGroup[0]);
    this.router.navigate(["tracker"]);
  }


}
