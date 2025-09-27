import React, { createContext, useContext, useMemo, useState } from "react";
import {
  CheckCircle,
  Award,
  Target,
  Trophy,
  Star,
  Bell,
  UserCircle,
  X,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";

// ---------------------------
// Mocked types & data
// ---------------------------
export enum LearnerType {
  Slow = "Slow",
  Fast = "Fast",
}

export type Module = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
};

export const SLOW_LEARNER_ROADMAP: Module[] = [
  { id: "m1", title: "Intro to React", description: "Basics of React", completed: true },
  { id: "m2", title: "Components & Props", description: "Understand components", completed: true },
  { id: "m3", title: "State & Lifecycle", description: "Local state patterns", completed: false },
];

export const FAST_LEARNER_ROADMAP: Module[] = SLOW_LEARNER_ROADMAP.map((m, i) => ({ ...m, completed: i < 2 }));

export const LEADERBOARD_DATA = [
  { name: "Arjun Patel", points: 980, avatar: "https://cdn.prod.website-files.com/6600e1eab90de08…66236537d4f46682e079b6ce_Casual%2520Portrait.webp" },
  { name: "Ananya Sharma", points: 870, avatar: "	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPtnSjnCcqFxGeKu0jTzpOn2L757Gp5hp1vw&s" },
  { name: "Ishaan Malik", points: 600, avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ95EQHFKXOpaKUY7Xeno-Q7_P9_nCqByGvZA&s" },
];

// ---------------------------
// Simple Card UI components
// ---------------------------
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...props }) => (
  <div className={`bg-white/60 dark:bg-slate-800/60 rounded-xl shadow-sm p-0 ${className}`} {...props}>
    {children}
  </div>
);

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...props }) => (
  <div className={`px-4 py-3 border-b last:border-b-0 ${className}`} {...props}>{children}</div>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...props }) => (
  <div className={`p-4 ${className}`} {...props}>{children}</div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className = "", ...props }) => (
  <h3 className={`text-base font-semibold ${className}`} {...props}>{children}</h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ children, className = "", ...props }) => (
  <p className={`text-sm text-muted-foreground ${className}`} {...props}>{children}</p>
);

// ---------------------------
// AppContext mock
// ---------------------------
export type User = {
  name: string;
  avatarUrl?: string;
  points?: number;
  learnerType?: LearnerType;
  notificationCount?: number;
  email?: string;
  phone?: string;
  memberSince?: string;
  completedCourses?: number;
};

const DEFAULT_USER: User = {
  name: "Dhanush R Gowda",
  avatarUrl: "https://media.istockphoto.com/id/471926619/photo/moraine-lake-at-sunrise-banff-national-park-canada.jpg?s=612x612&w=0&k=20&c=mujiCtVk5QA697SD3d8V8BGmd91-8HlxCNHkolEA0Bo=",
  points:325,
  learnerType: LearnerType.Slow,
  notificationCount: 2,
  email: "dhanush@example.com",
  phone: "+91 98765 43210",
  memberSince: "2023-01-15T00:00:00.000Z",
  completedCourses: 5,
};

export const AppContext = createContext<{ user: User | null }>({ user: DEFAULT_USER });

// ---------------------------
// BADGES constant
// ---------------------------
const BADGES = [
  { badge: "Advanced State Management" },
  { badge: "Mastering Hooks" },
  { badge: "React Fundamentals" },
];

// ---------------------------
// Helper components
// ---------------------------
const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
  </div>
);

const RoadmapModule: React.FC<{ module: Module; isLast: boolean }> = ({ module, isLast }) => (
  <div className="relative pl-8">
    <div className="absolute left-0 top-0 flex items-center">
      <div className={`h-4 w-4 rounded-full border-2 ${module.completed ? 'bg-indigo-600 border-indigo-600' : 'bg-gray-300 border-gray-300'}`} />
      {!isLast && <div className={`absolute top-4 left-1/2 -ml-px h-full w-0.5 ${module.completed ? 'bg-indigo-600' : 'bg-gray-300'}`} />}
    </div>
    <Card className={`ml-4 ${module.completed ? 'border-indigo-200' : ''}`}>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <h4 className="font-semibold text-foreground">{module.title}</h4>
          <p className="text-sm text-muted-foreground">{module.description}</p>
        </div>
        {module.completed && <CheckCircle className="h-6 w-6 text-green-500" />}
      </CardContent>
    </Card>
  </div>
);

