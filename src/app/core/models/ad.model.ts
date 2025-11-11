export interface Ad {
  Title: string;
  Description?: string;

  CategoryName: string;   // ✅ NOT subCategoryName

  RegionType: string;     // ✅ NOT regionName
  State?: string;     // ✅ Only when RegionType = National
  Country?: string;   // ✅ Only when RegionType = International

  AdType: string;
  TargetUrl?: string;

  StartTime: string;
  EndTime: string;
  Activated: boolean;

  width: number;
  height: number;

  MimeType?: string;
  FileData?: string;
}
