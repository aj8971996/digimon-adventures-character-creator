import { CampaignType, CampaignTypeConfig } from "../core/models/campaign-type";

export const CAMPAIGN_TYPES: CampaignTypeConfig[] = [
  {
    type: CampaignType.Standard,
    ageRange: { min: 8, max: 13 },
    startingCP: 30,
    startingCPLimit: 3,
    finalCPLimit: 5,
    recommendedSplits: { attributes: 12, skills: 18 }
  },
  {
    type: CampaignType.Enhanced,
    ageRange: { min: 12, max: 20 },
    startingCP: 40,
    startingCPLimit: 5,
    finalCPLimit: 7,
    recommendedSplits: { attributes: 18, skills: 22 }
  },
  {
    type: CampaignType.Extreme,
    ageRange: { min: 16, max: undefined },
    startingCP: 50,
    startingCPLimit: 7,
    finalCPLimit: 10,
    recommendedSplits: { attributes: 22, skills: 28 }
  }
];