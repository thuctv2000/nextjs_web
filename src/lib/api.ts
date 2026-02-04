const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface LixiEnvelope {
  id: number;
  amount: string;
  message: string;
}

export interface LixiConfig {
  id: string;
  name: string;
  envelopes: LixiEnvelope[];
  is_active: boolean;
  created_at: string;
}

export async function getActiveLixiConfig(): Promise<LixiConfig> {
  const res = await fetch(`${API_URL}/api/lixi/active`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch active lixi config');
  }
  return res.json();
}
