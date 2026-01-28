import { ReactNode } from 'react';

export interface ExpertiseItem {
    id: number;
    icon: ReactNode;
    title: string;
    description: string;
    skills: string[];
    color: string;
}
