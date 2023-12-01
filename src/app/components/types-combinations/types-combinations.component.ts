import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DoubleType, EffectivenessesCodes, UsedMoveFilter } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';
import { TYPE, TYPES_LIST } from 'src/assets/constants/PokemonData';

interface DropdownModel {
  name: string,
  code: string
}

@Component({
  selector: 'app-types-combinations',
  templateUrl: './types-combinations.component.html',
  styleUrls: ['./types-combinations.component.scss']
})
export class TypesCombinationsComponent {

  public typesCombinations: DoubleType[];
  public typesCombinationsFilters: UsedMoveFilter[];

  public selectedType: TYPE | null = null;
  public selectedEffectiveness: EffectivenessesCodes | null = null;

  public typesList: DropdownModel[];
  public effectivenessesList: DropdownModel[];

  constructor(private dataService: DataService, private translate: TranslateService) {
    this.typesCombinations = dataService.getTypesCombinations();
    this.typesCombinationsFilters = dataService.getTypesCombinationsFilters();
    this.typesList = TYPES_LIST.map(t => {
      return { name: translate.instant("types." + t.toLowerCase()), code: t }
    });
    this.effectivenessesList = [
      EffectivenessesCodes.SUPEREFFECTIVE,
      EffectivenessesCodes.EFFECTIVE,
      EffectivenessesCodes.NOT_EFFECTIVE,
      EffectivenessesCodes.IMMUNE].map(e => {
        return { name: translate.instant("effectiveness." + e), code: e }
      });
  }

  public resetTypesCombinations() {
    this.dataService.resetTypesCombinations();
    this.typesCombinations = this.dataService.getTypesCombinations();
  }

  public resetFilters() {
    this.selectedEffectiveness = null;
    this.selectedType = null;
    this.typesCombinationsFilters = [];
    this.dataService.setTypesCombinationsFilters([]);
    this.resetTypesCombinations();
  }

  public filter() {
    if (this.selectedType && this.selectedEffectiveness && !this.typesCombinationsFilters.find(t => t.type === this.selectedType)) {
      this.typesCombinations = this.typesCombinations.filter((x) => x.vulnerabilities[this.selectedType as string] === this.selectedEffectiveness);
      this.dataService.setTypesCombinations(this.typesCombinations);
      this.typesCombinationsFilters.push({ effectiveness: this.selectedEffectiveness, type: this.selectedType })
      this.dataService.setTypesCombinationsFilters(this.typesCombinationsFilters)
      this.selectedEffectiveness = null;
      this.selectedType = null;
    }
  }

  public getChipLabelByFilter(filter: UsedMoveFilter): string {
    return this.translate.instant('types.' + filter.type.toLowerCase()) + " - " + this.translate.instant('effectiveness.' + filter.effectiveness);
  }
}
