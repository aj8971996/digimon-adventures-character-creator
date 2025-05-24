import { DigimonStage } from "./digimon-stage";
import { DigimonStats } from "./digimon-stat";

export enum QualityType {
  Static = 'Static',
  Trigger = 'Trigger', 
  Attack = 'Attack'
}

export enum QualityCategory {
  DataOptimization = 'Data Optimization',
  Movement = 'Movement',
  Offensive = 'Offensive',
  Defensive = 'Defensive',
  Boosting = 'Boosting',
  Utility = 'Utility',
  Support = 'Support',
  AttackEffects = 'Attack Effects',
  Advanced = 'Advanced',
  Digizoid = 'Digizoid',
  GainForce = 'Gain Force',
  Free = 'Free',
  Negative = 'Negative'
}

export interface QualityPrerequisite {
  qualityId?: string;
  stageRequirement?: DigimonStage;
  statRequirement?: {
    stat: keyof DigimonStats;
    minimum: number;
  };
}

export interface Quality {
  id: string;
  name: string;
  category: QualityCategory;
  type: QualityType;
  cost: number;
  maxRanks?: number;
  description: string;
  prerequisites?: QualityPrerequisite[];
  limitedByStage?: boolean;
  mutuallyExclusive?: string[]; // IDs of qualities that can't be taken together
}
