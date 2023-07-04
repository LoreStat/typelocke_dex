import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SavedMatch } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-action-selection',
  templateUrl: './action-selection.component.html',
  styleUrls: ['./action-selection.component.scss']
})
export class ActionSelectionComponent {

  public savedMatches: SavedMatch[] = [];


  constructor(private httpClient: HttpClient, private dataService: DataService, private router: Router) {
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
}
