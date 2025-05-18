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
    orderType: OrderType.OncePerDayComplexAction,
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
    orderType: OrderType.OncePerDayIntercede,
    description: 'When under attack, regardless of a successful dodge or not, the Digimon will counter with the effect [Counter Blow] with Tamer declaration. They must still roll for accuracy and land the attack. You cannot trigger Huge Power or Overkill on this Order. (Additionally, this is treated as if the Tamer took an [Intercede] Action, meaning their action pool will be lowered by one for the next round if this Special Order is declared.)',
    selected: false
  },
  {
    id: 'energyBurst',
    name: 'Energy Burst',
    attributeId: 'body',
    requirements : {
      standard: 3,
      enhanced: 5,
      extreme: 6
    },
    orderType: OrderType.OncePerDayComplexAction,
    description: 'Your Digimon recovers 5 wound boxes. This amount is static.',
    selected: false
  },
  {
    id: 'enduringSoul',
    name: 'Enduring Soul',
    attributeId: 'body',
    requirements : {
      standard: 4,
      enhanced: 6,
      extreme: 8
    },
    orderType: OrderType.Passive,
    description: 'The Digimon can withstand a life-threatening blow with one Wound Box, but only once in a battle.',
    selected: false
  },
  {
    id: 'finishingTouch',
    name: 'Finishing Touch',
    attributeId: 'body',
    requirements : {
      standard: 5,
      enhanced: 7,
      extreme: 10
    },
    orderType: OrderType.OncerPerDaySimpleAction,
    description: 'Once per day, you may declare a "Finishing Touch" before your Digimon makes an attack. Any 4s that were rolled now act as successes towards your Digimon’s Accuracy Roll. You cannot trigger Huge Power or Overkill on this Order.',
    selected: false
  },
  {
    id: 'swagger',
    name: 'Swagger',
    attributeId: 'charisma',
    requirements : {
      standard: 3,
      enhanced: 5,
      extreme: 6
    },
    orderType: OrderType.OncePerBattleSimpleAction,
    description: '[Taunt] is now in effect for three rounds. Taunt is applied to one target, and your Digimon automatically receives aggro based on their CPUx2, as per normal [Taunt] rules. This order cannot be Bolstered.',
    selected: false
  },
  {
    id: 'peakPerformance',
    name: 'Peak Performance',
    attributeId: 'charisma',
    requirements : {
      standard: 4,
      enhanced: 6,
      extreme: 8
    },
    orderType: OrderType.OncePerDayComplexAction,
    description: 'The Digimon gains the [Bastion] buff from their Tamer. +2 to all stats except health. Lasts one round. [Bastion] cannot be granted to other friendly or ally Digimon.',
    selected: false
  },
  {
    id: 'guidingLight',
    name: 'Guiding Light',
    attributeId: 'charisma',
    requirements : {
      standard: 5,
      enhanced: 7,
      extreme: 10
    },
    orderType: OrderType.Passive,
    description: 'Your Digimon gives +2 Accuracy to all ally Digimon within its burst radius. Similarly, for every ally Digimon within their burst radius, your Digimon gains +1 Dodge. Minions are not counted towards this Passive.',
    selected: false
  },
  {
    id: 'quickReaction',
    name: 'Quick Reaction',
    attributeId: 'intelligence',
    requirements : {
      standard: 3,
      enhanced: 5,
      extreme: 6
    },
    orderType: OrderType.OncePerDayIntercede,
    description: 'When your Digimon is attacked by an enemy Digimon, for the round you declare a Quick Reaction, your Digimon gains their Stage Bonus+2 in Dodge Dice for the remainder of the round. These dice diminish as opposed to normal Dodge Directs, which only apply once. (Additionally, this is treated as if the Tamer took an [Intercede] Action, meaning their action pool will be lowered by one for the next round if this Special Order is declared.)',
    selected: false
  },
  {
    id: 'enemyScan',
    name: 'Enemey Scan',
    attributeId: 'intelligence',
    requirements : {
      standard: 4,
      enhanced: 6,
      extreme: 8
    },
    orderType: OrderType.OncePerBattleComplexAction,
    description: 'The Tamer inflicts the [Debilitate] debuff to one enemy Digimon. -2 to all stats except health. Lasts one round. If multiple [Debilitate] debuffs are called, they do not stack.',
    selected: false
  },
  {
    id: 'decimation',
    name: 'Decimation',
    attributeId: 'intelligence',
    requirements : {
      standard: 5,
      enhanced: 7,
      extreme: 10
    },
    orderType: OrderType.OncePerDayComplexAction,
    description: 'The tamer can direct the Digimon to use an attack labeled [Signature Move] on the Second Round of Combat instead of it being ready to use on the Third Round of Combat.',
    selected: false
  },
  {
    id: 'toughItOut',
    name: 'Tough It Out!',
    attributeId: 'willpower',
    requirements : {
      standard: 3,
      enhanced: 5,
      extreme: 6
    },
    orderType: OrderType.OncePerDayComplexAction,
    description: 'Out of sheer willpower, the Digimon is cured from a negative effect that was plaguing them. [Purify]',
    selected: false
  },
  {
    id: 'challenger',
    name: 'Challenger',
    attributeId: 'willpower',
    requirements : {
      standard: 4,
      enhanced: 6,
      extreme: 8
    },
    orderType: OrderType.Passive,
    description: 'At the beginning of the battle, after determining the number of stages the main enemy is higher than your Digimon’s base stage, gain two plus an additional temporary Wound Boxes for each. [Max: 5]',
    selected: false
  },
  {
    id: 'fatefulIntervention',
    name: 'Fateful Intervention',
    attributeId: 'willpower',
    requirements : {
      standard: 5,
      enhanced: 7,
      extreme: 10
    },
    orderType: OrderType.FreeAction,
    description: 'Spend all max Inspiration (5/7/10 based on campaign). Add/subtract +5 and your Willpower to any check, Dodge, or Accuracy pool. Additionally, you may set the exact value of each die rolled (choose any results from 1-6).',
    selected: false
  }

];