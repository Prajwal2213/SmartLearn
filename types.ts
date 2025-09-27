
export enum LearnerType {
    Slow = 'Slow Learner',
    Fast = 'Fast Learner',
    Mid = 'Mid Learner'
}

export interface User {
    name: string;
    email: string;
    learnerType: LearnerType;
    points: number;
    badges: string[];
    avatarUrl: string;
}

export enum Page {
    Dashboard = 'Dashboard',
    StudyAssistant = 'AI Study Assistant',
    PeerTeaching = 'Peer Teaching',
    Revision = 'Revision Scheduler',
}

export interface Module {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    badgeAwarded: boolean;
}

export interface Flashcard {
    term: string;
    definition: string;
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswerIndex: number;
}

export interface GeneratedStudyMaterials {
    summary: string;
    flashcards: Flashcard[];
    quiz: QuizQuestion[];
}
