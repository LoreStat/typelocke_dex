import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { PokemonInfo } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';
import { FileService } from 'src/app/services/file.service';
import { POKEMON_EVOS, TYPES_LIST } from 'src/assets/constants/PokemonData';
import { POKEMON_IMAGES_PATH } from 'src/assets/constants/devConstants';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.scss'],
  providers: [FileService]
})
export class TrackerComponent {

  public pokemon!: PokemonInfo;
  public pokemonImage = "";

  public typeSelected = "";
  public evolutionsGroup: string[] = [];

  constructor(private dataService: DataService, private messageService: MessageService, private fileService: FileService) {
    this.dataService.selectedPokemon.subscribe(pokemonName => {
      this.pokemon = (pokemonName) ? this.dataService.getSinglePokemonData(pokemonName) : this.getDummyPokemonInfo();

      this.evolutionsGroup = POKEMON_EVOS[pokemonName];

      this.pokemonImage = `${POKEMON_IMAGES_PATH + pokemonName}.png`
    });
  }

  public getPokemonImagePath(pokemonName: string) {
    return `${POKEMON_IMAGES_PATH + pokemonName}.png`
  }

  public removeType(type: string) {
    if (type !== '?') {
      this.pokemon.availableTypes.push(type);
      const typeIndex = this.pokemon.confirmedTypes.findIndex(e => e === type);
      this.pokemon.confirmedTypes[typeIndex] = "?";
      this.fillDataAndSave();
    }
  }

  public moveToConfirmed(type: string) {
    const undefinedIndex = this.pokemon.confirmedTypes.findIndex(e => e === "?");
    if (undefinedIndex === -1) this.messageService.add(
      {
        severity: 'error',
        summary: 'Errore',
        detail: "Hai gia' aggiunto 2 tipi a questo pokemon"
      }
    );
    else {
      this.pokemon.confirmedTypes[undefinedIndex] = type;
      const availableIndex = this.pokemon.availableTypes.findIndex(e => e === type);
      this.pokemon.availableTypes.splice(availableIndex, 1);
      this.fillDataAndSave();
    }
    this.typeSelected = "";
  }

  public moveToRemoved(type: string) {
    const availableIndex = this.pokemon.availableTypes.findIndex(e => e === type);
    this.pokemon.availableTypes.splice(availableIndex, 1);
    this.pokemon.removedTypes.push(type);
    this.typeSelected = "";
    this.fillDataAndSave();
  }

  public moveToDubious(type: string) {
    const availableIndex = this.pokemon.availableTypes.findIndex(e => e === type);
    this.pokemon.availableTypes.splice(availableIndex, 1);
    this.pokemon.dubiousTypes.push(type);
    this.typeSelected = "";
    this.fillDataAndSave();
  }

  public moveToAvailable(list: string, type: string) {
    const index = (list === 'dubious') ? this.pokemon.dubiousTypes.findIndex(e => e === type) : this.pokemon.removedTypes.findIndex(e => e === type);
    if(list === 'dubious') {
      this.pokemon.dubiousTypes.splice(index, 1);
    } else {
      this.pokemon.removedTypes.splice(index, 1);
    }
    this.pokemon.availableTypes.push(type);
    this.fillDataAndSave();
  }

  public getDummyPokemonInfo(): PokemonInfo {
    return {
      name: "",
      confirmedTypes: ["?", "?"],
      availableTypes: TYPES_LIST,
      dubiousTypes: [],
      removedTypes: []
    }
  }

  private fillDataAndSave() {
    this.dataService.copySpeciesEvoPokemonData(this.pokemon.name);

    this.fileService.saveChanges();
  }
}
