import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatchSelectionComponent } from './match-selection/match-selection.component';

const routes: Routes = [
  { path: "", pathMatch: 'full', redirectTo: "load" },
  { path: 'load', component: MatchSelectionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
