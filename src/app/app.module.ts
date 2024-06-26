import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RecentlyWatchedComponent } from './components/recently-watched/recently-watched.component';
import { TrackerComponent } from './components/tracker/tracker.component';
import { MenuComponent } from './components/menu/menu.component';
import { SettingsComponent } from './components/settings/settings.component';
import { MatchSelectionComponent } from './components/match-selection/match-selection.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { StartScreenComponent } from './components/start-screen/start-screen.component';
import { DexComponent } from './components/dex/dex.component';
import { TypesCombinationsComponent } from './components/types-combinations/types-combinations.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { HowToUseComponent } from './components/how-to-use/how-to-use.component';

import { DataService } from './services/data.service';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { DockModule } from 'primeng/dock';
import { DropdownModule } from 'primeng/dropdown';
import { SpeedDialModule } from 'primeng/speeddial';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ScrollerModule } from 'primeng/scroller';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AutoFocusModule } from 'primeng/autofocus';
import { SidebarModule } from 'primeng/sidebar';
import { FileUploadModule } from 'primeng/fileupload';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { WeaknessesComponent } from './components/weaknesses/weaknesses.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/');
}

@NgModule({
  declarations: [
    AppComponent,
    RecentlyWatchedComponent,
    TrackerComponent,
    MenuComponent,
    SettingsComponent,
    MatchSelectionComponent,
    HomepageComponent,
    StartScreenComponent,
    DexComponent,
    TypesCombinationsComponent,
    ContactsComponent,
    HowToUseComponent,
    WeaknessesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    AutoCompleteModule,
    AutoFocusModule,
    BadgeModule,
    BlockUIModule,
    ButtonModule,
    CardModule,
    CheckboxModule,
    ChipModule,
    ConfirmDialogModule,
    DialogModule,
    DockModule,
    DropdownModule,
    FileUploadModule,
    InputTextareaModule,
    InputTextModule,
    MessagesModule,
    OverlayPanelModule,
    ProgressSpinnerModule,
    RadioButtonModule,
    ScrollerModule,
    SidebarModule,
    SpeedDialModule,
    ToastModule,
    TooltipModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
  ],
  providers: [
    DataService,
    MessageService,
    HttpClient,
    ConfirmationService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
