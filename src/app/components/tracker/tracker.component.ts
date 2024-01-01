import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { DoubleType, PokemonInfo, Settings, UsedMoveFilter } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';
import { FileService } from 'src/app/services/file.service';
import { EFFECTIVENESSES } from 'src/assets/constants/MovesData';
import { EVOLUTIONS_GROUPS, POKEMON_EVOS, TYPE, TYPES_LIST } from 'src/assets/constants/PokemonData';
import { composeRecentMoveFromEffectiveness, composeRecentMoveFromType, getBackgroundClassFromRecentMove, getEffectivenessFromRecentMove } from 'src/app/services/utils'
enum SuggestionResponseType {
  CHECK = "CHECK",
  TRACK = "TRACK",
  NULL = "NULL",
  IMPOSSIBLE = "IMPOSSIBLE"
}

interface SuggestionResponse {
  type: SuggestionResponseType,
  result: boolean,
  typesResult: {
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
  public settings?: Settings;
  public iconPath: string = "";

  public typeSelected = "";
  public evolutionsGroup: string[] = [];

  public allTypes = TYPES_LIST;
  public effectivenessesList = ["immune", "notEffective", "effective", "superEffective"]

  public selectedSuggestionType?: string;
  public selectedSuggestionEffectiveness?: string;

  public suggestionResponse: SuggestionResponse = {
    type: SuggestionResponseType.NULL,
    result: true,
    typesResult: {
      confirmedTypes: [],
      dubiousTypes: [],
      removedTypes: []
    }
  };

  public blockEnabled: boolean = false;
  public sidebarVisible: boolean = false;
  private op?: OverlayPanel;

  constructor(private dataService: DataService, private messageService: MessageService, private fileService: FileService, private translate: TranslateService) {
    this.iconPath = this.dataService.getIconsPath();
    this.dataService.selectedPokemon.subscribe(pokemonName => {
      this.pokemon = (pokemonName) ? this.dataService.getSinglePokemonData(pokemonName) : this.getDummyPokemonInfo();
      this.settings = dataService.getSettings();
      this.evolutionsGroup = POKEMON_EVOS[pokemonName];

      this.pokemonImage = `${this.iconPath + pokemonName}.png`
    });
  }

  public getPokemonImagePath(pokemonName: string) {
    return `${this.iconPath + pokemonName}.png`
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
        summary: this.translate.instant("general.error"),
        detail: this.translate.instant("errors.alreadyConfirmedTypes")
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
      if(availableIndex !== -1) {
        this.pokemon.dubiousTypes.splice(availableIndex, 1);
      } else {
        availableIndex = this.pokemon.confirmedTypes.findIndex(e => e === type);
        this.pokemon.confirmedTypes[availableIndex] = "?";
      }
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
      removedTypes: [],
      registeredMoves: [],
      notes: ""
    }
  }

  public fillDataAndSave() {
    this.dataService.copySpeciesEvoPokemonData(this.pokemon.name);

    this.fileService.saveChanges();
  }

  private addToRegisteredIfDontExist(selectedSuggestionType: string, selectedSuggestionEffectiveness: string) {
    const composedRecentMove = (composeRecentMoveFromType(selectedSuggestionType) + composeRecentMoveFromEffectiveness(selectedSuggestionEffectiveness));
    if (!this.pokemon.registeredMoves.find(x => x === composedRecentMove))
      this.pokemon.registeredMoves.unshift(composedRecentMove);
  }

  public addMoveToRegistered(selectedSuggestionType: string, selectedSuggestionEffectiveness: string) {
    if (this.selectedSuggestionEffectiveness && this.selectedSuggestionType) {
      this.addToRegisteredIfDontExist(selectedSuggestionType, selectedSuggestionEffectiveness);
      this.resetSelectedTypeAndEffectiveness();
      if (this.op) this.op.hide();

      this.fillDataAndSave();
    }
  }

