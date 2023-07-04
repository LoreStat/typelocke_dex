import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
import { ActionSelectionComponent } from './components/action-selection/action-selection.component';

import { DataService } from './services/data.service';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DockModule } from 'primeng/dock';
import { SpeedDialModule } from 'primeng/speeddial';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';


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
    HomepageComponent,
    ActionSelectionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    AutoCompleteModule,
    ButtonModule,
    CardModule,
    ConfirmDialogModule,
    DialogModule,
    DockModule,
    InputTextModule,
    MessagesModule,
    SpeedDialModule,
    ToastModule,
    HttpClientModule
  ],
  providers: [DataService, MessageService, HttpClient, ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
