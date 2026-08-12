export type UrgencyLevel = 'breaking' | 'urgent' | 'important' | 'official' | 'normal';

export type SourceType = 'agency' | 'tv' | 'official' | 'un_org';

export interface NewsSource {
  id: string;
  name: string;
  nameAr: string;
  type: SourceType;
  logo: string;
  country: string;
  verified: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  fullContent?: string;
  source: NewsSource;
  category: string; // 'world' | 'middle_east' | 'europe' | 'americas' | 'asia' | 'economy' | 'tech' | 'crisis'
  urgency: UrgencyLevel;
  timestamp: string; // ISO string or relative time
  timeAgo: string;
  url?: string;
  imageUrl?: string;
  isVerified: boolean;
  officialStatementRef?: string;
  location?: {
    lat: number;
    lng: number;
    name: string;
  };
  viewsCount: number;
  tags: string[];
}

export interface TVChannel {
  id: string;
  name: string;
  nameAr: string;
  country: string;
  streamUrl: string;
  embedType: 'youtube' | 'custom';
  youtubeId?: string;
  logo: string;
  currentProgram: string;
  isLive: boolean;
}

export interface HotspotRegion {
  id: string;
  name: string;
  nameAr: string;
  lat: number;
  lng: number;
  activeItemsCount: number;
  urgency: UrgencyLevel;
  description: string;
}

export interface FactCheckResult {
  claim: string;
  source?: string;
  verdict: 'مؤكد رسمياً' | 'تحت التحقق والتدقيق' | 'مضلل / شائعة' | 'مقتطع من سياقه';
  confidence_score: string;
  official_cross_references: string[];
  detailed_explanation: string;
  timeline_context: string;
}

export interface AISynthesisResult {
  headline: string;
  summary: string;
  key_bullet_points: string[];
  impact_analysis: string;
  verified_sources: string[];
}
