import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SavedMatch } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';
import { FileService } from 'src/app/services/file.service';
import { POKEMON_ICON_PATH } from 'src/assets/constants/devConstants';

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
  public pokemonIcon: number = 0;
  public pokemonIconPath: string = "";
  private generateIcons = false;

  constructor(
    private dataService: DataService,
    private router: Router,
    private fileService: FileService,
    private messageService: MessageService
  ) {
    this.pokemonIconPath = POKEMON_ICON_PATH;
    const savedData = this.fileService.getFile('savedMatches.txt', false);
    this.savedMatches = savedData.split("\n").filter((row: string) => !!row).map((match: string) => {
      const matchSplit = match.split(",");
      return {
        matchName: matchSplit[0],
        file: matchSplit[1],
        startDate: matchSplit[2],
        lastModified: matchSplit[3],
        iconName: matchSplit[4],
      }
    }).sort((a: SavedMatch, b: SavedMatch) => {
      return (new Date(a.lastModified).getTime() > new Date(b.lastModified).getTime()) ? 1 : -1

    })

    dataService.setSavedMatches(this.savedMatches);
  }

  public goToMatchSelection() {
    if(this.savedMatches.length > 0) this.router.navigate(['/match-selection']);
  }

  public goToSettings() {
    this.router.navigate(['/settings']);
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
    this.pokemonIcon = 0;
    this.showNewMatchModal = false;
  }

  private generateIcon() {
    const min = Math.ceil(1);
    const max = Math.floor(650);
    this.pokemonIcon = Math.floor(Math.random() * (max - min) + min);
    setTimeout(() => { if (this.generateIcons) this.generateIcon() }, 1000);
  }

  public createNewMatch() {
    if(this.savedMatches.findIndex(x => x.matchName.split(".txt")[0] === this.newMatchTitle) >= 0) {
      this.messageService.add(
        {
          severity: 'error',
          summary: 'Errore',
          detail: "Esiste gia' un salvataggio con questo nome"
        }
      );
    } else {
      this.savedMatches.push({
        matchName: this.newMatchTitle,
        iconName: this.pokemonIcon + ".png",
        startDate: new Date().toLocaleDateString(),
        lastModified: new Date().toLocaleDateString(),
        file: this.newMatchTitle + ".txt"
      })
      this.dataService.setSavedMatches(this.savedMatches);
      const stringToSave = this.savedMatches.map(x => {
        return x.matchName + "," + x.file + "," + x.startDate + "," + x.lastModified + "," + x.iconName
      }).join("\n");
      this.fileService.writeFile("savedMatches.txt", stringToSave, false)
      this.fileService.writeFile(this.newMatchTitle + ".txt", "", true)
      this.showNewMatchModal = false;
      this.generateIcons = false;
    }
  }
}
