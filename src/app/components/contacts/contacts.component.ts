import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { version } from 'src/assets/constants/devConstants';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent {

  public version;
  constructor(
    private location: Location,
  ) {
    this.version = version;
  }

  public copyMessage(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  public back() {
    this.location.back();
  }
}
