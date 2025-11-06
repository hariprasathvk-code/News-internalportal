import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component')
      .then(m => m.LoginComponent)
  },
  {
    path: 'journalist-dashboard',
    loadComponent: () => import('./components/journalist-dashboard/journalist-dashboard.component')
      .then(m => m.JournalistDashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'news-form',
    loadComponent: () => import('./components/news-form/news-form.component')
      .then(m => m.NewsFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'editor-dashboard',
    loadComponent: () => import('./components/editor-dashboard/editor-dashboard.component')
      .then(m => m.EditorDashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
