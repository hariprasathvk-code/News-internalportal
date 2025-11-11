// import { Routes } from '@angular/router';
// import { authGuard } from './core/guards/auth.guard';

// export const routes: Routes = [
//   {
//     path: 'login',
//     loadComponent: () => import('./components/login/login.component')
//       .then(m => m.LoginComponent)
//   },
//   {
//     path: 'journalist-dashboard',
//     loadComponent: () => import('./components/journalist-dashboard/journalist-dashboard.component')
//       .then(m => m.JournalistDashboardComponent),
//     canActivate: [authGuard]
//   },
//   {
//     path: 'news-form',
//     loadComponent: () => import('./components/news-form/news-form.component')
//       .then(m => m.NewsFormComponent),
//     canActivate: [authGuard]
//   },
//   {
//     path: 'editor-dashboard',
//     loadComponent: () => import('./components/editor-dashboard/editor-dashboard.component')
//       .then(m => m.EditorDashboardComponent),
//     canActivate: [authGuard]
//   },
// {
//   path: 'advertiser-dashboard',
//   loadComponent: () =>
//     import('./components/advertiser/advertiser-dashboard/advertiser-dashboard')
//       .then(m => m.AdvertiserDashboard),
//   canActivate: [authGuard]
// },
// {
//     path: '',
//     redirectTo: 'advertiser/create-ad',
//     pathMatch: 'full'
//   },
//   {
//     path: 'advertiser/create-ad',
//     loadComponent: () =>
//       import('./components/advertiser/create-ad/create-ad')
//         .then(m => m.CreateAd)
//   },
// {
//   path: 'advertiser/view-ads',
//   loadComponent: () =>
//   import('./components/advertiser/view-ads/view-ads')
//     .then(m => m.ViewAdsComponent),

//   canActivate: [authGuard]
// },
// {
//   path: 'advertiser/view-billing',
//   loadComponent: () =>
//     import('./components/advertiser/view-billing/view-billing')
//       .then(m => m.ViewBilling),
//   canActivate: [authGuard]
// },

//   {
//     path: '',
//     redirectTo: 'login',
//     pathMatch: 'full'
//   },
//   {
//     path: '**',
//     redirectTo: 'login'
//   }
// ];
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
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
          .then(m => m.ViewAdsComponent)
    },
    {
      path: 'view-billing',
      loadComponent: () =>
        import('./components/advertiser/view-billing/view-billing')
          .then(m => m.ViewBillingComponent)
    },
    {
      path: '', // default route inside dashboard
      redirectTo: 'create-ad', // optional: can leave blank if you want an empty page first
      pathMatch: 'full'
    }
  ]
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

