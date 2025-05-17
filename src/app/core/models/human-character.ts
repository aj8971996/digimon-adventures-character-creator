import { Aspect } from "./aspect";
import { Attribute } from "./attribute";
import { CampaignType } from "./campaign-type";
import { SpecialOrder } from "./special-order";
import { Torment } from "./torment";

export interface HumanCharacter {
    id: string;
    name: string;
    age: number;
    description?: string; // Added field
    backstory?: string; // Added field
    campaignType: CampaignType;
    profileImage?: string; // Base64 encoded image
    attributes: Attribute[];
    specialOrders: SpecialOrder[];
    aspects: Aspect[];
    torments: Torment[];
    derivedStats: DerivedStats;
    remainingAttributeCP: number;
    remainingSkillCP: number;
    remainingTormentCP: number;
  }
  
  export interface DerivedStats {
    woundBox: number;
    speed: number;
    accuracyPool: number;
    dodgePool: number;
    armor: number;
    damage: number;
  }