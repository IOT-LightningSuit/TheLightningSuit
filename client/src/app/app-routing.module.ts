import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WorkoutsComponent } from './workouts/workouts.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { WorkoutSummaryComponent } from './workout-summary/workout-summary.component';
import { StickmanComponent } from './stickman/stickman.component';

const routes: Routes = [
  {path: 'workouts', component: WorkoutsComponent},
  {path: 'about', component: AboutComponent},
  {path: 'summary', component: WorkoutSummaryComponent},
  {path: 'stickman', component: StickmanComponent},
  {path: '**', component: HomeComponent, pathMatch: 'full'}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