  public confirmUsedMove(selectedSuggestionType: string, selectedSuggestionEffectiveness: string, actualMove: number) {
    this.resetSuggestionResponse();
    this.blockEnabled = true;

    this.calculateUsedMove(selectedSuggestionType, selectedSuggestionEffectiveness, actualMove);

    this.blockEnabled = false;
    if (this.suggestionResponse.type !== SuggestionResponseType.TRACK ||
      this.suggestionResponse.type === SuggestionResponseType.TRACK && !this.suggestionResponse.result ||
      (this.settings?.automaticSummary && this.suggestionResponse.type === SuggestionResponseType.TRACK && (
        this.suggestionResponse.typesResult.confirmedTypes.length > 0 ||
        this.suggestionResponse.typesResult.dubiousTypes.length > 0 ||
        this.suggestionResponse.typesResult.removedTypes.length > 0
      ))) {
      this.sidebarVisible = true;
      if (this.suggestionResponse.result === false) {
        this.pokemon.registeredMoves.shift();
        this.fillDataAndSave();
      }
    }
  }

  public calculateUsedMove(selectedSuggestionType: string, selectedSuggestionEffectiveness: string, actualMove: number) {
    if (POKEMON_EVOS[this.pokemon.name] === EVOLUTIONS_GROUPS.SHEDINJA) this.calculateShedinja(selectedSuggestionType, selectedSuggestionEffectiveness, actualMove);
    else this.calculateAttackEffectivenesses(selectedSuggestionType, selectedSuggestionEffectiveness, actualMove);

    if (this.selectedSuggestionType === selectedSuggestionType) {
      this.addToRegisteredIfDontExist(selectedSuggestionType, selectedSuggestionEffectiveness);
      this.fillDataAndSave();
      this.resetSelectedTypeAndEffectiveness();
    }
    if (this.op) this.op.hide();
  }

  public resetSelectedTypeAndEffectiveness() {
    this.selectedSuggestionEffectiveness = undefined;
    this.selectedSuggestionType = undefined;
  }

  private calculateAttackEffectivenesses(selectedSuggestionType: string, selectedSuggestionEffectiveness: string, actualMove: number) {
    const selectedTypeEffectivenesses = Object.assign({}, EFFECTIVENESSES[selectedSuggestionType as string]);

    if (!this.pokemon.confirmedTypes.find(x => x === "?")) {

      const selectedTypeEffectiveness1 = selectedTypeEffectivenesses[this.pokemon.confirmedTypes[0]] !== undefined
        ? selectedTypeEffectivenesses[this.pokemon.confirmedTypes[0]] : 1;
      const selectedTypeEffectiveness2 = selectedTypeEffectivenesses[this.pokemon.confirmedTypes[1]] !== undefined
        ? selectedTypeEffectivenesses[this.pokemon.confirmedTypes[1]] : 1;

      const effectivenessValue = selectedTypeEffectiveness1 * selectedTypeEffectiveness2;
      const effectivenessLabel = (effectivenessValue === 0) ? 'immune' :
        (effectivenessValue < 1) ? 'notEffective' :
          (effectivenessValue === 1) ? 'effective' :
            'superEffective';

      this.suggestionResponse = {
        type: SuggestionResponseType.CHECK,
        result: this.checkConfirmedTypesCorrectness(selectedSuggestionType, selectedSuggestionEffectiveness),
        typesResult: { dubiousTypes: [effectivenessLabel], confirmedTypes: [], removedTypes: [] }
      } // l'efficacia della mossa utilizzata non può essere corretta con la combinazione di tipi selezionata se result è false
    } else {
      this.suggestionResponse.type = SuggestionResponseType.TRACK;
      this.calculate(selectedTypeEffectivenesses, selectedSuggestionType, selectedSuggestionEffectiveness, actualMove) // move all logic into this function
      // se c'è già un tipo confermato moltiplico tutte le efficace per quella del tipo confermato, e poi confronto i risultati con l'efficacia
      // es. grass - fire , attacco water = 1.0 => avevo già fire confermato quindi moltiplico tutto per 2, grass diventa 1.0, ground 4.0, ghost: 2.0
      // quindi grass andrà tra i dubbi, e se non c'è n'è nessun altro con la stessa efficacia andrà direttamente tra i confermati
      this.fillDataAndSave();
    }
  }

