import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'calendar', component: AppComponent }, // Placeholder per ora
  { path: 'history', component: AppComponent },
  { path: 'stats', component: AppComponent },
  { path: 'more', component: AppComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}