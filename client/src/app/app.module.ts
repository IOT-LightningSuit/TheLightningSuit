import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { WorkoutsComponent } from './workouts/workouts.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { FormsModule } from '@angular/forms';
import { WorkoutSummaryComponent } from './workout-summary/workout-summary.component';
import { StickmanComponent } from './stickman/stickman.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    AboutComponent,
    WorkoutsComponent,
    PersonalInfoComponent,
    WorkoutSummaryComponent,
    StickmanComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
