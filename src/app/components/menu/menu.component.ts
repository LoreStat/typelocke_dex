import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { POKEMON } from 'src/assets/constants/PokemonData';
import { LOGO_ICON_PATH } from 'src/assets/constants/devConstants';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public matchName: string = "";
  public selectedItem: string = "";
  public pokemonsList: string[] = POKEMON;

  public suggestions: string[] = []

  public logoPath: string = LOGO_ICON_PATH;

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.dataService.selectedMatch.subscribe(match => {
      this.matchName = match.split(".txt")[0];
    })
  }

  public search(event: any) {
    this.suggestions = this.pokemonsList.filter(e =>
      e.toLowerCase().indexOf((event.query as string).toLowerCase()) >= 0
    );

    if(this.suggestions.length === 1) this.dataService.setPokemon(this.suggestions[0]);
  }

  public backToStart() {
    this.dataService.setLoadedMatch("");
    this.dataService.setPokemon("undefined");
    this.router.navigate(["start"]);
  }

  public navigateToDex() {
    this.router.navigate(["dex"]);
  }

  public goToSettings() {
    this.router.navigate(["settings"]);
  }
}
