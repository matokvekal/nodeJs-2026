export interface QuizQuestion {
   question: string;
   answers: string[];
   correct: number;
   explanation: string;
}

export type Quiz = QuizQuestion[];
