
import React, { useContext, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Page } from '../types';
import { Home, Bot, Users, BookCheck, LogOut, Menu, X, BrainCircuit, BookOpenCheck, CalendarClock } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

const NavItem: React.FC<{
    icon: React.ElementType;
    label: Page;
    isCollapsed: boolean;
}> = ({ icon: Icon, label, isCollapsed }) => {
    const { currentPage, navigate } = useContext(AppContext);
    const isActive = currentPage === label;

    return (
        <button
            onClick={() => navigate(label)}
            className={`flex items-center w-full h-12 px-4 rounded-lg transition-colors duration-200 ${
                isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
        >
            <Icon className="h-5 w-5" />
            {!isCollapsed && <span className="ml-4 font-medium">{label}</span>}
        </button>
    );
};

const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
    const { user, logout } = useContext(AppContext);

    return (
        <header className="flex items-center justify-between h-16 px-4 md:px-8 bg-card border-b border-border fixed top-0 left-0 md:left-64 right-0 z-40">
            <button onClick={onMenuClick} className="md:hidden text-foreground">
                <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold text-foreground hidden md:block">Welcome, {user?.name.split(' ')[0]}!</h1>
               
                <button onClick={logout} className="p-2 rounded-full hover:bg-secondary">
                    <LogOut className="h-5 w-5 text-muted-foreground"/>
                </button>
        </header>
    );
};

const Sidebar: React.FC<{ isCollapsed: boolean; onClose: () => void }> = ({ isCollapsed, onClose }) => {
    return (
        <>
            <aside className={`fixed top-0 left-0 h-full bg-card border-r border-border z-50 transition-transform duration-300 ease-in-out ${
                isCollapsed ? '-translate-x-full' : 'translate-x-0'
            } md:translate-x-0 md:w-64`}>
                <div className="flex items-center justify-between h-16 px-4 border-b border-border">
                    <div className="flex items-center gap-2">
                        <BrainCircuit className="h-8 w-8 text-primary" />
                        <span className="text-xl font-bold">EduSpark AI</span>
                    </div>
                     <button onClick={onClose} className="md:hidden text-foreground">
                        <X className="h-6 w-6" />
                    </button>
                </div>
                <nav className="p-4 space-y-2">
                    <NavItem icon={Home} label={Page.Dashboard} isCollapsed={false} />
                    <NavItem icon={Bot} label={Page.StudyAssistant} isCollapsed={false} />
                    <NavItem icon={Users} label={Page.PeerTeaching} isCollapsed={false} />
                    <NavItem icon={CalendarClock} label={Page.Revision} isCollapsed={false} />
                </nav>
            </aside>
            {/* Overlay for mobile */}
            {!isCollapsed && <div onClick={onClose} className="fixed inset-0 bg-black/60 z-40 md:hidden"></div>}
        </>
    );
};


const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen flex">
            <Sidebar isCollapsed={!isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col md:ml-64">
                <Header onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 p-4 md:p-8 mt-16 bg-background">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
