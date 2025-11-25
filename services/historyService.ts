
import { AuditReport, HistoryItem } from '../types';

const STORAGE_KEY = 'shopaudit_history_db';

export const getHistory = (): HistoryItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load history", e);
    return [];
  }
};

export const saveHistory = (report: AuditReport, clientIp?: string) => {
  try {
    const history = getHistory();
    
    // Remove duplicates for the same URL to keep the list fresh (move to top)
    const filtered = history.filter(item => item.url !== report.url);
    
    const newItem: HistoryItem = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      url: report.url,
      timestamp: new Date().toISOString(),
      score: report.overallScore,
      platform: report.platform,
      clientIp: clientIp || 'unknown'
    };
    
    // Add to top, keep max 50 items
    const newHistory = [newItem, ...filtered].slice(0, 50);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  } catch (e) {
    console.error("Failed to save history", e);
  }
};

export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const deleteHistoryItem = (id: string) => {
  const history = getHistory();
  const newHistory = history.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
};