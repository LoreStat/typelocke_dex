import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'typelocke_dex';
  public choosenMatch = 0;

  constructor(translate: TranslateService, private dataService: DataService) {
    translate.setDefaultLang('en');
    translate.use('it');

    this.dataService.selectedMatch.subscribe(match => {
      if(match) this.choosenMatch = 1;
      else this.choosenMatch = 0;
    });
  }
}
