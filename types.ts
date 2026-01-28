
export interface ExpertiseItem {
  id: number;
  title: string;
  icon: string;
  description: string;
  skills: string[];
  color: string;
}

export interface CardPosition {
  x: number;
  y: number;
  rotate: number;
}
