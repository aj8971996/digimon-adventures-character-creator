import { Quality, QualityCategory, QualityType } from '../core/models/digimon-quality';
import { DigimonStage } from '../core/models/digimon-stage';

export const DIGIMON_QUALITIES: Quality[] = [
  // Data Optimization Qualities
  {
    id: 'closeCombat',
    name: 'Close Combat',
    category: QualityCategory.DataOptimization,
    type: QualityType.Static,
    cost: 1,
    description: 'The Digimon gains a +2 bonus to its Accuracy Pool when using a [Melee] tagged Attack, but takes a -1 penalty to its Accuracy Pool when using a [Ranged] tagged Attack.',
    mutuallyExclusive: ['rangedStriker', 'guardian', 'brawler', 'speedStriker', 'effectWarrior']
  },
  {
    id: 'rangedStriker',
    name: 'Ranged Striker',
    category: QualityCategory.DataOptimization,
    type: QualityType.Static,
    cost: 1,
    description: 'The Digimon gains a +2 bonus to its Accuracy when using a [Ranged] tagged Attack, but takes a -1 penalty to its Dodge pool when targeted by a [Melee] tagged Attack.',
    mutuallyExclusive: ['closeCombat', 'guardian', 'brawler', 'speedStriker', 'effectWarrior']
  },
  {
    id: 'guardian',
    name: 'Guardian',
    category: QualityCategory.DataOptimization,
    type: QualityType.Static,
    cost: 1,
    description: 'The Digimon gains a +2 Armor bonus, but takes a -1 penalty to its Base Movement score.',
    mutuallyExclusive: ['closeCombat', 'rangedStriker', 'brawler', 'speedStriker', 'effectWarrior']
  },
  {
    id: 'brawler',
    name: 'Brawler',
    category: QualityCategory.DataOptimization,
    type: QualityType.Static,
    cost: 2,
    description: 'The Digimon gains a +2 bonus to all checks it makes when Clashing. In addition, it is treated as if it were one Size Class larger when Clashing.',
    mutuallyExclusive: ['closeCombat', 'rangedStriker', 'guardian', 'speedStriker', 'effectWarrior']
  },
  {
    id: 'speedStriker',
    name: 'Speed Striker',
    category: QualityCategory.DataOptimization,
    type: QualityType.Static,
    cost: 1,
    description: 'The Digimon gains a +2 bonus to its Base Movement score.',
    mutuallyExclusive: ['closeCombat', 'rangedStriker', 'guardian', 'brawler', 'effectWarrior']
  },
  {
    id: 'effectWarrior',
    name: 'Effect Warrior',
    category: QualityCategory.DataOptimization,
    type: QualityType.Static,
    cost: 2,
    description: 'The Digimon gains a +1 bonus to its base Spec Values, but takes a -2 Armor penalty.',
    mutuallyExclusive: ['closeCombat', 'rangedStriker', 'guardian', 'brawler', 'speedStriker']
  },

  // Movement Qualities
  {
    id: 'extraMovementDigger',
    name: 'Extra Movement: Digger',
    category: QualityCategory.Movement,
    type: QualityType.Static,
    cost: 1,
    description: 'The Digimon is capable of burrowing through the ground at a speed equal to its movement, so long as it\'s as soft as dirt.'
  },
  {
    id: 'extraMovementSwimmer',
    name: 'Extra Movement: Swimmer', 
    category: QualityCategory.Movement,
    type: QualityType.Static,
    cost: 1,
    description: 'The Digimon is capable of moving through the water at a much faster speed than normal, at a rate equal to its Movement.'
  },
  {
    id: 'extraMovementFlight',
    name: 'Extra Movement: Flight',
    category: QualityCategory.Movement,
    type: QualityType.Static,
    cost: 2,
    description: 'The Digimon is capable of flying through the air.'
  },
  {
    id: 'extraMovementWallclimber',
    name: 'Extra Movement: Wallclimber',
    category: QualityCategory.Movement,
    type: QualityType.Static,
    cost: 1,
    description: 'The Digimon is capable of scaling vertical surfaces, but not on ceilings.'
  },
  {
    id: 'extraMovementJumper',
    name: 'Extra Movement: Jumper',
    category: QualityCategory.Movement,
    type: QualityType.Static,
    cost: 1,
    description: 'The Digimon is capable of jumping at a height and length equal to its Movement.'
  },
  {
    id: 'speedy',
    name: 'Speedy',
    category: QualityCategory.Movement,
    type: QualityType.Static,
    cost: 1,
    maxRanks: 10,
    description: 'For each Rank you take in Speedy, the Digimon adds 2 to its Movement score. You may not more than double the Digimon\'s Base Movement in this manner.'
  },

  // Offensive Qualities
  {
    id: 'armorPiercing',
    name: 'Armor Piercing',
    category: QualityCategory.Offensive,
    type: QualityType.Attack,
    cost: 1,
    maxRanks: 3,
    limitedByStage: true,
    description: 'Choose one Attack. That Attack ignores up to X points that any defending Digimon has in Armor, where X is double the Ranks you have of Armor Piercing.',
    mutuallyExclusive: ['certainStrike']
  },
  {
    id: 'chargeAttack',
    name: 'Charge Attack',
    category: QualityCategory.Offensive,
    type: QualityType.Attack,
    cost: 1,
    description: 'Choose a [Melee] Attack. By applying the [Charge] Tag to that Attack, the Digimon may use the Attack and move as one Simple Action.'
  },
  {
    id: 'mightyBlow',
    name: 'Mighty Blow',
    category: QualityCategory.Offensive,
    type: QualityType.Attack,
    cost: 2,
    description: 'The Digimon gains an attack tag called [Mighty Blow]. If the Digimon deals damage after armor that is equivalent to the target Digimon\'s Stage Bonus or more, the primary target is inflicted with a single round of [Stun].',
    prerequisites: [{ stageRequirement: DigimonStage.Champion }]
  },
  {
    id: 'certainStrike',
    name: 'Certain Strike',
    category: QualityCategory.Offensive,
    type: QualityType.Attack,
    cost: 2,
    maxRanks: 2,
    limitedByStage: true,
    description: 'Choose a single attack. For every 4 dice in your base accuracy pool, you gain one automatic success. Each rank limits maximum auto-successes to two.',
    mutuallyExclusive: ['armorPiercing']
  },
  {
    id: 'weapon',
    name: 'Weapon',
    category: QualityCategory.Offensive,
    type: QualityType.Attack,
    cost: 1,
    maxRanks: 3,
    limitedByStage: true,
    description: 'Your Digimon has a Weapon or fighting style. Attacks with [Weapon] Tag gain a bonus to Accuracy and Damage equal to the Ranks in this Quality.',
    mutuallyExclusive: ['instinct']
  },
  {
    id: 'hugePower',
    name: 'Huge Power',
    category: QualityCategory.Offensive,
    type: QualityType.Trigger,
    cost: 2,
    maxRanks: 2,
    description: 'Rank 1: The Digimon may reroll any 1\'s that appear when making an accuracy roll. Rank 2: Once per round, Digimon may reroll any 2\'s that appear when making an accuracy roll.'
  },

  // Defensive Qualities  
  {
    id: 'absoluteEvasion',
    name: 'Absolute Evasion',
    category: QualityCategory.Defensive,
    type: QualityType.Static,
    cost: 3,
    maxRanks: 2,
    limitedByStage: true,
    description: 'For every 4 dice in your base dodge pool, you gain one automatic success towards dodge rolls. Auto-successes diminish by 1 for each additional attack in a round.',
    prerequisites: [{ stageRequirement: DigimonStage.Ultimate }]
  },
  {
    id: 'agility',
    name: 'Agility',
    category: QualityCategory.Defensive,
    type: QualityType.Trigger,
    cost: 2,
    maxRanks: 2,
    description: 'Rank 1: Once per round, the Digimon may reroll any 1\'s that appear when making a dodge roll. Rank 2: Once per round, the Digimon may reroll any 2\'s that appear when making a dodge roll.'
  },
  {
    id: 'combatAwareness',
    name: 'Combat Awareness',
    category: QualityCategory.Defensive,
    type: QualityType.Static,
    cost: 1,
    maxRanks: 3,
    description: 'Rank 1: Add ranks to Initiative in first round. Rank 2: Add ranks to Dodge for first round. Rank 3: Add ranks to Accuracy for first round and treat Surprise Rounds as normal rounds.'
  },

  // Support/Utility Qualities
  {
    id: 'instinct',
    name: 'Instinct',
    category: QualityCategory.Boosting,
    type: QualityType.Static,
    cost: 1,
    maxRanks: 3,
    limitedByStage: true,
    description: 'Your Digimon possesses a driving force. For every rank of Instinct, the Digimon gains an equivalent bonus to its Dodge, Health, and Base Movement.',
    mutuallyExclusive: ['weapon']
  },
  {
    id: 'improvedDerivedStat',
    name: 'Improved Derived Stat',
    category: QualityCategory.Boosting,
    type: QualityType.Static,
    cost: 1,
    maxRanks: 10,
    description: 'Choose one of your Derived Stats (Body, Agility, or Brains) and increase it by 1. The stat now counts as "trained".'
  },
  {
    id: 'systemBoost',
    name: 'System Boost',
    category: QualityCategory.Boosting,
    type: QualityType.Static,
    cost: 3,
    maxRanks: 9,
    description: 'Increase one of the Digimon\'s Spec Values by 1. You may not more than double the Digimon\'s Base Spec Values. You may not choose a specific stat more than 3 times.'
  }
];

