import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
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

  private allTypes = TYPES_LIST;

  public availableTypes: string[] = [];
  public confirmedTypes = ["UNDEFINED", "UNDEFINED"];

  public typeSelected = "";

  public items: MenuItem[] = [
    {
      icon: 'pi pi-check',
      command: () => {
        this.moveTyping('confirm');
      }
    },
    {
      icon: 'pi pi-delete',
      command: () => {
        this.moveTyping('delete');
      }
    },
    {
      icon: 'pi pi-question',
      command: () => {
        this.moveTyping('doubt');
      }
    }];

  constructor(private dataService: DataService, private messageService: MessageService) {
    this.dataService.selectedPokemon.subscribe(pokemon => {
      this.pokemon = pokemon;
      this.pokemonImage = `/assets/pokemon-images/${pokemon}.png`
    });

    this.availableTypes = this.allTypes;
  }

  public moveTyping(choice: string) {
    console.log("move");
  }

  public showChoices(type: string) {
    const speeddialButton = document.getElementById(`${type}-sd`);
    if (speeddialButton) {
      const button = speeddialButton.getElementsByTagName('button')[0];
      button.click();
    }
  }

  public removeType(type: string) {
    if (type !== 'UNDEFINED') {
      this.availableTypes.push(type);
      const typeIndex = this.confirmedTypes.findIndex(e => e === type);
      this.confirmedTypes[typeIndex] = "UNDEFINED";
    }
  }

  public confirm(type: string) {
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

  public delete(type: string) {
    const undefinedIndex = this.confirmedTypes.findIndex(e => e === "UNDEFINED");
    if (undefinedIndex === -1) this.messageService.add(
      {
        key: 'bc',
        severity: 'danger',
        summary: 'Errore',
        detail: 'Hai già aggiunto 2 tipi a questo pokemon'
      }
    );
    else this.confirmedTypes[undefinedIndex] = type;
    this.typeSelected = "";
  }

  public doubt(type: string) {
    const undefinedIndex = this.confirmedTypes.findIndex(e => e === "UNDEFINED");
    if (undefinedIndex === -1) this.messageService.add(
      {
        key: 'bc',
        severity: 'danger',
        summary: 'Errore',
        detail: 'Hai già aggiunto 2 tipi a questo pokemon'
      }
    );
    else this.confirmedTypes[undefinedIndex] = type;
    this.typeSelected = "";
  }
}
