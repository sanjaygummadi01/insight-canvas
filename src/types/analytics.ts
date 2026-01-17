export interface DataRow {
  id: string;
  date: string;
  sales: number;
  revenue: number;
  users: number;
  growth: number;
  [key: string]: string | number;
}

export interface DataSet {
  name: string;
  uploadedAt: Date;
  rows: DataRow[];
}

export interface MetricCardData {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: 'sales' | 'revenue' | 'users' | 'growth';
}

export interface ChartDataPoint {
  label: string;
  value: number;
  date?: Date;
}

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  avatarImage?: string;
  role: string;
  joinedAt: Date;
  bio?: string;
  location?: string;
  phone?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  password: string;
  profile: UserProfile;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  dateFormat: string;
  currency: string;
}

export type NavigationItem = {
  id: string;
  label: string;
  icon: string;
  path: string;
};

export enum ExportFormat {
  CSV = 'csv',
  JSON = 'json',
  POWERBI = 'powerbi'
}
