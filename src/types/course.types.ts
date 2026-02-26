import { Slide } from './slide.types';

export interface Presentation {
   id: string;
   title: string;
   subtitle: string;
   slides: Slide[];
   storageKey: string;
   available: boolean;
   githubLink: string;
}

export interface Day {
   title: string;
   subtitle: string;
   description: string;
   color: string;
   githubLink: string;
   presentations: Presentation[];
}

export interface CourseData {
   [key: string]: Day;
}
