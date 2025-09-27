import { Module } from './types';

export const SLOW_LEARNER_ROADMAP: Module[] = [
    { id: 's1', title: 'React Basics: What and Why', description: 'Understand the fundamentals of React and its ecosystem.', completed: true, badgeAwarded: true },
    { id: 's2', title: 'Components, Props, and JSX', description: 'Learn to build UIs with components and JSX syntax.', completed: false, badgeAwarded: false },
    { id: 's3', title: 'Handling State and Events', description: 'Deep dive into managing component state with useState.', completed: false, badgeAwarded: false },
    { id: 's4', title: 'Lifecycle with useEffect', description: 'Master side effects and component lifecycle.', completed: false, badgeAwarded: false },
    { id: 's5', title: 'Conditional Rendering & Lists', description: 'Dynamically render UI elements based on data.', completed: false, badgeAwarded: false },
];

export const FAST_LEARNER_ROADMAP: Module[] = [
    { id: 'f1', title: 'React Fundamentals Review', description: 'A quick refresher on core React concepts.', completed: true, badgeAwarded: true },
    { id: 'f2', title: 'Advanced State Management', description: 'Explore Context API, useReducer, and external libraries.', completed: true, badgeAwarded: true },
    { id: 'f3', title: 'Mastering Hooks', description: 'Deep dive into custom hooks, useCallback, and useMemo.', completed: true, badgeAwarded: true },
    { id: 'f4', title: 'Performance Optimization', description: 'Techniques for building fast and scalable React apps.', completed: false, badgeAwarded: false },
    { id: 'f5', title: 'React Ecosystem: Routing & Testing', description: 'Integrate popular libraries for a full-fledged application.', completed: false, badgeAwarded: false },
];

export const LEADERBOARD_DATA = [
    { name: 'Elena Petrova', points: 3200, avatar: 'https://picsum.photos/seed/elena/40/40' },
    { name: 'Marcus Wu', points: 2950, avatar: 'https://picsum.photos/seed/marcus/40/40' },
    { name: 'Alex Johnson', points: 1250, avatar: 'https://picsum.photos/seed/alex/40/40' }, // Current User (Fast)
    { name: 'Priya Singh', points: 1100, avatar: 'https://picsum.photos/seed/priya/40/40' },
    { name: 'David Chen', points: 950, avatar: 'https://picsum.photos/seed/david/40/40' },
];