// ---------------------------
// Navbar & Profile modal
// ---------------------------
const DashboardNavbar: React.FC<{ onProfileClick: () => void; user: User | null }> = ({ onProfileClick, user }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <nav className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-900/50 shadow-sm sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-foreground">My Learning Dashboard</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            aria-label="Toggle notifications"
            onClick={() => setShowNotifications(prev => !prev)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            <Bell className="h-6 w-6 text-muted-foreground" />
            {user?.notificationCount ? (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center font-bold">{user.notificationCount}</span>
            ) : null}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white/90 dark:bg-slate-800 border rounded-md shadow-lg z-50">
              <div className="p-4">
                <h3 className="font-semibold mb-2">Notifications</h3>
                <ul className="space-y-2 text-sm">
                  <li>New course 'React Fundamentals' available!</li>
                  <li>Module 'Introduction to Hooks' completed!</li>
                  <li>Your friend John Doe joined the leaderboard.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <button
          aria-label="Open profile"
          onClick={onProfileClick}
          className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800"
        >
          <img src={user?.avatarUrl ?? DEFAULT_USER.avatarUrl} alt={user?.name} className="h-8 w-8 rounded-full" />
          <span className="hidden md:inline font-medium">{user?.name}</span>
          <UserCircle className="h-6 w-6 text-muted-foreground" />
        </button>
      </div>
    </nav>
  );
};

const ProfileDetailsSection: React.FC<{ onClose: () => void; user: User | null }> = ({ onClose, user }) => {
  const userEmail = user?.email ?? "N/A";
  const userPhone = user?.phone ?? "N/A";
  const memberSince = user?.memberSince;
  const completedCourses = user?.completedCourses ?? 0;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 ">
      <Card className="max-w-2xl w-full mx-auto relative bg-grey-500">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Your Profile</CardTitle>
          <button aria-label="Close profile" onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 ">
            <img src={user?.avatarUrl ?? DEFAULT_USER.avatarUrl} alt={user?.name} className="h-24 w-24 rounded-full border-4 border-indigo-200" />
            <div>
              <h2 className="text-3xl font-bold">{user?.name}</h2>
              <p className="text-muted-foreground">{user?.learnerType === LearnerType.Slow ? 'Slow Learner' : 'Fast Learner'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-5 w-5" />
              <span>{userEmail}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-5 w-5" />
              <span>{userPhone}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-5 w-5" />
              <span>Member since: {memberSince ? new Date(memberSince).toLocaleDateString() : "N/A"}</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Achievements</h3>
            <div className="flex flex-wrap gap-2">
              {BADGES.map((item, index) => (
                <span key={index} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  <span className="font-bold">{index + 1}.</span> {item.badge}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Summary</h3>
            <p className="text-muted-foreground">Currently tracking {user?.points ?? 0}  and has completed {completedCourses} courses.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ---------------------------
// DashboardPage
// ---------------------------
const DashboardPage: React.FC = () => {
  const { user } = useContext(AppContext);
  const [showProfileDetails, setShowProfileDetails] = useState(false);

  if (!user) return null;

  const roadmap = user?.learnerType === LearnerType.Slow ? SLOW_LEARNER_ROADMAP : FAST_LEARNER_ROADMAP;
  const completedModules = roadmap.filter((m) => m.completed).length;
  const progress = (completedModules / roadmap.length) * 100;

  const leaderboardWithUser = useMemo(() => {
    const otherPlayers = LEADERBOARD_DATA.filter((p) => p.name !== user?.name);
    const userInLeaderboard = {
      name: user?.name ?? 'You',
      points: user?.points ?? 0,
      avatar: user?.avatarUrl ?? DEFAULT_USER.avatarUrl,
    };
    return [...otherPlayers, userInLeaderboard].sort((a, b) => b.points - a.points);
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-foreground">
      <DashboardNavbar onProfileClick={() => setShowProfileDetails(true)} user={user} />
      {showProfileDetails && <ProfileDetailsSection onClose={() => setShowProfileDetails(false)} user={user} />}

      <main className="container mx-auto py-8 px-4 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(progress)}%</div>
              <p className="text-xs text-muted-foreground">Course Completion</p>
              <ProgressBar value={progress} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Points</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.points ?? 0}</div>
              <p className="text-xs text-muted-foreground">Keep it up!</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Badges</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{BADGES.length}</div>
              <p className="text-xs text-muted-foreground truncate">{BADGES.map((b) => b.badge).join(', ')}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Learning Roadmap</CardTitle>
                <CardDescription>Follow these modules to master the topic.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {roadmap.map((module, index) => (
                  <RoadmapModule key={module.id} module={module} isLast={index === roadmap.length - 1} />
                ))}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-yellow-400" /> Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {leaderboardWithUser.map((player, index) => (
                    <li key={player.name} className={`flex items-center justify-between p-2 rounded-md ${player.name === user?.name ? 'bg-grey-400' : ''}`}>
                      <div className="flex items-center gap-3">
                        <span className="font-bold w-6 text-center">{index + 1}</span>
                        <img src={player.avatar} alt={player.name} className="h-8 w-8 rounded-full" />
                        <span className="font-medium">{player.name}</span>
                      </div>
                      <span className="font-semibold text-indigo-600">{player.points} </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;