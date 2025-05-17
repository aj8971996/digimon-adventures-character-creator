export enum OrderType {
    Passive = 'Passive',
    OncePerDay = 'Once Per Day / Complex Action',
    IntercedeAction = 'Once Per Day / Intercede Action'
  }
  
  export interface SpecialOrder {
    id: string;
    name: string;
    attributeId: string;
    requirements: {
      standard: number;
      enhanced: number;
      extreme: number;
    };
    orderType: OrderType;
    description: string;
    selected: boolean;
  }