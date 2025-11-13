import { Component, Input, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { AdSubmission } from '../../../core/models/ad-submission.model';

import { AdsApiService } from '../../../core/services/ads-api.service';
 
@Component({

  selector: 'app-ad-submission-list',

  standalone: true,

  imports: [CommonModule, FormsModule],

  templateUrl: './view-ads.html',

  styleUrls: ['./view-ads.scss']

})

export class AdSubmissionListComponent implements OnInit {

  ads: AdSubmission[] = [];

  lastKey: any = null;

  limit = 10; // Items per page

  loading = false;
 
  constructor(private adApi: AdsApiService) {}
 
  ngOnInit() {

    this.fetchAds();

  }
 
  fetchAds() {

    this.ads = [];

    this.lastKey = null;

    this.loadAds();

  }
 
  fetchNextPage() {

    this.loadAds();

  }
 
  private loadAds() {

    if (this.loading) return;

    this.loading = true;
 
    this.adApi.getAds(this.limit, this.lastKey).subscribe({

      next: (res) => {

        this.ads = [...this.ads, ...res.ads];

        this.lastKey = res.lastKey;

        this.loading = false;

      },

      error: () => {

        this.loading = false;

      }

    });

  }
 
  isImage(url: string): boolean {

    return /\.(jpg|jpeg|png|gif|webp)$/i.test((url ?? '').split('?')[0]);

  }
 
  isVideo(url: string): boolean {

    return /\.(mp4|mov|webm|ogg)$/i.test((url ?? '').split('?')[0]);

  }

}

 