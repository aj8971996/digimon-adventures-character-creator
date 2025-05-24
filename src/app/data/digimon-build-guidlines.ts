import { DigimonStage } from "../core/models/digimon-stage";

export interface BuildGuideline {
  stage: DigimonStage;
  statHeavy: {
    stats: number;
    qualities: number;
  };
  qualityHeavy: {
    stats: number;
    qualities: number;
  };
}

export const DIGIMON_BUILD_GUIDELINES: BuildGuideline[] = [
  {
    stage: DigimonStage.InTraining,
    statHeavy: { stats: 10, qualities: 5 },
    qualityHeavy: { stats: 5, qualities: 10 }
  },
  {
    stage: DigimonStage.Rookie,
    statHeavy: { stats: 20, qualities: 5 },
    qualityHeavy: { stats: 15, qualities: 10 }
  },
  {
    stage: DigimonStage.Champion,
    statHeavy: { stats: 30, qualities: 10 },
    qualityHeavy: { stats: 25, qualities: 15 }
  },
  {
    stage: DigimonStage.Ultimate,
    statHeavy: { stats: 40, qualities: 15 },
    qualityHeavy: { stats: 35, qualities: 20 }
  },
  {
    stage: DigimonStage.Mega,
    statHeavy: { stats: 50, qualities: 20 },
    qualityHeavy: { stats: 45, qualities: 25 }
  }
];
