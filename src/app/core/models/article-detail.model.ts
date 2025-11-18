export interface ArticleDetail {
  NewsId: string;
  SubmittedDate: number;
  Author: string;
  Category: string;
  City: string;
  Content: string;
  Country: string;
  CreatedAt: number;
  MediaCount: number;
  MediaFolder: string;
  NewsType: string;
  Region: string;
  State: string;
  Status: string;
  SubCategory: string;
  SubmittedDateTime: string;
  ApprovedDate?: string; 
  Summary: string;
  Title: string;
  MediaUrls: string[];

   RejectionRemark?: string;
  RejectedAt?: string;
}
