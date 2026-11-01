export type ScenarioType = 'foodGarden' | 'ecoFriendly' | 'mixed';

export interface OutdoorValidation {
  is_outdoor: boolean;
  detected_type: string;
  confidence?: number;
  feedback?: string;
}

export interface PlantRecommendation {
  name: string;
  scientific_name: string;
  description: string;
  sun_requirement?: string;
  water_requirement?: string;
  category?: string;
  image_url?: string;
}

export interface ScenarioResponse {
  scenario: string;
  location: string;
  description: string;
  design_image?: string;
  original_image?: string;
  outdoor_validation?: OutdoorValidation;
  plants?: PlantRecommendation[];
  error?: string;
}

export type RootStackParamList = {
  index: undefined;
  preferences: undefined;
  uploads: undefined;
  results: undefined;
};