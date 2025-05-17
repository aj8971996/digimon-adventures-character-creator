import { Skill } from "./skill";

export interface Attribute {
    id: string;
    name: string;
    value: number;
    description: string;
    skills: Skill[];
  }