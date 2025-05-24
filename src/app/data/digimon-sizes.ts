import { DigimonSize } from '../core/models/digimon-character';

export interface SizeConfig {
  size: DigimonSize;
  area: string;
  squareMeters: string;
  bodyModifier: number;
  agilityModifier: number;
  description: string;
}

export const DIGIMON_SIZE_CONFIGS: SizeConfig[] = [
  {
    size: DigimonSize.Tiny,
    area: '1x1',
    squareMeters: '1+',
    bodyModifier: -2,
    agilityModifier: 2,
    description: 'May occupy squares another Digimon or Tamer stands in'
  },
  {
    size: DigimonSize.Small,
    area: '1x1', 
    squareMeters: '1+',
    bodyModifier: -1,
    agilityModifier: 1,
    description: 'May move through squares other Digimon or Tamers stand in'
  },
  {
    size: DigimonSize.Medium,
    area: '1x1',
    squareMeters: '1+', 
    bodyModifier: 0,
    agilityModifier: 0,
    description: 'No bonuses or negatives'
  },
  {
    size: DigimonSize.Large,
    area: '2x2',
    squareMeters: '4+',
    bodyModifier: 1,
    agilityModifier: -1,
    description: 'Standard large creature'
  },
  {
    size: DigimonSize.Huge,
    area: '3x3',
    squareMeters: '9+',
    bodyModifier: 2,
    agilityModifier: -1,
    description: 'Very large creature'
  },
  {
    size: DigimonSize.Gigantic,
    area: '4+x4+',
    squareMeters: '16+',
    bodyModifier: 3,
    agilityModifier: -2,
    description: 'Massive creature'
  }
];