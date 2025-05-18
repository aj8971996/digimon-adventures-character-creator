export enum OrderType {
    Passive = 'Passive',
    OncePerDayComplexAction = 'Once Per Day / Complex Action',
    OncerPerDaySimpleAction = 'Once Per Day / Simple Action',
    OncePerBattleComplexAction = 'Once Per Battle / Complex Action',
    OncePerBattleSimpleAction = 'Once Per Battle / Simple Action',
    OncePerDayIntercede = 'Once Per Day / Intercede Action',
    FreeAction = 'Free Action'
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