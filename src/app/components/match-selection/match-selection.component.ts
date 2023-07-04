import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { SavedMatch } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-match-selection',
  templateUrl: './match-selection.component.html',
  styleUrls: ['./match-selection.component.scss'],
})
export class MatchSelectionComponent {

  private savedMatches: SavedMatch[] = [];

  constructor(private dataService: DataService) {
    this.savedMatches = dataService.getSavedMatches();
  }
}
