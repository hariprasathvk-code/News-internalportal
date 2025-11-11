import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdService } from '../../../core/services/ad.service';


@Component({
  selector: 'app-view-ads',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-ads.html',
  styleUrls: ['./view-ads.scss']
})
export class ViewAdsComponent implements OnInit {
  ads: any[] = [];
  loading = true;

  constructor(private adService: AdService) {}

  ngOnInit(): void {
    this.adService.getAllAds().subscribe({
      next: (data) => {
        this.ads = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}
