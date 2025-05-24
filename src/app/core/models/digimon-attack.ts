export enum AttackTag {
  Melee = 'Melee',
  Ranged = 'Ranged',
  Damage = 'Damage',
  Support = 'Support',
  Area = 'Area',
  Charge = 'Charge',
  Weapon = 'Weapon',
  SignatureMove = 'Signature Move'
}

export interface DigimonAttack {
  id: string;
  name: string;
  description: string;
  tags: AttackTag[];
  effects?: string[]; // Effect IDs
}