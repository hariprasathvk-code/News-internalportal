import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { AdBilling } from '../../../core/models/ad-billing.model';

import { AdBillingService } from '../../../core/services/adbilling-api.service';
 
@Component({

  selector: 'app-ad-billing-list',

  standalone: true,

  imports: [CommonModule],

  templateUrl: './view-billing.html',

  styleUrls: ['./view-billing.scss']

})

export class AdBillingListComponent implements OnInit {

  bills: AdBilling[] = [];

  lastKey: any = null;

  limit = 20;

  loading = false;
 
  constructor(private billingService: AdBillingService) {}
 
  ngOnInit() {

    this.fetchBilling();

  }
 
  fetchBilling() {

    this.bills = [];

    this.lastKey = null;

    this.loadBilling();

  }
 
  fetchNextPage() {

    this.loadBilling();

  }
 
  private loadBilling() {

    if (this.loading) return;

    this.loading = true;
 
    this.billingService.getBilling(this.limit, this.lastKey).subscribe({

      next: (res) => {

        this.bills = [...this.bills, ...res.bills];

        this.lastKey = res.lastKey;

        this.loading = false;

      },

      error: () => {

        this.loading = false;

      }

    });

  }

}
 