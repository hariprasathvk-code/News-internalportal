import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { NewsService } from '../../core/services/news.service';
import { LocationService } from '../../core/services/location.service';
import { FileUploadService } from '../../core/services/file-upload.service';
import { NewsSubmission, Region, Country, State, City, Category, SubCategory, NewsType } from '../../core/models/news.models';

@Component({
  selector: 'app-news-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './news-form.component.html',
  styleUrls: ['./news-form.component.scss'],
  providers: [NewsService, LocationService, FileUploadService]
})
export class NewsFormComponent implements OnInit {

  newsForm: FormGroup;
  submitted = false;
  loading = false;
  successMessage: string = '';
  errorMessage: string = '';

  // All data
  allRegions: Region[] = [];
  allCountries: Country[] = [];
  allStates: State[] = [];
  allCities: City[] = [];
  allCategories: Category[] = [];
  allSubCategories: SubCategory[] = [];
  allNewsTypes: NewsType[] = [];

  // Filtered data for autocomplete
  filteredRegions: Region[] = [];
  filteredCountries: Country[] = [];
  filteredStates: State[] = [];
  filteredCities: City[] = [];
  filteredCategories: Category[] = [];
  filteredSubCategories: SubCategory[] = [];
  filteredNewsTypes: NewsType[] = [];

  // Search terms
  regionSearch: string = '';
  countrySearch: string = '';
  stateSearch: string = '';
  citySearch: string = '';
  categorySearch: string = '';
  subCategorySearch: string = '';
  newsTypeSearch: string = '';

  // Dropdown visibility
  showRegionDropdown = false;
  showCountryDropdown = false;
  showStateDropdown = false;
  showCityDropdown = false;
  showCategoryDropdown = false;
  showSubCategoryDropdown = false;
  showNewsTypeDropdown = false;

  selectedFiles: File[] = [];
  selectedFilesPreview: string[] = [];

