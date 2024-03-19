import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
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
  public hideScreen: boolean = false;

  constructor(
    private dataService: DataService,
    private router: Router,
    private fileService: FileService,
    private location: Location,
    private confirmationService: ConfirmationService,
    private translate: TranslateService,
    private messageService: MessageService
    ) {
    this.savedMatches = dataService.getSavedMatches();
    this.pokemonIconPath = this.dataService.getIconsPath();
    this.hideScreen = false;
  }

  public async loadMatch(matchName: string) {
    await this.fileService.writeSavedMatches(this.dataService.getSavedMatches(), this.dataService.getSettings());
    this.hideScreen = true;
    const matchIndex = this.savedMatches.findIndex(match => (match.matchName + ".txt") === matchName);
    this.savedMatches[matchIndex].lastLogin = new Date().toISOString();

    this.fileService.writeSavedMatches(this.savedMatches, this.dataService.getSettings());

    const pokemonMap: Record<string, PokemonInfo> = {};
    const stringedInfo = await this.fileService.getFile(matchName, true);
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
    this.router.navigate(['/dex']);
    this.dataService.setLoadedMatch(matchName);
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
      accept: async () => {
        const indexToDelete = this.savedMatches.findIndex(x => x.matchName === match.matchName);
        this.savedMatches.splice(indexToDelete, 1);
        await this.fileService.deleteFile(match.matchName, this.savedMatches, this.dataService.getSettings())
      },
    });
  }

  public async exportSave(match: SavedMatch) {
    const stringedInfo = await this.fileService.getFile(match.file, true);
    const dataExport = match.matchName + "," + match.file + "," + match.startDate + "," + match.lastLogin + "," + match.iconName + "\n" + stringedInfo;

    this.fileService.exportSave(dataExport, match.matchName);
    this.messageService.add(
      {
        severity: 'success',
        summary: this.translate.instant('general.exported'),
        detail: this.translate.instant('matchSelection.exportCompletedSuccessfully')
      }
    );
  }
}
