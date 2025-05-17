import { Attribute } from "../core/models/attribute";

export const ATTRIBUTES: Attribute[] = [
  {
    id: 'agility',
    name: 'Agility',
    value: 0,
    description: 'Represents physical dexterity, coordination, and reflexes',
    skills: [
      { id: 'dodge', name: 'Dodge', value: 0, description: 'Ability to avoid attacks and dangers', attributeId: 'agility' },
      { id: 'fight', name: 'Fight', value: 0, description: 'Combat prowess in physical confrontations', attributeId: 'agility' },
      { id: 'stealth', name: 'Stealth', value: 0, description: 'Ability to move silently and remain hidden', attributeId: 'agility' }
    ]
  },
  {
    id: 'body',
    name: 'Body',
    value: 0,
    description: 'Represents physical strength, health, and endurance',
    skills: [
      { id: 'athletics', name: 'Athletics', value: 0, description: 'Physical prowess in sports and movement', attributeId: 'body' },
      { id: 'endurance', name: 'Endurance', value: 0, description: 'Ability to withstand physical stress and injury', attributeId: 'body' },
      { id: 'featsOfStrength', name: 'Feats of Strength', value: 0, description: 'Raw physical power', attributeId: 'body' }
    ]
  },
  {
    id: 'charisma',
    name: 'Charisma',
    value: 0,
    description: 'Represents social aptitude, charm, and influence',
    skills: [
      { id: 'manipulate', name: 'Manipulate', value: 0, description: 'Ability to influence others for personal gain', attributeId: 'charisma' },
      { id: 'perform', name: 'Perform', value: 0, description: 'Skill in entertaining or impressing others', attributeId: 'charisma' },
      { id: 'persuasion', name: 'Persuasion', value: 0, description: 'Ability to convince others through reasoning', attributeId: 'charisma' }
    ]
  },
  {
    id: 'intelligence',
    name: 'Intelligence',
    value: 0,
    description: 'Represents mental acuity, knowledge, and reasoning',
    skills: [
      { id: 'computer', name: 'Computer', value: 0, description: 'Technical knowledge of electronic systems', attributeId: 'intelligence' },
      { id: 'survival', name: 'Survival', value: 0, description: 'Ability to thrive in difficult environments', attributeId: 'intelligence' },
      { id: 'knowledge', name: 'Knowledge', value: 0, description: 'General understanding of facts and information', attributeId: 'intelligence' }
    ]
  },
  {
    id: 'willpower',
    name: 'Willpower',
    value: 0,
    description: 'Represents mental fortitude, perception, and determination',
    skills: [
      { id: 'perception', name: 'Perception', value: 0, description: 'Awareness of surroundings and details', attributeId: 'willpower' },
      { id: 'decipherIntent', name: 'Decipher Intent', value: 0, description: 'Ability to understand others\' motives', attributeId: 'willpower' },
      { id: 'bravery', name: 'Bravery', value: 0, description: 'Courage in the face of danger or fear', attributeId: 'willpower' }
    ]
  }
];