// Attack Effects
export const ATTACK_EFFECTS: Quality[] = [
  // 1 DP Effects
  {
    id: 'effectImmobilize',
    name: 'Immobilize',
    category: QualityCategory.AttackEffects,
    type: QualityType.Attack,
    cost: 1,
    description: 'Target cannot move for the duration.'
  },
  {
    id: 'effectTaunt',
    name: 'Taunt',
    category: QualityCategory.AttackEffects,
    type: QualityType.Attack,
    cost: 1,
    description: 'Target must attack the taunting Digimon if possible.'
  },
  {
    id: 'effectFear',
    name: 'Fear',
    category: QualityCategory.AttackEffects,
    type: QualityType.Attack,
    cost: 1,
    description: 'Target suffers accuracy penalties due to fear.'
  },
  {
    id: 'effectKnockback',
    name: 'Knockback',
    category: QualityCategory.AttackEffects,
    type: QualityType.Attack,
    cost: 1,
    description: 'Push target away from the attacker.'
  },
  {
    id: 'effectPull',
    name: 'Pull',
    category: QualityCategory.AttackEffects,
    type: QualityType.Attack,
    cost: 1,
    description: 'Pull target toward the attacker.'
  },

  // 2 DP Effects
  {
    id: 'effectPoison',
    name: 'Poison',
    category: QualityCategory.AttackEffects,
    type: QualityType.Attack,
    cost: 2,
    description: 'Target takes damage over time.'
  },
  {
    id: 'effectStun',
    name: 'Stun',
    category: QualityCategory.AttackEffects,
    type: QualityType.Attack,
    cost: 2,
    description: 'Target loses their next action.'
  },
  {
    id: 'effectVigor',
    name: 'Vigor',
    category: QualityCategory.AttackEffects,
    type: QualityType.Attack,
    cost: 2,
    description: 'Target gains temporary bonuses to stats.'
  },
  {
    id: 'effectCleanse',
    name: 'Cleanse',
    category: QualityCategory.AttackEffects,
    type: QualityType.Attack,
    cost: 2,
    description: 'Remove negative effects from target.'
  },
  {
    id: 'effectStrengthen',
    name: 'Strengthen',
    category: QualityCategory.AttackEffects,
    type: QualityType.Attack,
    cost: 2,
    description: 'Increase target\'s damage output.'
  },
  {
    id: 'effectWeaken',
    name: 'Weaken',
    category: QualityCategory.AttackEffects,
    type: QualityType.Attack,
    cost: 2,
    description: 'Decrease target\'s damage output.'
  },

  // 3 DP Effects
  {
    id: 'effectBlind',
    name: 'Blind',
    category: QualityCategory.AttackEffects,
    type: QualityType.Attack,
    cost: 3,
    description: 'Target cannot see, suffering severe accuracy penalties.'
  },
  {
    id: 'effectParalysis',
    name: 'Paralysis',
    category: QualityCategory.AttackEffects,
    type: QualityType.Attack,
    cost: 3,
    description: 'Target cannot take actions for the duration.'
  },
  {
    id: 'effectShield',
    name: 'Shield',
    category: QualityCategory.AttackEffects,
    type: QualityType.Attack,
    cost: 3,
    description: 'Target gains temporary wound boxes.'
  },
  {
    id: 'effectRegenerate',
    name: 'Regenerate',
    category: QualityCategory.AttackEffects,
    type: QualityType.Attack,
    cost: 3,
    description: 'Target recovers wound boxes over time.'
  }
];