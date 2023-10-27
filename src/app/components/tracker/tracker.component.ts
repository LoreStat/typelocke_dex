import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { PokemonInfo } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';
import { FileService } from 'src/app/services/file.service';
import { EFFECTIVENESSES } from 'src/assets/constants/MovesData';
import { POKEMON_EVOS, TYPES_LIST } from 'src/assets/constants/PokemonData';
import { POKEMON_IMAGES_PATH } from 'src/assets/constants/devConstants';

enum SuggestionResponseType {
  CHECK,
  TRACK
}

interface SuggestionResponse {
  type: SuggestionResponseType,
  result: boolean,
  typesResult?: {
    confirmedTypes: string[],
    dubiousTypes: string[],
    removedTypes: string[]
  }
}

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

  public allTypes = TYPES_LIST;
  public effectivenessesList = ["immune", "notEffective", "effective", "superEffective"]

  public selectedSuggestionType?: string;
  public selectedSuggestionEffectiveness?: string;

  public suggestionResponse?: SuggestionResponse;

  private op?: OverlayPanel;

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
      let availableIndex = this.pokemon.availableTypes.findIndex(e => e === type);
      if (availableIndex !== -1) {
        this.pokemon.availableTypes.splice(availableIndex, 1);
      } else {
        availableIndex = this.pokemon.dubiousTypes.findIndex(e => e === type);
        this.pokemon.dubiousTypes.splice(availableIndex, 1);
      }
      this.fillDataAndSave();
    }
    this.typeSelected = "";
  }

  public moveToRemoved(type: string) {
    let availableIndex = this.pokemon.availableTypes.findIndex(e => e === type);
    if (availableIndex !== -1) {
      this.pokemon.availableTypes.splice(availableIndex, 1);
    } else {
      availableIndex = this.pokemon.dubiousTypes.findIndex(e => e === type);
      this.pokemon.dubiousTypes.splice(availableIndex, 1);
    }
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
    if (list === 'dubious') {
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

  public confirmUsedMove() {
    this.calculateAttackEffectivenesses();

    this.resetSelectedTypeAndEffectiveness();
  }

  public resetSelectedTypeAndEffectiveness() {
    this.selectedSuggestionEffectiveness = undefined;
    this.selectedSuggestionType = undefined;
  }

  private calculateAttackEffectivenesses() {
    this.suggestionResponse = undefined;
    const selectedTypeEffectivenesses = Object.assign({}, EFFECTIVENESSES[this.selectedSuggestionType as string]);

    if (!this.pokemon.confirmedTypes.find(x => x === "?")) {
      this.suggestionResponse = {
        type: SuggestionResponseType.CHECK,
        result: this.checkConfirmedTypesCorrectness(),
        typesResult: undefined
      } // l'efficacia della mossa utilizzata non può essere corretta con la combinazione di tipi selezionata se result è false
    } else {
      this.calculate(selectedTypeEffectivenesses) // move all logic into this function
      // se c'è già un tipo confermato moltiplico tutte le efficace per quella del tipo confermato, e poi confronto i risultati con l'efficacia
      // es. grass - fire , attacco water = 1.0 => avevo già fire confermato quindi moltiplico tutto per 2, grass diventa 1.0, ground 4.0, ghost: 2.0
      // quindi grass andrà tra i dubbi, e se non c'è n'è nessun altro con la stessa efficacia andrà direttamente tra i confermati
      if (this.op) this.op.hide();
      this.fillDataAndSave();
    }
  }

  private checkConfirmedTypesCorrectness() {
    const selectedTypeEffectivenesses = EFFECTIVENESSES[this.selectedSuggestionType as string];

    const totalExpectedDamage = (selectedTypeEffectivenesses[this.pokemon.confirmedTypes[0]] !== undefined ? selectedTypeEffectivenesses[this.pokemon.confirmedTypes[0]] : 1) *
      (selectedTypeEffectivenesses[this.pokemon.confirmedTypes[1]] !== undefined ? selectedTypeEffectivenesses[this.pokemon.confirmedTypes[1]] : 1);

    if (this.checkValueEffectivenessEquality(totalExpectedDamage)) return true;
    else return false;
  }

  private calculate(selectedTypeEffectivenesses: Record<string, number>) {
    const confirmedType = this.pokemon.confirmedTypes.find(x => x !== "?");
    const actualEffectivenessValue = (confirmedType ? (selectedTypeEffectivenesses[confirmedType] || 1) : 1);

    let availableTypesEffectiveness: Record<string, number> = {};
    this.pokemon.availableTypes.forEach(t => availableTypesEffectiveness[t] = (selectedTypeEffectivenesses[t] !== undefined ? selectedTypeEffectivenesses[t] : 1));
    this.pokemon.dubiousTypes.forEach(t => availableTypesEffectiveness[t] = (selectedTypeEffectivenesses[t] !== undefined ? selectedTypeEffectivenesses[t] : 1));

    // a questo punto è da rimuovere quelli che non possono essere, tipo se lancio lotta ed è superefficace non può esserci spettro o volante
    Object.keys(availableTypesEffectiveness).forEach((t) => {
      if (
        (this.selectedSuggestionEffectiveness === "superEffective" && availableTypesEffectiveness[t] < 1) ||
        (this.selectedSuggestionEffectiveness === "notEffective" && availableTypesEffectiveness[t] > 1) ||
        (this.selectedSuggestionEffectiveness !== "immune" && availableTypesEffectiveness[t] === 0) ||
        (this.selectedSuggestionType === "NORMAL" && this.selectedSuggestionEffectiveness === "effective" && availableTypesEffectiveness[t] < 1) ||
        (this.selectedSuggestionEffectiveness !== "immune" && confirmedType && !this.checkValueEffectivenessEquality(actualEffectivenessValue * availableTypesEffectiveness[t]))
      )
        this.moveToRemoved(t);
    });

    availableTypesEffectiveness = {};
    this.pokemon.availableTypes.forEach(t => availableTypesEffectiveness[t] = (selectedTypeEffectivenesses[t] !== undefined ? selectedTypeEffectivenesses[t] : 1) * actualEffectivenessValue);

    if ((confirmedType && !this.checkValueEffectivenessEquality(selectedTypeEffectivenesses[confirmedType] ? selectedTypeEffectivenesses[confirmedType] : 1)) || (!confirmedType && this.selectedSuggestionEffectiveness !== "effective")) {
      Object.keys(availableTypesEffectiveness).forEach(t => {
        // eviterei di spostare su dubbio una mossa normalmente efficace se non ho già informazioni su un secondo tipo
        // potrebbe essere fuorviante..erba fuoco, lancio acqua ed erba fuoco rimangono disponibili, mentre tra i dubbi andrebbero spettro, normale...
        if (this.checkValueEffectivenessEquality(availableTypesEffectiveness[t]))
          this.moveToDubious(t);
      })
    }

    this.dubiousTypesReasoning(selectedTypeEffectivenesses, actualEffectivenessValue, confirmedType);

  }

  private dubiousTypesReasoning(selectedTypeEffectivenesses: Record<string, number>, actualEffectivenessValue: number, confirmedType?: string) {
    //se non ci sono altri tipi disponibili oltre agli unici due in dubbio
    if (this.pokemon.availableTypes.length === 0 && !confirmedType) {
      if (this.pokemon.dubiousTypes.length === 2) {
        this.pokemon.confirmedTypes = this.pokemon.dubiousTypes;
        this.pokemon.dubiousTypes = [];
      } else {
        const combinations: string[][] = this.pokemon.dubiousTypes.flatMap(
          (v, i) => this.pokemon.dubiousTypes.slice(i + 1).map(w => [v, w])
        );

        const possibleConfirmations: string[][] = [];
        combinations.forEach((c: string[]) => {
          if (this.checkValueEffectivenessEquality(selectedTypeEffectivenesses[c[0]] * selectedTypeEffectivenesses[c[1]]))
            possibleConfirmations.push(c)
        })
        if (possibleConfirmations.length === 1) {
          this.moveToConfirmed(possibleConfirmations[0][0]);
          this.moveToConfirmed(possibleConfirmations[0][1]);
        }
        if (possibleConfirmations.length === 0) {
          //se non si trova nessuna combinazione che combacia con l'efficacia bisogna restituire errore
          this.suggestionResponse = {
            type: SuggestionResponseType.TRACK,
            result: this.checkConfirmedTypesCorrectness(),
            typesResult: undefined
          } // impossibile trovare una combinazione corretta corrispondente alle informazioni dichiarate
        }
      }
    }

    const remainingTypesEffectiveness: string[] = [];
    this.pokemon.dubiousTypes.forEach(t => {
      const typesCombinationEffectiveness = actualEffectivenessValue * (selectedTypeEffectivenesses[t] !== undefined ? selectedTypeEffectivenesses[t] : 1);
      if (this.checkValueEffectivenessEquality(typesCombinationEffectiveness)) {
        remainingTypesEffectiveness.push(t);
      }
    });
    this.pokemon.availableTypes.forEach(t => {
      const typesCombinationEffectiveness = actualEffectivenessValue * (selectedTypeEffectivenesses[t] !== undefined ? selectedTypeEffectivenesses[t] : 1);
      if (this.checkValueEffectivenessEquality(typesCombinationEffectiveness)) {
        remainingTypesEffectiveness.push(t);
      }
    });
    // qua si potrebbe implementare un motore che verifica tutte le mosse vecchie oltre all'ultima usata
    // se fra tutte le combinazioni di tipi rimaste ce n'è una che soddisfa tutta la storia delle mosse usate allora aggiungi quei tipi
    if (remainingTypesEffectiveness.length === 1) this.moveToConfirmed(remainingTypesEffectiveness[0]);
  }

  private checkValueEffectivenessEquality(value: number) {
    if (
      (value === 0 && this.selectedSuggestionEffectiveness === "immune") ||
      (value > 0 && value < 1 && this.selectedSuggestionEffectiveness === "notEffective") ||
      (value === 1 && this.selectedSuggestionEffectiveness === "effective") ||
      (value >= 2 && this.selectedSuggestionEffectiveness === "superEffective")
    ) return true;
    else return false;
  }

  public toggleOverlayPanel(op: OverlayPanel, event: any) {
    this.typeSelected = "";
    this.op = op;
    op.toggle(event);
    this.resetSelectedTypeAndEffectiveness();
  }
}
