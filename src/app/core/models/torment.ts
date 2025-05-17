export enum TormentType {
    Minor = 'Minor',
    Major = 'Major',
    Terrible = 'Terrible'
  }
  
  export interface Torment {
    id: string;
    type: TormentType;
    name: string;
    description: string;
    totalBoxes: number;
    progress: number;
    maxInitialProgress: number;
  }