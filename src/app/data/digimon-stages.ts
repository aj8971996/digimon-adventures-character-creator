import { DigimonStage, DigimonStageConfig } from '../core/models/digimon-stage';

export const DIGIMON_STAGE_CONFIGS: DigimonStageConfig[] = [
  {
    stage: DigimonStage.Fresh,
    startingDP: 5,
    baseMovement: 2,
    woundBoxes: 0,
    brains: 0,
    attacks: 1,
    specValues: 0,
    stageBonus: 0
  },
  {
    stage: DigimonStage.InTraining,
    startingDP: 15,
    baseMovement: 4,
    woundBoxes: 1,
    brains: 1,
    attacks: 2,
    specValues: 0,
    stageBonus: 0
  },
  {
    stage: DigimonStage.Rookie,
    startingDP: 25,
    baseMovement: 6,
    woundBoxes: 2,
    brains: 3,
    attacks: 2,
    specValues: 1,
    stageBonus: 1
  },
  {
    stage: DigimonStage.Champion,
    startingDP: 40,
    baseMovement: 8,
    woundBoxes: 5,
    brains: 5,
    attacks: 3,
    specValues: 2,
    stageBonus: 2
  },
  {
    stage: DigimonStage.Ultimate,
    startingDP: 55,
    baseMovement: 10,
    woundBoxes: 7,
    brains: 7,
    attacks: 4,
    specValues: 3,
    stageBonus: 3
  },
  {
    stage: DigimonStage.Mega,
    startingDP: 70,
    baseMovement: 12,
    woundBoxes: 10,
    brains: 10,
    attacks: 5,
    specValues: 4,
    stageBonus: 4
  },
  {
    stage: DigimonStage.Ultra,
    startingDP: 85,
    baseMovement: 14,
    woundBoxes: 14,
    brains: 13,
    attacks: 5,
    specValues: 5,
    stageBonus: 5
  }
];