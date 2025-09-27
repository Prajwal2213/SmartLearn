import { createContext } from "react";
import { Page, LearnerType } from "../types";

// ---------------------------
// Full User type
// ---------------------------
export interface User {
  name: string;
  email: string;
  learnerType: LearnerType;
  points?: number;
  avatarUrl?: string;
  badges?: string[];
  notificationCount?: number;
  completedCourses?: number;
}

// ---------------------------
// AppContext type
// ---------------------------
export interface AppContextType {
  user: User | null;
  currentPage: Page;
  login: (user: User) => void;
  logout: () => void;
  navigate: (page: Page) => void;
}

// ---------------------------
// Default context
// ---------------------------
export const AppContext = createContext<AppContextType>({
  user: null,
  currentPage: Page.Dashboard,
  login: (user: User) => {}, // now typed correctly
  logout: () => {},
  navigate: (page: Page) => {},
});
