export interface CategoryRevenueItem {
  category: string;
  amount: number;
}

export interface LeaderboardResponse {
  lambda: string;
  totalCategories: number;
  overallRevenue: number;
  revenueByCategory: CategoryRevenueItem[];
  ranking: CategoryRevenueItem[];
  percentageShare: { [category: string]: string }; // percentage as string
  topCategory: string;
  lowestCategory: string;
  message: string;
}
