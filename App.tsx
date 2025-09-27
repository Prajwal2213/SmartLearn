
import React, { useState, useCallback, useMemo } from 'react';
import { Page, LearnerType, User } from './types';
import { AppContext } from './contexts/AppContext';
import LoginPage from './components/pages/LoginPage';
import DashboardPage from './components/pages/DashboardPage';
import StudyAssistantPage from './components/pages/StudyAssistantPage';
import PeerTeachingPage from './components/pages/PeerTeachingPage';
import RevisionPage from './components/pages/RevisionPage';
import Layout from './components/Layout';

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);

    const login = useCallback((learnerType: LearnerType) => {
        const mockUser: User = {
            name: "Alex Johnson",
            email: "alex.j@example.com",
            learnerType,
            points: learnerType === LearnerType.Fast ? 1250 : 780,
            badges: learnerType === LearnerType.Fast 
                ? ["Introduction to React", "State Management", "Advanced Hooks"] 
                : ["Introduction to React"],
            avatarUrl: 'https://picsum.photos/seed/alex/100/100'
        };
        setUser(mockUser);
        setCurrentPage(Page.Dashboard);
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setCurrentPage(Page.Dashboard); // In a real app, this would be Page.Login
    }, []);

    const navigate = useCallback((page: Page) => {
        setCurrentPage(page);
    }, []);

    const contextValue = useMemo(() => ({
        user,
        currentPage,
        login,
        logout,
        navigate
    }), [user, currentPage, login, logout, navigate]);

    const renderPage = () => {
        switch (currentPage) {
            case Page.Dashboard:
                return <DashboardPage />;
            case Page.StudyAssistant:
                return <StudyAssistantPage />;
            case Page.PeerTeaching:
                return <PeerTeachingPage />;
            case Page.Revision:
                return <RevisionPage />;
            default:
                return <DashboardPage />;
        }
    };

    if (!user) {
        return (
            <AppContext.Provider value={contextValue}>
                <LoginPage />
            </AppContext.Provider>
        );
    }

    return (
        <AppContext.Provider value={contextValue}>
            <Layout>
                {renderPage()}
            </Layout>
        </AppContext.Provider>
    );
};

export default App;
