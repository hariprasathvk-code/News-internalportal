import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [

  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component')
        .then(m => m.LoginComponent)
  },
  {
    path: 'journalist-dashboard',
    loadComponent: () =>
      import('./components/journalist-dashboard/journalist-dashboard.component')
        .then(m => m.JournalistDashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'news-form',
    loadComponent: () =>
      import('./components/news-form/news-form.component')
        .then(m => m.NewsFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'editor-dashboard',
    loadComponent: () =>
      import('./components/editor-dashboard/editor-dashboard.component')
        .then(m => m.EditorDashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'advertiser-dashboard',
    loadComponent: () =>
      import('./components/advertiser/advertiser-dashboard/advertiser-dashboard')
        .then(m => m.AdvertiserDashboardComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'create-ad',
        loadComponent: () =>
          import('./components/advertiser/create-ad/create-ad')
            .then(m => m.CreateAdComponent)
      },
      {
        path: 'view-ads',
        loadComponent: () =>
          import('./components/advertiser/view-ads/view-ads')
            .then(m => m.AdSubmissionListComponent)
      },
      {
        path: 'view-billing',
        loadComponent: () =>
          import('./components/advertiser/view-billing/view-billing')
            .then(m => m.AdBillingListComponent)
      },
      {
        path: '', // default route inside dashboard
        redirectTo: 'create-ad', // optional
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'journalist-submissions',  // <-- Add submissions view route here
    loadComponent: () =>
      import('./components/journalist-submissions/journalist-submissions.component')
        .then(m => m.JournalistSubmissionsComponent),
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
