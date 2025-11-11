// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { AdService } from '../../../core/services/ad.service';
// import { SubCategory, Region } from '../../../core/models';

// @Component({
//   selector: 'app-create-ad',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './create-ad.html',
//   styleUrls: ['./create-ad.scss']
// })
// export class CreateAdComponent implements OnInit {
//   ad: any = {
//     Title: '',
//     Description: '',
//     CategoryName: '',
//     RegionName: '',
//     LocationName: '',
//     AdType: '',
//     TargetUrl: '',
//     StartTime: '',
//     EndTime: '',
//     Activated: false,
//     sizePreset: '300x250',
//     width: 300,
//     height: 250
//   };

//   subcategories: SubCategory[] = [];
//   regions: Region[] = [];
//   locations: string[] = [];
//   adTypes: string[] = ['Banner', 'Video', 'Popup', 'Sponsored', 'GIF'];

//   sizePresets = [
//     { label: '300 x 250 (Small)', value: '300x250' },
//     { label: '728 x 90 (Leaderboard)', value: '728x90' },
//     { label: '160 x 600 (Skyscraper)', value: '160x600' },
//     { label: '1080 x 1350 (Vertical Ad)', value: '1080x1350' }
//   ];

//   uploading = false;
//   fileBase64: string | null = null;
//   mimeType: string = 'image/png';

//   showRegionDropdown = false;
//   showLocationDropdown = false;

//   constructor(private adService: AdService) {}

//   ngOnInit(): void {
//     this.loadDropdowns();
//   }

//   loadDropdowns(): void {
//     // load category list
//     this.adService.getSubCategories().subscribe((data: SubCategory[]) => {
//       this.subcategories = data;
//     });
//   }

//   // When category is changed
//   onCategoryChange(event: any): void {
//     const selectedCategory = event.target.value;
//     this.ad.CategoryName = selectedCategory;

//     if (selectedCategory === 'Regional') {
//       this.showRegionDropdown = true;
//       this.regions = [
//         { id: '1', name: 'National' },
//         { id: '2', name: 'International' }
//       ];
//     } else {
//       // Hide region/location when not Regional
//       this.showRegionDropdown = false;
//       this.showLocationDropdown = false;
//       this.regions = [];
//       this.locations = [];
//       this.ad.RegionName = '';
//       this.ad.LocationName = '';
//     }
//   }

//   // When region is changed
//   onRegionChange(event: any): void {
//     const selectedRegion = event.target.value;
//     this.ad.RegionName = selectedRegion;

//     if (selectedRegion === 'National') {
//       this.showLocationDropdown = true;
//       this.locations = [
//         'Tamil Nadu',
//         'Karnataka',
//         'Maharashtra',
//         'Kerala',
//         'Jammu & Kashmir',
//         'Gujarat',
//         'Bihar',
//         'Uttar Pradesh',
//         'Madhya Pradesh',
//         'Telangana'
//       ];
//     } else if (selectedRegion === 'International') {
//       this.showLocationDropdown = true;
//       this.locations = ['US', 'Europe', 'Pakistan', 'China', 'UK'];
//     } else {
//       this.showLocationDropdown = false;
//       this.locations = [];
//       this.ad.LocationName = '';
//     }
//   }

//   onSizeChange(event: any): void {
//     const [w, h] = event.target.value.split('x').map(Number);
//     this.ad.width = w;
//     this.ad.height = h;
//   }

//   onFileSelected(event: any): void {
//     const file = event.target.files[0];
//     if (!file) return;
//     this.mimeType = file.type;

//     const reader = new FileReader();
//     reader.onload = () => {
//       const result = reader.result as string;
//       this.fileBase64 = result.split(',')[1];
//     };
//     reader.readAsDataURL(file);
//   }

//   onSubmit(): void {
//     if (
//       !this.ad.Title ||
//       !this.ad.CategoryName ||
//       (this.showRegionDropdown && !this.ad.RegionName) ||
//       (this.showLocationDropdown && !this.ad.LocationName) ||
//       !this.ad.AdType ||
//       !this.ad.StartTime ||
//       !this.ad.EndTime ||
//       !this.fileBase64
//     ) {
//       alert('❌ Please fill all required fields and upload an image.');
//       return;
//     }

//     this.uploading = true;

//     const payload = {
//       ...this.ad,
//       MimeType: this.mimeType,
//       FileData: this.fileBase64,
//       Billing: { Impressions: 0, Clicks: 0, Cost: 0 }
//     };

//     this.adService.createAd(payload).subscribe({
//       next: () => {
//         alert('✅ Ad created successfully!');
//         this.uploading = false;
//         this.resetForm();
//       },
//       error: (err) => {
//         console.error('Error:', err);
//         alert('❌ Error while creating ad.');
//         this.uploading = false;
//       }
//     });
//   }

