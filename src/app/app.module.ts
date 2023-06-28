import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RecentlyWatchedComponent } from './recently-watched/recently-watched.component';
import { TrackerComponent } from './tracker/tracker.component';
import { MenuComponent } from './menu/menu.component';
import { SuggestionsComponent } from './suggestions/suggestions.component';
import { SettingsComponent } from './settings/settings.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { MatchSelectionComponent } from './match-selection/match-selection.component';

@NgModule({
  declarations: [
    AppComponent,
    RecentlyWatchedComponent,
    TrackerComponent,
    MenuComponent,
    SuggestionsComponent,
    SettingsComponent,
    StatisticsComponent,
    MatchSelectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
