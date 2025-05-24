export enum DigimonStage {
  Fresh = 'Fresh',
  InTraining = 'In-Training', 
  Rookie = 'Rookie',
  Champion = 'Champion',
  Ultimate = 'Ultimate',
  Mega = 'Mega',
  Ultra = 'Ultra'
}

export interface DigimonStageConfig {
  stage: DigimonStage;
  startingDP: number;
  baseMovement: number;
  woundBoxes: number;
  brains: number;
  attacks: number;
  specValues: number;
  stageBonus: number;
}