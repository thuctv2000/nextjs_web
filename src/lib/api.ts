const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface LixiEnvelope {
  id: number;
  amount: string;
  message: string;
  rate: number;
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

export async function submitLixiGreeting(data: { name: string; amount: string; message: string; image: string }): Promise<void> {
  const res = await fetch(`${API_URL}/api/lixi/greeting`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to submit lixi greeting');
  }
}
