import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { DataService } from 'src/app/services/data.service';
import { TYPE, TYPES_LIST } from 'src/assets/constants/PokemonData';
import { POKEMON_IMAGES_PATH } from 'src/assets/constants/devConstants';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.scss']
})
export class TrackerComponent {

  public pokemon = "";
  public pokemonImage = "";

  private allTypes = TYPES_LIST;

  public dubiousTypes: string[] = [];
  public removedTypes: string[] = [];
  public availableTypes: string[] = [];
  public confirmedTypes = ["UNDEFINED", "UNDEFINED"];

  public typeSelected = "";

  constructor(private dataService: DataService, private messageService: MessageService) {
    this.dataService.selectedPokemon.subscribe(pokemon => {
      this.pokemon = pokemon;
      this.pokemonImage = `${POKEMON_IMAGES_PATH + pokemon}.png`
    });

    this.availableTypes = this.allTypes;
  }

  public removeType(type: string) {
    if (type !== 'UNDEFINED') {
      this.availableTypes.push(type);
      const typeIndex = this.confirmedTypes.findIndex(e => e === type);
      this.confirmedTypes[typeIndex] = "UNDEFINED";
    }
  }

  public moveToConfirmed(type: string) {
    const undefinedIndex = this.confirmedTypes.findIndex(e => e === "UNDEFINED");
    if (undefinedIndex === -1) this.messageService.add(
      {
        severity: 'error',
        summary: 'Errore',
        detail: 'Hai già aggiunto 2 tipi a questo pokemon'
      }
    );
    else {
      this.confirmedTypes[undefinedIndex] = type;
      const availableIndex = this.availableTypes.findIndex(e => e === type);
      this.availableTypes.splice(availableIndex, 1);
    }
    this.typeSelected = "";
  }

  public moveToRemoved(type: string) {
    const availableIndex = this.availableTypes.findIndex(e => e === type);
    this.availableTypes.splice(availableIndex, 1);
    this.removedTypes.push(type);
    this.typeSelected = "";
  }

  public moveToDubious(type: string) {
    const availableIndex = this.availableTypes.findIndex(e => e === type);
    this.availableTypes.splice(availableIndex, 1);
    this.dubiousTypes.push(type);
    this.typeSelected = "";
  }

  public moveToAvailable(list: string, type: string) {
    const index = (list === 'dubious') ? this.dubiousTypes.findIndex(e => e === type) : this.removedTypes.findIndex(e => e === type);
    if(list === 'dubious') {
      this.dubiousTypes.splice(index, 1);
    } else {
      this.removedTypes.splice(index, 1);
    }
    this.availableTypes.push(type);
  }
}
