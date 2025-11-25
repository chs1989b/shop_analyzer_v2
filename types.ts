
export interface AuditMetric {
  name: string;
  score: number; // 0-100
  value: string; // e.g., "1.2s", "Present"
  status: 'good' | 'warning' | 'poor';
  description: string;
}

export interface AuditSection {
  title: string;
  score: number;
  items: AuditMetric[];
}

export interface CompetitorItem {
  name: string; // Name of competitor or "Industry Standard"
  comparison: string; // Description of the difference
}

export interface CompetitorAnalysis {
  summary: string;
  items: CompetitorItem[];
}

export interface AuditReport {
  url: string;
  timestamp: string;
  overallScore: number;
  summary: string;
  platform: string; // e.g., "Shopify", "WooCommerce", "Custom"
  performance: AuditSection;
  seo: AuditSection;
  ux: AuditSection; // Header, Footer, Navigation
  security: AuditSection;
  competitorAnalysis: CompetitorAnalysis; // New section
  recommendations: string[];
}

export interface HistoryItem {
  id: string;
  url: string;
  timestamp: string;
  score: number;
  platform: string;
  clientIp?: string; // Added IP tracking
}

export enum AnalysisState {
  IDLE,
  ANALYZING,
  COMPLETE,
  ERROR
}