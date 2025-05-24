import { DigimonAttack } from "./digimon-attack";
import { DigimonStage } from "./digimon-stage";
import { DigimonStats } from "./digimon-stat";

export enum DigimonSize {
  Tiny = 'Tiny',
  Small = 'Small', 
  Medium = 'Medium',
  Large = 'Large',
  Huge = 'Huge',
  Gigantic = 'Gigantic'
}

export enum DigimonAttribute {
  Vaccine = 'Vaccine',
  Data = 'Data',
  Virus = 'Virus',
  Free = 'Free'
}

export enum DigimonField {
  NatureSpirits = 'Nature Spirits',
  DeepSavers = 'Deep Savers',
  NightmareSoldiers = 'Nightmare Soldiers',
  WindGuardians = 'Wind Guardians',
  MetalEmpire = 'Metal Empire',
  VirusBusters = 'Virus Busters',
  DragonsRoar = 'Dragon\'s Roar',
  JungleTroopers = 'Jungle Troopers',
  Unknown = 'Unknown',
  DarkArea = 'Dark Area'
}

export interface DerivedDigimonStats {
  brains: number;
  body: number;
  agility: number;
  bitValue: number;
  cpuValue: number;
  ramValue: number;
  woundBoxTotal: number;
  movement: number;
  range: number;
  effectiveLimit: number;
}

export interface DigimonEvolutionLine {
  [DigimonStage.Fresh]?: DigimonCharacter;
  [DigimonStage.InTraining]?: DigimonCharacter;
  [DigimonStage.Rookie]?: DigimonCharacter;
  [DigimonStage.Champion]?: DigimonCharacter;
  [DigimonStage.Ultimate]?: DigimonCharacter;
  [DigimonStage.Mega]?: DigimonCharacter;
  [DigimonStage.Ultra]?: DigimonCharacter;
}

export interface DigimonCharacter {
  id: string;
  name: string;
  species: string;
  stage: DigimonStage;
  attribute: DigimonAttribute;
  field: DigimonField;
  size: DigimonSize;
  description?: string;
  profileImage?: string;
  
  // Stats
  stats: DigimonStats;
  derivedStats: DerivedDigimonStats;
  
  // Qualities and Attacks
  qualities: QualitySelection[];
  attacks: DigimonAttack[];
  
  // Point allocation
  remainingDP: number;
  spentStatsDP: number;
  spentQualitiesDP: number;
  
  // Evolution line reference
  evolutionLineId?: string;
  currentStageInLine?: DigimonStage;
}

export interface QualitySelection {
  qualityId: string;
  rank: number;
  appliedToAttack?: string; // For attack-specific qualities
}