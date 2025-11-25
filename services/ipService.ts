
const IP_STORAGE_KEY = 'shopaudit_ip_limit';
const MAX_DAILY_LIMIT = 3;

interface IpUsageData {
  ip: string;
  count: number;
  lastDate: string; // YYYY-MM-DD
}

export const getClientIp = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.warn("Failed to fetch IP, falling back to unknown", error);
    return 'unknown';
  }
};

export const checkIpLimit = (ip: string): boolean => {
  if (ip === 'unknown') return true; // Bypass limit if IP cannot be determined

  try {
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem(IP_STORAGE_KEY);
    
    if (!stored) return true;

    const data: IpUsageData = JSON.parse(stored);

    // If it's a different IP (e.g. user changed network) or new day, reset logic implies they might be allowed
    // But we want to limit *this* device acting as this IP.
    // If the stored IP matches current IP:
    if (data.ip === ip) {
      // If date is different, it's a new day, reset allowed
      if (data.lastDate !== today) {
        return true;
      }
      // Same day, check count
      return data.count < MAX_DAILY_LIMIT;
    }
    
    // If stored IP is different from current IP (rare in single browser context unless network switch),
    // we technically treat it as a new session for this storage.
    return true;

  } catch (e) {
    return true; // Fail open if storage error
  }
};

export const incrementIpUsage = (ip: string) => {
  if (ip === 'unknown') return;

  const today = new Date().toISOString().split('T')[0];
  let newData: IpUsageData = {
    ip,
    count: 1,
    lastDate: today
  };

  try {
    const stored = localStorage.getItem(IP_STORAGE_KEY);
    if (stored) {
      const data: IpUsageData = JSON.parse(stored);
      
      if (data.ip === ip && data.lastDate === today) {
        newData.count = data.count + 1;
      }
      // If ip changed or date changed, newData is already set to count: 1
    }
    localStorage.setItem(IP_STORAGE_KEY, JSON.stringify(newData));
  } catch (e) {
    console.error("Failed to save IP usage", e);
  }
};

export const resetIpUsage = () => {
  localStorage.removeItem(IP_STORAGE_KEY);
};
