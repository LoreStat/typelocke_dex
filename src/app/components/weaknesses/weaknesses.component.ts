import { Component, Input } from '@angular/core';
import { WEAKNESSES } from 'src/assets/constants/MovesData';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-weaknesses',
  templateUrl: './weaknesses.component.html',
  styleUrls: ['./weaknesses.component.scss']
})
export class WeaknessesComponent {
  @Input() confirmedTypes: string[] = [];
  @Output() closeModalEmitter = new EventEmitter<boolean>();

  public veryEffectiveTypes: string[] = [];
  public effectiveTypes: string[] = [];
  public notEffectiveTypes: string[] = [];
  public veryNotEffectiveTypes: string[] = [];
  public immuneTypes: string[] = [];

  ngOnInit() {
    const weak1 = WEAKNESSES[this.confirmedTypes[0]];
    const weak2 = WEAKNESSES[this.confirmedTypes[1]];
    Object.keys(weak2).forEach(ty => {
      weak1[ty] = (weak1[ty] !== undefined ? weak1[ty] : 1) * weak2[ty];
    })

    Object.keys(weak1).forEach(ty => {
      switch(weak1[ty]) {
        case 4:
          this.veryEffectiveTypes.push(ty);
          break;
        case 2:
          this.effectiveTypes.push(ty);
          break;
        case 0.5:
          this.notEffectiveTypes.push(ty);
          break;
        case 0.25:
          this.veryNotEffectiveTypes.push(ty);
          break;
        case 0:
          this.immuneTypes.push(ty);
          break;
        default:
          break;
      }
    })
  }

  public closeModal() {
    this.closeModalEmitter.emit(true);
  }
}
