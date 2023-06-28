import { Component, OnInit } from '@angular/core';
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
  ngOnInit(): void {
  }

  public search(event: any) {
    this.suggestions = this.pokemonsList.filter(e =>
      e.toLowerCase().indexOf((event.query as string).toLowerCase()) >= 0
    );
  }
}