  private checkConfirmedTypesCorrectness(selectedSuggestionType: string, selectedSuggestionEffectiveness: string) {
    const selectedTypeEffectivenesses = EFFECTIVENESSES[selectedSuggestionType as string];

    const totalExpectedDamage = (selectedTypeEffectivenesses[this.pokemon.confirmedTypes[0]] !== undefined ? selectedTypeEffectivenesses[this.pokemon.confirmedTypes[0]] : 1) *
      (selectedTypeEffectivenesses[this.pokemon.confirmedTypes[1]] !== undefined ? selectedTypeEffectivenesses[this.pokemon.confirmedTypes[1]] : 1);

    if (this.checkValueEffectivenessEquality(selectedSuggestionEffectiveness, totalExpectedDamage)) return true;
    else return false;
  }

  private calculate(selectedTypeEffectivenesses: Record<string, number>, selectedSuggestionType: string, selectedSuggestionEffectiveness: string, actualMove: number) {
    if(actualMove === 0) this.calculateCombinationsAndRemoveTypes(selectedSuggestionType, selectedSuggestionEffectiveness);
    const confirmedType = this.pokemon.confirmedTypes.find(x => x !== "?");
    const actualEffectivenessValue = (confirmedType ? (selectedTypeEffectivenesses[confirmedType] || 1) : 1);

    let availableTypesEffectiveness: Record<string, number> = {};
    this.pokemon.availableTypes.forEach(t => availableTypesEffectiveness[t] = (selectedTypeEffectivenesses[t] !== undefined ? selectedTypeEffectivenesses[t] : 1));
    this.pokemon.dubiousTypes.forEach(t => availableTypesEffectiveness[t] = (selectedTypeEffectivenesses[t] !== undefined ? selectedTypeEffectivenesses[t] : 1));

    // a questo punto è da rimuovere quelli che non possono essere, tipo se lancio lotta ed è superefficace non può esserci spettro o volante
    Object.keys(availableTypesEffectiveness).forEach((t) => {
      if (
        (selectedSuggestionEffectiveness === "superEffective" && availableTypesEffectiveness[t] < 1) ||
        (selectedSuggestionEffectiveness === "notEffective" && availableTypesEffectiveness[t] > 1) ||
        (selectedSuggestionEffectiveness !== "immune" && availableTypesEffectiveness[t] === 0) ||
        (selectedSuggestionType === TYPE.NORMAL && selectedSuggestionEffectiveness === "effective" && availableTypesEffectiveness[t] < 1) ||
        (selectedSuggestionEffectiveness !== "immune" && confirmedType && !this.checkValueEffectivenessEquality(selectedSuggestionEffectiveness, actualEffectivenessValue * availableTypesEffectiveness[t]))
      ) {
        this.moveToRemoved(t);
        this.deleteFromSuggestionResponseIfPresent(t)
        this.suggestionResponse.typesResult.removedTypes.push(t);
      }
    });

    availableTypesEffectiveness = {};
    this.pokemon.availableTypes.forEach(t => availableTypesEffectiveness[t] = (selectedTypeEffectivenesses[t] !== undefined ? selectedTypeEffectivenesses[t] : 1) * actualEffectivenessValue);

    if ((confirmedType && !this.checkValueEffectivenessEquality(selectedSuggestionEffectiveness, selectedTypeEffectivenesses[confirmedType] ? selectedTypeEffectivenesses[confirmedType] : 1)) || (!confirmedType && selectedSuggestionEffectiveness !== "effective")) {
      Object.keys(availableTypesEffectiveness).forEach(t => {
        // eviterei di spostare su dubbio una mossa normalmente efficace se non ho già informazioni su un secondo tipo
        // potrebbe essere fuorviante..erba fuoco, lancio acqua ed erba fuoco rimangono disponibili, mentre tra i dubbi andrebbero spettro, normale...
        if (this.checkValueEffectivenessEquality(selectedSuggestionEffectiveness, availableTypesEffectiveness[t])) {
          this.moveToDubious(t);
          this.deleteFromSuggestionResponseIfPresent(t);
          this.suggestionResponse.typesResult.dubiousTypes.push(t);
        }
      })
    }
    this.dubiousTypesReasoning(selectedSuggestionType, selectedSuggestionEffectiveness, selectedTypeEffectivenesses, actualEffectivenessValue, actualMove, confirmedType);

  }

