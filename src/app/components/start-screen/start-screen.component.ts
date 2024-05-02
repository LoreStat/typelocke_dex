import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { SavedMatch, Settings } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';
import { FileService } from 'src/app/services/file.service';
import { POKEMON_IMAGES_LIST } from 'src/assets/constants/PokemonData';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss'],
  providers: [FileService]
})
export class StartScreenComponent {

  public savedMatches: SavedMatch[] = [];

  public showNewMatchModal: boolean = false;
  public newMatchTitle: string = "";
  public selectedGeneration?: string;
  public pokemonIcon: string = "";
  public pokemonIconPath: string = "";
  private generateIcons = false;

  constructor(
    private dataService: DataService,
    private router: Router,
    private fileService: FileService,
    private messageService: MessageService,
    private translate: TranslateService,
  ) {
    const savedData = this.fileService.createOrGetSavedMatches();
    const savedDataList = savedData.split("\n");
    const settingsArray = savedDataList.shift().split(",");

    const settings: Settings = {
      automatic: this.isTrue(settingsArray[0]),
      automaticSummary: this.isTrue(settingsArray[1]),
      hideRecentPokemon: this.isTrue(settingsArray[2]),
      hdImages: this.isTrue(settingsArray[3]),
      language: settingsArray[4]
    }
    dataService.setSettings(settings)
    this.pokemonIconPath = this.dataService.getIconsPath();
    translate.use(settings.language);

    this.savedMatches = savedDataList.filter((row: string) => !!row).map((match: string) => {
      const matchSplit = match.split(",");
      const gen = matchSplit.length > 5 ? matchSplit[5] : "4";
      return {
        matchName: matchSplit[0],
        file: matchSplit[1],
        startDate: matchSplit[2],
        lastLogin: matchSplit[3],
        iconName: matchSplit[4],
        generation: gen
      }
    })

    this.savedMatches.sort((a: SavedMatch, b: SavedMatch) => {
      return (new Date(a.lastLogin).getTime() < new Date(b.lastLogin).getTime()) ? 1 : -1
    })

    dataService.setSavedMatches(this.savedMatches);
  }

  public goToMatchSelection() {
    if(this.savedMatches.length > 0) this.router.navigate(['/match-selection']);
  }

  public goToSettings() {
    this.router.navigate(['/settings']);
  }

  public goToContacts() {
    this.router.navigate(['/contacts']);
  }

  public openNewMatchModal() {
    this.generateIcons = true;
    this.newMatchTitle = "";
    this.showNewMatchModal = true;
    this.generateIcon();
  }

  public hideNewMatchModal() {
    this.generateIcons = false;
    this.newMatchTitle = "";
    this.pokemonIcon = "";
    this.selectedGeneration = undefined;
    this.showNewMatchModal = false;
  }

  private generateIcon() {
    const min = Math.ceil(0);
    const max = Math.floor(502);
    const value = Math.floor(Math.random() * (max - min) + min);
    this.pokemonIcon = POKEMON_IMAGES_LIST[value];
    setTimeout(() => { if (this.generateIcons) this.generateIcon() }, 200);
  }

  public createNewMatch() {
    if(this.selectedGeneration === undefined) return;
    
    if(this.newMatchTitle === "" || this.newMatchTitle.length > 12) {
      this.messageService.add(
        {
          severity: 'error',
          summary: this.translate.instant("general.error"),
          detail: this.translate.instant('errors.titleLength')
        }
      );
      return;
    }
    if(this.savedMatches.findIndex(x => x.matchName.split(".txt")[0] === this.newMatchTitle) >= 0) {
      this.messageService.add(
        {
          severity: 'error',
          summary: this.translate.instant("general.error"),
          detail: this.translate.instant('errors.alreadySavedTitle')
        }
      );
    } else {
      this.savedMatches.unshift({
        matchName: this.newMatchTitle,
        iconName: this.pokemonIcon + ".png",
        startDate: new Date().toLocaleDateString(),
        lastLogin: new Date().toISOString(),
        file: this.newMatchTitle + ".txt",
        generation: this.selectedGeneration as string
      })
      this.dataService.setSavedMatches(this.savedMatches);
      this.fileService.writeSavedMatches(this.dataService.getSavedMatches(), this.dataService.getSettings());
      this.fileService.createMatchFile(this.newMatchTitle, this.selectedGeneration as string);

      this.showNewMatchModal = false;
      this.generateIcons = false;
      this.goToMatchSelection();
    }
  }

  private isTrue(value: string) {
    return value === "true";
  }

  public importSave(file: any, fileUpload: any) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      const data: string = fileReader.result as string;

      const matchArray: string[] = data.split('\n')[0].split(',');
      const gen = matchArray.length > 5 ? matchArray[5] : "4";
      const match: SavedMatch = {
        matchName: matchArray[0],
        iconName: matchArray[4],
        startDate: matchArray[2],
        lastLogin: matchArray[3],
        file: matchArray[1],
        generation: gen,
      };

      if(this.savedMatches.findIndex(x => x.matchName.split(".txt")[0] === match.matchName) >= 0) {
        this.messageService.add(
          {
            severity: 'error',
            summary: this.translate.instant("general.error"),
            detail: this.translate.instant('errors.alreadySavedTitle')
          }
        );
      } else {
        this.savedMatches.unshift(match);
        this.dataService.setSavedMatches(this.savedMatches);
        this.fileService.writeSavedMatches(this.dataService.getSavedMatches(), this.dataService.getSettings());

        const splitMatchData: string[] = data.split('\n');
        splitMatchData.splice(0, 1);
        const matchData = splitMatchData.join('\n');

        this.fileService.writeFile(match.matchName + ".txt", matchData, true);

        this.showNewMatchModal = false;
        this.generateIcons = false;
        this.goToMatchSelection();
      }

      fileUpload.clear();
    }
    fileReader.readAsText(file.files[0]);
  }
}