//   resetForm(): void {
//     this.ad = {
//       Title: '',
//       Description: '',
//       CategoryName: '',
//       RegionName: '',
//       LocationName: '',
//       AdType: '',
//       TargetUrl: '',
//       StartTime: '',
//       EndTime: '',
//       Activated: false,
//       sizePreset: '300x250',
//       width: 300,
//       height: 250
//     };
//     this.fileBase64 = null;
//     this.showRegionDropdown = false;
//     this.showLocationDropdown = false;
//   }
// }
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdService } from '../../../core/services/ad.service';
import { LocationService } from '../../../core/services/location.service';
import { SubCategory, Region, Country, State, Category } from '../../../core/models/news.models';
 
@Component({
  selector: 'app-create-ad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-ad.html',
  styleUrls: ['./create-ad.scss']
})
export class CreateAdComponent implements OnInit {
 
  ad: any = {
    Title: '',
    Description: '',
    CategoryId: null,
    RegionId: null,
    CountryId: null,
    StateId: null,
    AdType: '',
    TargetUrl: '',
    StartTime: '',
    EndTime: '',
    Activated: false,
    sizePreset: '300x250',
    width: 300,
    height: 250
  };
 
  categories: Category[] = [];
  regions: Region[] = [];
  countries: Country[] = [];
  states: State[] = [];
 
  adTypes: string[] = ['Banner', 'Video', 'Popup', 'Sponsored', 'GIF'];
 
  sizePresets = [
    { label: '300 x 250 (Small)', value: '300x250' },
    { label: '728 x 90 (Leaderboard)', value: '728x90' },
    { label: '160 x 600 (Skyscraper)', value: '160x600' },
    { label: '1080 x 1350 (Vertical Ad)', value: '1080x1350' }
  ];
 
  uploading = false;
  fileBase64: string | null = null;
  mimeType: string = 'image/png';
 
  constructor(private adService: AdService, private locationService: LocationService) {}
 
  ngOnInit(): void {
    this.loadDropdowns();
  }
 
  loadDropdowns(): void {
    this.locationService.getCategories().subscribe(data => this.categories = data);
    this.locationService.getRegions().subscribe(data => this.regions = data);
  }
 
  onRegionChange(event: any): void {
    const regionId = Number(event.target.value);
    this.ad.RegionId = regionId;
    this.countries = [];
    this.states = [];
 
    this.locationService.getCountriesByRegion(regionId).subscribe(data => {
      this.countries = data;
    });
  }
 
  onCountryChange(event: any): void {
    const countryId = Number(event.target.value);
    this.ad.CountryId = countryId;
    this.states = [];
 
    this.locationService.getStatesByCountry(countryId).subscribe(data => {
      this.states = data;
    });
  }
 
  onSizeChange(event: any): void {
    const [w, h] = event.target.value.split('x').map(Number);
    this.ad.width = w;
    this.ad.height = h;
  }
 
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    this.mimeType = file.type;
 
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      this.fileBase64 = result.split(',')[1];
    };
    reader.readAsDataURL(file);
  }
 
  onSubmit(): void {
    if (!this.ad.Title || !this.ad.CategoryId || !this.ad.RegionId ||
        !this.ad.CountryId || !this.ad.StateId || !this.ad.AdType ||
        !this.ad.StartTime || !this.ad.EndTime || !this.fileBase64) {
      alert('Please fill all required fields.');
      return;
    }
 
    this.uploading = true;
 
    // ✅ Map IDs to names for Lambda
    const categoryName = this.categories.find(c => c.id == this.ad.CategoryId)?.name || 'General';
    const regionName = this.regions.find(r => r.id == this.ad.RegionId)?.name || '';
    const countryName = this.countries.find(c => c.id == this.ad.CountryId)?.name || '';
    const stateName = this.states.find(s => s.id == this.ad.StateId)?.name || '';
 
    // ✅ Build payload with names instead of IDs
    const payload = {
      Title: this.ad.Title,
      Description: this.ad.Description,
      CategoryName: categoryName,
      RegionType: regionName,
      Country: countryName,
      State: stateName,
      AdType: this.ad.AdType,
      TargetUrl: this.ad.TargetUrl,
      StartTime: this.ad.StartTime,
      EndTime: this.ad.EndTime,
      Activated: this.ad.Activated,
      width: this.ad.width,
      height: this.ad.height,
      MimeType: this.mimeType,
      FileData: this.fileBase64,
      Billing: { Impressions: 0, Clicks: 0, Cost: 0 }
    };
 
    this.adService.createAd(payload).subscribe({
      next: () => {
        alert('Ad created successfully!');
        this.uploading = false;
        this.resetForm();
      },
      error: () => {
        alert('Error while creating ad.');
        this.uploading = false;
      }
    });
  }
 
  resetForm(): void {
    this.ad = {
      Title: '',
      Description: '',
      CategoryId: null,
      RegionId: null,
      CountryId: null,
      StateId: null,
      AdType: '',
      TargetUrl: '',
      StartTime: '',
      EndTime: '',
      Activated: false,
      sizePreset: '300x250',
      width: 300,
      height: 250
    };
    this.fileBase64 = null;
    this.countries = [];
    this.states = [];
  }
}