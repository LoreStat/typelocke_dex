import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Route, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from 'src/app/services/data.service';
import { POKEMON } from 'src/assets/constants/PokemonData';
import { LOGO_ICON_PATH } from 'src/assets/constants/devConstants';

enum MenuRoutes {
  DEX = "dex",
  TRACKER = "tracker",
  SETTINGS = "settings",
  NONE = "none"
}
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  @Output() toggleRecentSelectedPokemonsEvent = new EventEmitter();

  public menuRoutes = MenuRoutes;
  public isCurrentRouteTracker: boolean = false;

  public matchName: string = "";
  public selectedItem: string = "";
  public pokemonsList: string[] = POKEMON;

  public suggestions: string[] = []

  public logoPath: string = LOGO_ICON_PATH;

  constructor(private dataService: DataService, private router: Router, private route: ActivatedRoute, private t: TranslateService) {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.isCurrentRouteTracker = event.url === "/tracker";
      }
    })
  }

  ngOnInit() {
    this.dataService.selectedMatch.subscribe(match => {
      this.matchName = match.split(".txt")[0];
    })
  }

  public search(event: any) {
    this.suggestions = this.pokemonsList.map(x => this.t.instant("pokemon." + x)).filter(e =>
      e.toLowerCase().indexOf((event.query as string).toLowerCase()) >= 0
    );

    if (this.suggestions.length === 1) {
      this.selectSearchedPokemon(this.suggestions[0]);
    }
  }

  public selectSearchedPokemon(value: string) {
    const pokemonKey = this.pokemonsList.find(x => {
      if (this.t.instant("pokemon." + x) === value) return x
      else return "";
    }) as string;
    console.log(pokemonKey);

    this.dataService.setPokemon(pokemonKey);
    this.router.navigate(["tracker"]);
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

  public toggleRecentSelectedPokemons() {
    this.toggleRecentSelectedPokemonsEvent.emit();
  }

  public showHowToUse() {

  }
}
