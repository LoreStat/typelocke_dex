import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SavedMatch } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';
import { FileService } from 'src/app/services/file.service';
import { POKEMON_ICON_PATH } from 'src/assets/constants/devConstants';
@Component({
  selector: 'app-match-selection',
  templateUrl: './match-selection.component.html',
  styleUrls: ['./match-selection.component.scss'],
  providers: [FileService]
})
export class MatchSelectionComponent {

  public savedMatches: SavedMatch[] = [];
  public pokemonIconPath: string = "";

  constructor(private dataService: DataService, private router: Router, private fileService: FileService) {
    this.savedMatches = dataService.getSavedMatches();
    this.pokemonIconPath = POKEMON_ICON_PATH;
  }

  public loadMatch(matchName: string) {
    this.dataService.setLoadedData(this.fileService.getFile(matchName, true));
    this.dataService.setLoadedMatch(matchName);
    this.router.navigate(['/settings']);
  }
}