  private dubiousTypesReasoning(selectedSuggestionType: string, selectedSuggestionEffectiveness: string, selectedTypeEffectivenesses: Record<string, number>, actualEffectivenessValue: number, actualMove: number, confirmedType?: string) {
    //se non ci sono altri tipi disponibili oltre agli unici due in dubbio
    if (this.pokemon.availableTypes.length === 0 && !confirmedType) {
      if (this.pokemon.dubiousTypes.length === 2) {
        this.pokemon.confirmedTypes = this.pokemon.dubiousTypes;
        this.pokemon.dubiousTypes = [];
        this.deleteFromSuggestionResponseIfPresent(this.pokemon.dubiousTypes[0]);
        this.deleteFromSuggestionResponseIfPresent(this.pokemon.dubiousTypes[1]);
        this.suggestionResponse.typesResult.confirmedTypes.push(...this.pokemon.confirmedTypes)
      } else {
        const combinations: string[][] = this.pokemon.dubiousTypes.flatMap(
          (v, i) => this.pokemon.dubiousTypes.slice(i + 1).map(w => [v, w])
        );

        const possibleConfirmations: string[][] = [];
        combinations.forEach((c: string[]) => {
          if (this.checkValueEffectivenessEquality(selectedSuggestionEffectiveness, selectedTypeEffectivenesses[c[0]] * selectedTypeEffectivenesses[c[1]]))
            possibleConfirmations.push(c)
        })
        if (possibleConfirmations.length === 1) {
          this.moveToConfirmed(possibleConfirmations[0][0]);
          this.deleteFromSuggestionResponseIfPresent(possibleConfirmations[0][0])
          this.suggestionResponse.typesResult.confirmedTypes.push(possibleConfirmations[0][0]);
          this.deleteFromSuggestionResponseIfPresent(possibleConfirmations[0][1])
          this.moveToConfirmed(possibleConfirmations[0][1]);
          this.suggestionResponse.typesResult.confirmedTypes.push(possibleConfirmations[0][1]);
        }
        if (possibleConfirmations.length === 0) {
          //se non si trova nessuna combinazione che combacia con l'efficacia bisogna restituire errore
          this.suggestionResponse = {
            type: SuggestionResponseType.TRACK,
            result: false,
            typesResult: { confirmedTypes: [], dubiousTypes: [], removedTypes: [] }
          } // impossibile trovare una combinazione corretta corrispondente alle informazioni dichiarate
        }
      }
    }

    const remainingTypesEffectiveness: string[] = [];
    this.pokemon.dubiousTypes.forEach(t => {
      const typesCombinationEffectiveness = actualEffectivenessValue * (selectedTypeEffectivenesses[t] !== undefined ? selectedTypeEffectivenesses[t] : 1);
      if (this.checkValueEffectivenessEquality(selectedSuggestionEffectiveness, typesCombinationEffectiveness)) {
        remainingTypesEffectiveness.push(t);
      }
    });
    this.pokemon.availableTypes.forEach(t => {
      const typesCombinationEffectiveness = actualEffectivenessValue * (selectedTypeEffectivenesses[t] !== undefined ? selectedTypeEffectivenesses[t] : 1);
      if (this.checkValueEffectivenessEquality(selectedSuggestionEffectiveness, typesCombinationEffectiveness)) {
        remainingTypesEffectiveness.push(t);
      }
    });
    if (remainingTypesEffectiveness.length === 1) {
      this.moveToConfirmed(remainingTypesEffectiveness[0]);
      this.deleteFromSuggestionResponseIfPresent(remainingTypesEffectiveness[0]);
      this.suggestionResponse.typesResult.confirmedTypes.push(remainingTypesEffectiveness[0]);
    }

    this.suggestionResponse.result = true;
    const missingType = this.pokemon.confirmedTypes.find(x => x === "?");
    if (missingType && this.pokemon.registeredMoves.length > actualMove) {
      const nextRecentMove = this.pokemon.registeredMoves[actualMove];
      this.calculateUsedMove(
        getBackgroundClassFromRecentMove(nextRecentMove.substring(0, 2)),
        getEffectivenessFromRecentMove(nextRecentMove.substring(2, 3)).split(".")[1],
        actualMove + 1);
    }
  }

