import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'app-how-to-use',
  templateUrl: './how-to-use.component.html',
  styleUrls: ['./how-to-use.component.scss']
})
export class HowToUseComponent implements OnInit {

  constructor(private t: TranslateService) {

  }

  ngOnInit() {

  }

}
