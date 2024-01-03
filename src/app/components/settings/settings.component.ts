import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DropdownItem, Settings } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';
import { LANGUAGES } from 'src/assets/constants/devConstants';
import { TranslateService } from '@ngx-translate/core';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  providers: [FileService]
})
export class SettingsComponent implements OnInit {

  public settings!: Settings;

  public languages: DropdownItem[] = LANGUAGES;

  constructor(
    private dataService: DataService,
    private location: Location,
    private translate: TranslateService,
    private fileService: FileService
    ) {
    this.settings = this.dataService.getSettings();
  }

  ngOnInit() {
  }

  public async saveSettings() {
    this.translate.use(this.settings.language);
    this.dataService.setSettings(this.settings);
    await this.fileService.writeSavedMatches(this.dataService.getSavedMatches(), this.dataService.getSettings());
    this.back();
  }

  public back() {
    this.location.back();
  }

  public setAutomaticSummaryToFalse() {
    this.settings.automaticSummary = false;
  }
}
