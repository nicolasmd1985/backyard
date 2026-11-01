import { Platform } from 'react-native';
import { OutdoorValidation, ScenarioResponse } from '../app/types';

const getBaseUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  // Android emulator uses 10.0.2.2 to access host machine
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3001';
  }
  // Web and iOS simulator use localhost
  return 'http://localhost:3001';
};

export interface GenerateScenarioPayload {
  location: string;
  scenario_type: string;
  photos: string[];
}

export const validatePhotoApi = async (photoBase64OrUrl: string): Promise<OutdoorValidation> => {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/scenarios/validate_photo`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ photo: photoBase64OrUrl }),
    });

    if (!response.ok) {
      return { is_outdoor: true, detected_type: 'Outdoor Space', confidence: 0.7 };
    }

    return await response.json();
  } catch (err) {
    console.warn('[API] validatePhotoApi failed, assuming outdoor:', err);
    return { is_outdoor: true, detected_type: 'Outdoor Space', confidence: 0.7 };
  }
};

export const generateScenarioApi = async (
  payload: GenerateScenarioPayload
): Promise<ScenarioResponse> => {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/scenarios/generate`;

  console.log(`[API] Calling ${url} with payload:`, {
    location: payload.location,
    scenario_type: payload.scenario_type,
    photosCount: payload.photos?.length || 0,
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`[API] Request failed with status ${response.status}:`, errorBody);
    throw new Error(`Server returned ${response.status}: ${errorBody || response.statusText}`);
  }

  const data: ScenarioResponse = await response.json();
  return data;
};
