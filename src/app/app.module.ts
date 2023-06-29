import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RecentlyWatchedComponent } from './components/recently-watched/recently-watched.component';
import { TrackerComponent } from './components/tracker/tracker.component';
import { MenuComponent } from './components/menu/menu.component';
import { SuggestionsComponent } from './components/suggestions/suggestions.component';
import { SettingsComponent } from './components/settings/settings.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { MatchSelectionComponent } from './components/match-selection/match-selection.component';
import { HomepageComponent } from './components/homepage/homepage.component';

import { DataService } from './services/data.service';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { DockModule } from 'primeng/dock';

@NgModule({
  declarations: [
    AppComponent,
    RecentlyWatchedComponent,
    TrackerComponent,
    MenuComponent,
    SuggestionsComponent,
    SettingsComponent,
    StatisticsComponent,
    MatchSelectionComponent,
    HomepageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    AutoCompleteModule,
    DockModule,
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
