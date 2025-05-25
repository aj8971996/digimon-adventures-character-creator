export interface DigimonEvolutionLine {
  rookieId: string;
  rookieName: string;
  rookieSprite?: string;
  championOptions: {
    id: string;
    name: string;
    sprite?: string;
    isPrimary?: boolean;
  }[];
}