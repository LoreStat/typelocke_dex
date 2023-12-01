import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackerComponent } from './components/tracker/tracker.component';
import { MatchSelectionComponent } from './components/match-selection/match-selection.component';
import { SettingsComponent } from './components/settings/settings.component';
import { StartScreenComponent } from './components/start-screen/start-screen.component';
import { DexComponent } from './components/dex/dex.component';
import { TypesCombinationsComponent } from './components/types-combinations/types-combinations.component';

const routes: Routes = [
  { path: "", pathMatch: 'full', redirectTo: "start" },
  { path: "start", component: StartScreenComponent },
  { path: "tracker", component: TrackerComponent },
  { path: "settings", component: SettingsComponent },
  { path: "match-selection", component: MatchSelectionComponent },
  { path: "dex", component: DexComponent },
  { path: "types-combinations", component: TypesCombinationsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
