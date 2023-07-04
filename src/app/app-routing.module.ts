import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackerComponent } from './components/tracker/tracker.component';
import { MatchSelectionComponent } from './components/match-selection/match-selection.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ActionSelectionComponent } from './components/action-selection/action-selection.component';

const routes: Routes = [
  { path: "", pathMatch: 'full', redirectTo: "selection" },
  { path: "selection", component: ActionSelectionComponent },
  { path: 'tracker', component: TrackerComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'match-selection', component: MatchSelectionComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
