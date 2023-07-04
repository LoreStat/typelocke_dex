import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { SavedMatch } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {

  public savedMatches: SavedMatch[] = [];

  public showNewMatchModal: boolean = false;
  public newMatchTitle: string = "";
  public pokemonIconPath: string = "assets/images/pokemon-images/{id}.png";
  public pokemonIcon: number = 0;
  private generateIcons = false;

  constructor(private httpClient: HttpClient, private dataService: DataService, private router: Router, private confirmationService: ConfirmationService) {
    this.httpClient.get('assets/savedInstances/savedMatches.txt', { responseType: 'text' })
      .subscribe(data => {
        this.savedMatches = data.split("\n").filter(row => !!row).map((match) => {
          const matchSplit = match.split(",");
          return {
            fileId: matchSplit[0],
            matchName: matchSplit[1],
            startDate: matchSplit[2],
            lastModified: matchSplit[3],
          }
        }).sort((a, b) => {
          return (new Date(a.lastModified).getTime() > new Date(b.lastModified).getTime()) ? 1 : -1

        })

        dataService.setSavedMatches(this.savedMatches);
      });
  }

  public goToMatchSelection() {
    this.router.navigate(['/match-selection']);
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
    setTimeout(() => {if(this.generateIcons) this.generateIcon()}, 1000);
  }

  public createNewMatch() {
    const formData = new FormData();
    formData.append('savedMatches1.txt', "")
    this.httpClient.post('/',formData, {headers: {
      'Content-Type': 'multipart/form-data'
     }})
    this.showNewMatchModal = false;
    this.generateIcons = false;
  }
}
