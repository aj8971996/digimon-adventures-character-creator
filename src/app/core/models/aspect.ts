export enum AspectType {
    Major = 'Major',
    Minor = 'Minor'
  }
  
  export interface AspectEffect {
    attributeId?: string;
    skillId?: string;
    isPositive: boolean;
    description: string;
  }
  
  export interface Aspect {
    id: string;
    type: AspectType;
    name: string;
    description: string;
    triggers: string;
    effects: AspectEffect[];
  }