  private checkValueEffectivenessEquality(selectedSuggestionEffectiveness: string, value: number) {
    if (
      (value === 0 && selectedSuggestionEffectiveness === "immune") ||
      (value > 0 && value < 1 && selectedSuggestionEffectiveness === "notEffective") ||
      (value === 1 && selectedSuggestionEffectiveness === "effective") ||
      (value >= 2 && selectedSuggestionEffectiveness === "superEffective")
    ) return true;
    else return false;
  }

  public toggleOverlayPanel(op: OverlayPanel, event: any) {
    this.typeSelected = "";
    this.op = op;
    op.toggle(event);
    this.resetSelectedTypeAndEffectiveness();
  }

  public resetSuggestionResponse() {
    this.suggestionResponse = { type: SuggestionResponseType.NULL, result: true, typesResult: { confirmedTypes: [], dubiousTypes: [], removedTypes: [] } };
  }

  public getTranslatedTypesArray(value: string[]) {
    return value.map(x => this.translate.instant("types." + x.toLowerCase())).join(", ");
  }

  private calculateShedinja(selectedSuggestionType: string, selectedSuggestionEffectiveness: string, actualMove: number) {
    if(selectedSuggestionEffectiveness === "notEffective" || selectedSuggestionEffectiveness === "effective") {
      this.suggestionResponse = {
        type: SuggestionResponseType.IMPOSSIBLE,
        result: false,
        typesResult: { confirmedTypes: [], dubiousTypes: [], removedTypes: [] }
      }
      return;
    }

    const selectedTypeEffectivenesses = EFFECTIVENESSES[selectedSuggestionType as string];
    const firstUndefined = this.pokemon.confirmedTypes.find(x => x === "?");
    if(!firstUndefined) {
      const typesCombinationEffectiveness =  (selectedTypeEffectivenesses[this.pokemon.confirmedTypes[0]] !== undefined ? selectedTypeEffectivenesses[this.pokemon.confirmedTypes[0]] : 1)
                    * (selectedTypeEffectivenesses[this.pokemon.confirmedTypes[1]] !== undefined ? selectedTypeEffectivenesses[this.pokemon.confirmedTypes[1]] : 1);
      if((typesCombinationEffectiveness >= 2 && selectedSuggestionEffectiveness === "superEffective")
          || (typesCombinationEffectiveness >= 2 && selectedSuggestionEffectiveness === "immune")) {
        this.suggestionResponse = {
          type: SuggestionResponseType.CHECK,
          result: true,
          typesResult: { dubiousTypes: [typesCombinationEffectiveness >= 2 ? "superEffective" : "immune"], confirmedTypes: [], removedTypes: [] }
        }
      } else {
        this.suggestionResponse = {
          type: SuggestionResponseType.CHECK,
          result: true,
          typesResult: { dubiousTypes: [typesCombinationEffectiveness >= 2 ? "superEffective" : "immune"], confirmedTypes: [], removedTypes: [] }
        }
      }
      return;
    }

    this.suggestionResponse = {
      type: SuggestionResponseType.TRACK,
      result: true,
      typesResult: { dubiousTypes: [], confirmedTypes: [], removedTypes: [] }
    }
    const trackedType = this.pokemon.confirmedTypes.find(x => x !== "?");
    let availableTypesEffectiveness: Record<string, number> = {};
    this.pokemon.availableTypes.forEach(t => availableTypesEffectiveness[t] = (selectedTypeEffectivenesses[t] !== undefined ? selectedTypeEffectivenesses[t] : 1));
    this.pokemon.dubiousTypes.forEach(t => availableTypesEffectiveness[t] = (selectedTypeEffectivenesses[t] !== undefined ? selectedTypeEffectivenesses[t] : 1));
    if(trackedType) {
      const actualEffectiveness = EFFECTIVENESSES[selectedSuggestionType][trackedType] !== undefined ? EFFECTIVENESSES[selectedSuggestionType][trackedType] : 1;
      if(actualEffectiveness !== 0) {
        if(actualEffectiveness === 2 && selectedSuggestionEffectiveness === "superEffective") {
          Object.keys(availableTypesEffectiveness).forEach(t => {
            if(availableTypesEffectiveness[t] < 1) {
              this.moveToRemoved(t);
              this.deleteFromSuggestionResponseIfPresent(t)
              this.suggestionResponse.typesResult.removedTypes.push(t);
            }
          })
        } else if(actualEffectiveness === 2 && selectedSuggestionEffectiveness === "immune") {
          // se il tipo della mossa è superefficace sul tipo già confermato ma la mossa usata non fa danni = devo togliere tutte le superefficaci e normali e tenere le non efficaci e immuni della mossa usata
          Object.keys(availableTypesEffectiveness).forEach(t => {
            if(availableTypesEffectiveness[t] < 1) {
              this.moveToRemoved(t);
              this.deleteFromSuggestionResponseIfPresent(t)
              this.suggestionResponse.typesResult.removedTypes.push(t);
            }
          })
        } else if(actualEffectiveness === 1 && selectedSuggestionEffectiveness === "superEffective") {
          // se il tipo della mossa è immune sul tipo già confermato ma la mossa usata è superefficace = devo tenere solo i tipi su cui è superefficace il tipo della mossa usata
          Object.keys(availableTypesEffectiveness).forEach(t => {
            if(availableTypesEffectiveness[t] !== 2) {
              this.moveToRemoved(t);
              this.deleteFromSuggestionResponseIfPresent(t)
              this.suggestionResponse.typesResult.removedTypes.push(t);
            }
          })
        } else if(actualEffectiveness < 2 && selectedSuggestionEffectiveness === "immune") {
          // se il tipo della mossa è immune sul tipo già confermato e anche la mossa usata risulta immune = posso solo togliere tutti i tipi su cui quella mossa è superefficace
          Object.keys(availableTypesEffectiveness).forEach(t => {
            if(availableTypesEffectiveness[t] === 2) {
              this.moveToRemoved(t);
              this.deleteFromSuggestionResponseIfPresent(t)
              this.suggestionResponse.typesResult.removedTypes.push(t);
            }
          })
        }
      }
    } else {
      if(selectedSuggestionEffectiveness === "superEffective") {
        const superEffectivesCount: string[] = [];
        Object.keys(availableTypesEffectiveness).forEach(t => {
          if(availableTypesEffectiveness[t] === 2) {
            superEffectivesCount.push(t);
            if(this.pokemon.dubiousTypes.findIndex(dubTyp => dubTyp === t) === -1) {
              this.moveToDubious(t);
              this.deleteFromSuggestionResponseIfPresent(t)
              this.suggestionResponse.typesResult.dubiousTypes.push(t);
            }
          } else if(availableTypesEffectiveness[t] < 1) {
            this.moveToRemoved(t);
            this.deleteFromSuggestionResponseIfPresent(t)
            this.suggestionResponse.typesResult.removedTypes.push(t);
          };
        });
        if(superEffectivesCount.length === 1) {
          this.moveToConfirmed(superEffectivesCount[0]);
          this.deleteFromSuggestionResponseIfPresent(superEffectivesCount[0])
          this.suggestionResponse.typesResult.confirmedTypes.push(superEffectivesCount[0]);
        }
      }
    }
    if (this.pokemon.availableTypes.length + this.pokemon.dubiousTypes.length === 0) this.suggestionResponse.result = false;
    else if(this.pokemon.availableTypes.length + this.pokemon.dubiousTypes.length === 1) {
      if(this.pokemon.availableTypes.length === 1) {
        this.deleteFromSuggestionResponseIfPresent(this.pokemon.availableTypes[0])
        this.suggestionResponse.typesResult.confirmedTypes.push(this.pokemon.availableTypes[0]);
        this.moveToConfirmed(this.pokemon.availableTypes[0]);
      } else {
        this.deleteFromSuggestionResponseIfPresent(this.pokemon.dubiousTypes[0])
        this.suggestionResponse.typesResult.confirmedTypes.push(this.pokemon.dubiousTypes[0]);
        this.moveToConfirmed(this.pokemon.dubiousTypes[0]);
      }
    } else {
      const missingType = this.pokemon.confirmedTypes.find(x => x === "?");
      if (missingType && this.pokemon.registeredMoves.length > actualMove) {
        const nextRecentMove = this.pokemon.registeredMoves[actualMove];
        this.calculateUsedMove(
          getBackgroundClassFromRecentMove(nextRecentMove.substring(0, 2)),
          getEffectivenessFromRecentMove(nextRecentMove.substring(2, 3)).split(".")[1],
          actualMove + 1);
      }
    }
  }

