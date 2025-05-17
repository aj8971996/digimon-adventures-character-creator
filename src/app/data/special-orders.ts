import { OrderType, SpecialOrder } from "../core/models/special-order";

export const SPECIAL_ORDERS: SpecialOrder[] = [
  {
    id: 'strikeFirst',
    name: 'Strike First!',
    attributeId: 'agility',
    requirements: {
      standard: 3,
      enhanced: 5,
      extreme: 6
    },
    orderType: OrderType.Passive,
    description: 'The Digimon Gains +1 Initiative and 2 Base Movement.',
    selected: false
  },
  {
    id: 'strikeFast',
    name: 'Strike Fast!',
    attributeId: 'agility',
    requirements: {
      standard: 4,
      enhanced: 6,
      extreme: 8
    },
    orderType: OrderType.OncePerDay,
    description: 'As long as the Digimon moves this turn, the tamer may declare this order for the Digimon\'s Attack; When doing so, the Target Digimon\'s Dodge Pools are considered halved for that attack only. (You cannot trigger Huge Power or Overkill on this Order.)',
    selected: false
  },
  {
    id: 'strikeLast',
    name: 'Strike Last!',
    attributeId: 'agility',
    requirements: {
      standard: 5,
      enhanced: 7,
      extreme: 10
    },
    orderType: OrderType.IntercedeAction,
    description: 'When under attack, regardless of a successful dodge or not, the Digimon will counter with the effect [Counter Blow] with Tamer declaration. They must still roll for accuracy and land the attack. You cannot trigger Huge Power or Overkill on this Order. (Additionally, this is treated as if the Tamer took an [Intercede] Action, meaning their action pool will be lowered by one for the next round if this Special Order is declared.)',
    selected: false
  }
  // Will need to add more
];