  // User data
  currentUser: any;
  accessToken: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private newsService: NewsService,
    private locationService: LocationService,
    private fileUploadService: FileUploadService,
    private router: Router
  ) {
    this.newsForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      summary: ['', [Validators.required, Validators.minLength(20)]],
      content: ['', [Validators.required, Validators.minLength(100)]],
      category: ['', Validators.required],
      subCategory: ['', Validators.required],
      region: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      newsType: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserData();
    this.loadAllData();
  }

  loadUserData(): void {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('idToken');

    if (user && token) {
      this.currentUser = JSON.parse(user);
      this.accessToken = token;
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadAllData(): void {
    // Load all master data at once
    this.locationService.getRegions().subscribe(data => {
      this.allRegions = data;
      this.filteredRegions = data;
    });

    this.locationService.getCategories().subscribe(data => {
      this.allCategories = data;
      this.filteredCategories = data;
    });

    this.locationService.getNewsTypes().subscribe(data => {
      this.allNewsTypes = data;
      this.filteredNewsTypes = data;
    });

    // Load countries for cascading
    this.locationService.getCountriesByRegion(0).subscribe(data => {
      this.allCountries = data;
    });

    this.locationService.getStatesByCountry(0).subscribe(data => {
      this.allStates = data;
    });

    this.locationService.getCitiesByState(0).subscribe(data => {
      this.allCities = data;
    });
  }

  // ============ REGION HANDLERS ============
  onRegionSearch(term: string): void {
    this.regionSearch = term;
    this.filteredRegions = this.locationService.filterItems(this.allRegions, term, 'name');
    this.showRegionDropdown = true;
  }

  selectRegion(region: Region): void {
    this.newsForm.patchValue({ region: region.name });
    this.regionSearch = region.name;
    this.showRegionDropdown = false;

    // Clear dependent fields
    this.newsForm.patchValue({ country: '', state: '', city: '' });
    this.countrySearch = '';
    this.stateSearch = '';
    this.citySearch = '';

    // Load countries for this region
    this.locationService.getCountriesByRegion(region.id).subscribe(data => {
      this.allCountries = data;
      this.filteredCountries = data;
    });
  }

  // ============ COUNTRY HANDLERS ============
  onCountrySearch(term: string): void {
    this.countrySearch = term;
    this.filteredCountries = this.locationService.filterItems(this.allCountries, term, 'name');
    this.showCountryDropdown = true;
  }

  selectCountry(country: Country): void {
    this.newsForm.patchValue({ country: country.name });
    this.countrySearch = country.name;
    this.showCountryDropdown = false;

    // Clear dependent fields
    this.newsForm.patchValue({ state: '', city: '' });
    this.stateSearch = '';
    this.citySearch = '';

    // Load states for this country
    this.locationService.getStatesByCountry(country.id).subscribe(data => {
      this.allStates = data;
      this.filteredStates = data;
    });
  }

  // ============ STATE HANDLERS ============
  onStateSearch(term: string): void {
    this.stateSearch = term;
    this.filteredStates = this.locationService.filterItems(this.allStates, term, 'name');
    this.showStateDropdown = true;
  }

  selectState(state: State): void {
    this.newsForm.patchValue({ state: state.name });
    this.stateSearch = state.name;
    this.showStateDropdown = false;

    // Clear dependent fields
    this.newsForm.patchValue({ city: '' });
    this.citySearch = '';

    // Load cities for this state
    this.locationService.getCitiesByState(state.id).subscribe(data => {
      this.allCities = data;
      this.filteredCities = data;
    });
  }

  // ============ CITY HANDLERS ============
  onCitySearch(term: string): void {
    this.citySearch = term;
    this.filteredCities = this.locationService.filterItems(this.allCities, term, 'name');
    this.showCityDropdown = true;
  }

  selectCity(city: City): void {
    this.newsForm.patchValue({ city: city.name });
    this.citySearch = city.name;
    this.showCityDropdown = false;
  }

  // ============ CATEGORY HANDLERS ============
  onCategorySearch(term: string): void {
    this.categorySearch = term;
    this.filteredCategories = this.locationService.filterItems(this.allCategories, term, 'name');
    this.showCategoryDropdown = true;
  }

  selectCategory(category: Category): void {
    this.newsForm.patchValue({ category: category.name, subCategory: '' });
    this.categorySearch = category.name;
    this.showCategoryDropdown = false;
    this.subCategorySearch = '';

    // Load subcategories for this category
    this.locationService.getSubCategories(category.id).subscribe(data => {
      this.allSubCategories = data;
      this.filteredSubCategories = data;
    });
  }

  // ============ SUBCATEGORY HANDLERS ============
  onSubCategorySearch(term: string): void {
    this.subCategorySearch = term;
    this.filteredSubCategories = this.locationService.filterItems(this.allSubCategories, term, 'name');
    this.showSubCategoryDropdown = true;
  }

  selectSubCategory(subCategory: SubCategory): void {
    this.newsForm.patchValue({ subCategory: subCategory.name });
    this.subCategorySearch = subCategory.name;
    this.showSubCategoryDropdown = false;
  }

  // ============ NEWS TYPE HANDLERS ============
  onNewsTypeSearch(term: string): void {
    this.newsTypeSearch = term;
    this.filteredNewsTypes = this.locationService.filterItems(this.allNewsTypes, term, 'name');
    this.showNewsTypeDropdown = true;
  }

  selectNewsType(newsType: NewsType): void {
    this.newsForm.patchValue({ newsType: newsType.name });
    this.newsTypeSearch = newsType.name;
    this.showNewsTypeDropdown = false;
  }

  // ============ FILE HANDLERS ============
  onFileSelected(event: any): void {
    const files: FileList = event.target.files;

    if (files) {
      if (this.selectedFiles.length + files.length > 5) {
        this.errorMessage = 'Maximum 5 files allowed';
        return;
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!this.fileUploadService.validateFileSize(file, 10)) {
          this.errorMessage = `File ${file.name} exceeds 10MB limit`;
          return;
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'application/pdf'];
        if (!this.fileUploadService.validateFileType(file, allowedTypes)) {
          this.errorMessage = `File type not allowed for ${file.name}`;
          return;
        }

        this.selectedFiles.push(file);

        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.selectedFilesPreview.push(e.target.result);
          };
          reader.readAsDataURL(file);
        } else {
          this.selectedFilesPreview.push(`📄 ${file.name}`);
        }
      }

      this.errorMessage = '';
    }
  }
  
  onBack() {
  // Option 1: Navigate with Angular Router
  this.router.navigate(['/editor-dashboard']); // or whatever your back route is

  // Option 2: Emit event if used in parent component
  // this.back.emit();
}

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.selectedFilesPreview.splice(index, 1);
  }

  get f() {
    return this.newsForm.controls;
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.newsForm.invalid) {
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }

    this.loading = true;

    try {
      const mediaFiles = await this.fileUploadService.convertFilesToMediaFiles(
        this.selectedFilesAsFileList()
      );

      const newsSubmission: NewsSubmission = {
        title: this.f['title'].value,
        summary: this.f['summary'].value,
        content: this.f['content'].value,
        category: this.f['category'].value,
        subCategory: this.f['subCategory'].value,
        region: this.f['region'].value,
        country: this.f['country'].value,
        state: this.f['state'].value,
        city: this.f['city'].value,
        newsType: this.f['newsType'].value,
        authorFullName: this.currentUser.FullName,
        mediaFiles: mediaFiles
      };

      this.newsService.submitNews(newsSubmission, this.accessToken).subscribe({
        next: (response) => {
          this.loading = false;
          this.successMessage = `News submitted successfully! NewsID: ${response.newsId}`;
          
          this.newsForm.reset();
          this.selectedFiles = [];
          this.selectedFilesPreview = [];
          this.submitted = false;

          setTimeout(() => {
            this.successMessage = '';
          }, 5000);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.Message || 'Failed to submit news';
          console.error('Error:', error);
        }
      });
    } catch (error) {
      this.loading = false;
      this.errorMessage = 'Error processing files';
      console.error('Error:', error);
    }
  }

  selectedFilesAsFileList(): FileList {
    const dataTransfer = new DataTransfer();
    this.selectedFiles.forEach(file => {
      dataTransfer.items.add(file);
    });
    return dataTransfer.files;
  }

  resetForm(): void {
    this.newsForm.reset();
    this.selectedFiles = [];
    this.selectedFilesPreview = [];
    this.submitted = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeAllDropdowns(): void {
    this.showRegionDropdown = false;
    this.showCountryDropdown = false;
    this.showStateDropdown = false;
    this.showCityDropdown = false;
    this.showCategoryDropdown = false;
    this.showSubCategoryDropdown = false;
    this.showNewsTypeDropdown = false;
  }
}
