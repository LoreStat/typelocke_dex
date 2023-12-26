import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { PokemonInfo, SavedMatch } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';
import { FileService } from 'src/app/services/file.service';
@Component({
  selector: 'app-match-selection',
  templateUrl: './match-selection.component.html',
  styleUrls: ['./match-selection.component.scss'],
  providers: [FileService]
})
export class MatchSelectionComponent {

  public savedMatches: SavedMatch[] = [];
  public pokemonIconPath: string = "";

  constructor(
    private dataService: DataService,
    private router: Router,
    private fileService: FileService,
    private location: Location,
    private confirmationService: ConfirmationService,
    private translate: TranslateService
    ) {
    this.savedMatches = dataService.getSavedMatches();
    this.pokemonIconPath = this.dataService.getIconsPath();
  }

  public loadMatch(matchName: string) {
    this.dataService.setLoadedMatch(matchName);
    this.fileService.writeSavedMatches(this.dataService.getSavedMatches(), this.dataService.getSettings());

    const pokemonMap: Record<string, PokemonInfo> = {};
    const stringedInfo = this.fileService.getFile(matchName, true);
    const pokemonInfoList = stringedInfo.split("\n");

    (pokemonInfoList as string[]).forEach(pokeInfo => {
      if(pokeInfo) {
        const splittedPokeInfo = pokeInfo.split("/");
        pokemonMap[splittedPokeInfo[0]] = {
          name: splittedPokeInfo[0],
          confirmedTypes: [splittedPokeInfo[1], splittedPokeInfo[2]],
          availableTypes: splittedPokeInfo[3].split(",").filter(x => x !== ""),
          dubiousTypes: splittedPokeInfo[4].split(",").filter(x => x !== ""),
          removedTypes: splittedPokeInfo[5].split(",").filter(x => x !== ""),
          registeredMoves: splittedPokeInfo[6].split(",").filter(x => x !== ""),
          notes: atob(splittedPokeInfo[7] || "")
        }
      }
    })

    this.dataService.setLoadedData(pokemonMap);
    console.log(pokemonMap);
    this.router.navigate(['/dex']);
  }

  public back() {
    this.location.back();
  }

  public getLocaleDateString(value: string) {
    return new Date(value).toLocaleDateString();
  }

  public askRemoveAdventure(match: SavedMatch) {
    this.confirmationService.confirm({
      message: this.translate.instant('matchSelection.deleteMessage'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.translate.instant('general.yes'),
      rejectLabel: this.translate.instant('general.no'),
      accept: () => {
        const indexToDelete = this.savedMatches.findIndex(x => x.matchName === match.matchName);
        this.savedMatches.splice(indexToDelete, 1);
        this.fileService.deleteFile(match.matchName, this.savedMatches, this.dataService.getSettings())
      },
    });
  }
}
