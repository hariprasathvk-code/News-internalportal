export interface AdBilling {
  BillingId: string;
  AdId: string;
  CategoryName: string;
  Clicks?: number;
  Cost?: number;
  CountryName?: string;
  CPC?: number;
  CPM?: number;
  Impressions?: number;
  LastClicks?: number;
  LastImpressions?: number;
  PaymentStatus?: string;
  RecordedAt?: string;
  RegionType?: string;
  SizeMultiplier?: number;
  StateName?: string;
}