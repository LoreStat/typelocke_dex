import { AfterContentChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-recently-watched',
  templateUrl: './recently-watched.component.html',
  styleUrls: ['./recently-watched.component.scss']
})

export class RecentlyWatchedComponent implements AfterContentChecked {

  public mostRecentlyWatched: MenuItem[] = [];
  private recentlyWatched: string[] = [];
  private iconsPath: string = "";

  constructor(private dataService: DataService) {
    this.iconsPath = this.dataService.getIconsPath();
    this.dataService.selectedPokemon.subscribe(pokemon => {
      if(pokemon !== "undefined") {
        const pokemonIndex = this.recentlyWatched.findIndex(recentlyPoke => recentlyPoke === pokemon);
        if(pokemonIndex !== -1) this.recentlyWatched.splice(pokemonIndex, 1)
        this.recentlyWatched.unshift(pokemon);

        this.mostRecentlyWatched = this.recentlyWatched.slice(0, 5).map(el => {
          return {
            label: el,
            icon: `${this.iconsPath + el}.png`,
            command: () => {
              this.dataService.setPokemon(el);
            }
          }
        })
      }
    });
  }
  ngAfterContentChecked(): void {
    if(this.iconsPath !== this.dataService.getIconsPath()) {
      this.mostRecentlyWatched.forEach(p => {
        if(p.icon) p.icon = p.icon.replace(this.iconsPath, this.dataService.getIconsPath())
      });
      this.iconsPath = this.dataService.getIconsPath();
    }
  }
}
