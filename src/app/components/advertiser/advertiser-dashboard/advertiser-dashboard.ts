// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-advertiser-dashboard',
//   standalone: true,
//   templateUrl: './advertiser-dashboard.html',
//   styleUrls: ['./advertiser-dashboard.scss']
// })
// export class AdvertiserDashboard { }
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-advertiser-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet,RouterModule],
  templateUrl: './advertiser-dashboard.html',
  styleUrls: ['./advertiser-dashboard.scss']
})
export class AdvertiserDashboardComponent {
  constructor(private router: Router) {}

  logout() {
    // 🧹 Clear authentication info if stored in localStorage/sessionStorage
    localStorage.removeItem('token');
    sessionStorage.clear();

    // 🔁 Navigate to login page
    this.router.navigate(['/login']);
  }
}
