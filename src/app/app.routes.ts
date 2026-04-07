import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { MainComponent } from './pages/main/main.component';
import { HistoryComponent } from './pages/history/history.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'main', component: MainComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: '**', redirectTo: '' }
];