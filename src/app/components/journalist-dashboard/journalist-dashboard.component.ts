import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-journalist-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './journalist-dashboard.component.html',
  styleUrls: ['./journalist-dashboard.component.scss']
})
export class JournalistDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  currentUser: User | null = null;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    console.log('📰 Journalist Dashboard loaded');
    console.log('👤 Current user:', this.currentUser);
  }

  navigateToWriteArticle(): void {
    this.router.navigate(['/news-form']);
  }

  navigateToSubmissions(): void {
    this.router.navigate(['/journalist-submissions']);
  }

  logout(): void {
    this.authService.logout();
  }
}
