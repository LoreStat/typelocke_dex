import { Component } from '@angular/core';
import { Settings } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {
  public settings: Settings;

  constructor(dataservice: DataService) {
    this.settings = dataservice.getSettings();
  }
}