  public getBackgroundClassFromRecentMoveCaller(value: string) {
    return getBackgroundClassFromRecentMove(value);
  }

  public getEffectivenessFromRecentMoveCaller(value: string) {
    return getEffectivenessFromRecentMove(value)
  }

  public removeUsedMove(value: string) {
    const indexToDelete = this.pokemon.registeredMoves.findIndex(x => x === value);
    this.pokemon.registeredMoves.splice(indexToDelete, 1);
    this.fillDataAndSave();
  }

  private calculateCombinationsAndRemoveTypes(selectedSuggestionType: string, selectedSuggestionEffectiveness: string) {
    let typeCombinations: DoubleType[] = this.dataService.getAllTypesCombinations();
    const typeFilters: UsedMoveFilter[] = [{effectiveness: selectedSuggestionEffectiveness, type: selectedSuggestionType}];
    this.pokemon.registeredMoves.forEach(regMove => {
      typeFilters.push({type: this.getBackgroundClassFromRecentMoveCaller(regMove.substring(0,2)), effectiveness: this.getEffectivenessFromRecentMoveCaller(regMove.substring(2,3)).split('.')[1]})
    })

    typeFilters.forEach(filterT => {
      typeCombinations = typeCombinations.filter((x) => x.vulnerabilities[filterT.type as string] === filterT.effectiveness);
    })

    const typesMap: Record<string, boolean> = {};
    typeCombinations.forEach(typeComb => {
      typesMap[typeComb.type1] = true;
      typesMap[typeComb.type2] = true;
    })

    const allRemainingTypes = this.pokemon.confirmedTypes.filter(x => x !== "?").concat(this.pokemon.availableTypes).concat(this.pokemon.dubiousTypes);
    allRemainingTypes.forEach(remType => {
      if(!typesMap[remType]) {
        this.moveToRemoved(remType);
        this.deleteFromSuggestionResponseIfPresent(remType)
        this.suggestionResponse.typesResult.removedTypes.push(remType);
      }
    })
  }

  private deleteFromSuggestionResponseIfPresent(type: string) {
    const index = this.suggestionResponse.typesResult.dubiousTypes.findIndex(x => x === type);
    if(index > -1) this.suggestionResponse.typesResult.dubiousTypes.splice(index, 1);
  }
}
