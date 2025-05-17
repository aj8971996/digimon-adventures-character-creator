export enum CampaignType {
    Standard = 'Standard',
    Enhanced = 'Enhanced',
    Extreme = 'Extreme'
  }
  
  export interface CampaignTypeConfig {
    type: CampaignType;
    ageRange: { min: number; max?: number };
    startingCP: number;
    startingCPLimit: number;
    finalCPLimit: number;
    recommendedSplits: { attributes: number; skills: number };
  }