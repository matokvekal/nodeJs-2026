import { Quiz } from './quiz.types';

export interface Slide {
   id: number;
   type?: 'title' | 'content' | 'code' | 'quiz' | 'section';
   title?: string;
   subtitle?: string;
   bullets?: string[];
   code?: string;
   language?: string;
   note?: string;
   notes?: string;
   quiz?: Quiz;
   questions?: Quiz;
   lessonTitle?: string;
   animation?: string;
   image?: string;
   comparison?: {
      headers: string[];
      rows: string[][];
   };
   exercises?: Array<{
      title: string;
      description: string;
      difficulty: string;
   }>;
}


