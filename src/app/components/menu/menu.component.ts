import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { POKEMON } from 'src/assets/constants/PokemonData';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public selectedItem: string = "";
  public pokemonsList: string[] = POKEMON;

  public suggestions: string[] = []

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
  }

  public search(event: any) {
    this.suggestions = this.pokemonsList.filter(e =>
      e.toLowerCase().indexOf((event.query as string).toLowerCase()) >= 0
    );

    if(this.suggestions.length === 1) this.dataService.setPokemon(this.suggestions[0]);
  }

  public backToStart() {
    this.dataService.setLoadedMatch("");
    this.router.navigate(["start"]);
  }
}
