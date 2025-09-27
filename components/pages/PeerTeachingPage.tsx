import React, { useContext, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/Card";
import { AppContext } from "../../contexts/AppContext";
import {
  Award,
  UserPlus,
  Search,
  CheckCircle,
  Send,
  XCircle,
  Info,
  Clock,
  Rocket,
} from "lucide-react";
import { VideoChatModal } from "./VideoChatModal"; // PeerJS video chat modal

// Mentor type includes peerId
type Mentor = {
  id: number;
  name: string;
  badge: string;
  avatar: string;
  bio: string;
  status: "online" | "offline";
  peerId: string;
};

type MentorRequest = {
  mentorId: number;
  status: "pending" | "accepted";
  startTime?: Date;
  endTime?: Date;
};

// MentorCard handles both request + connect
const MentorCard: React.FC<{
  mentor: Mentor;
  request?: MentorRequest;
  on_request_action: (mentorId: number, action: "request" | "cancel") => void;
  on_connect: (mentor: Mentor) => void;
}> = ({ mentor, request, on_request_action, on_connect }) => {
  const { id, name, badge, avatar, bio, status } = mentor;

  const render_action_section = () => {
    if (request?.status === "accepted") {
      return (
        <div className="flex flex-col items-end gap-2 text-right">
          <div className="text-sm bg-green-500/10 text-green-700 px-3 py-1 rounded-full flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              {request.startTime?.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              -{" "}
              {request.endTime?.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <button
            onClick={() => on_connect(mentor)}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors bg-green-600 text-white hover:bg-green-700"
          >
            <Rocket className="h-4 w-4" />
            Connect
          </button>
        </div>
      );
    }

    const is_requested = request?.status === "pending";
    return (
      <button
        onClick={() => on_request_action(id, is_requested ? "cancel" : "request")}
        className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors
          ${
            is_requested
              ? "bg-secondary text-secondary-foreground hover:bg-destructive/80 hover:text-destructive-foreground"
              : "bg-primary text-primary-foreground hover:bg-primary/80"
          }`}
      >
        {is_requested ? <XCircle className="h-4 w-4" /> : <Send className="h-4 w-4" />}
        {is_requested ? "Cancel" : "Request"}
      </button>
    );
  };

  return (
    <Card className="hover:border-primary transition-colors duration-200">
      <CardContent className="flex items-start gap-4 p-4">
        <div className="relative">
          <img
            src={avatar}
            alt={name}
            className="h-16 w-16 rounded-full border-2 border-border"
          />
          <span
            className={`absolute bottom-0 right-0 block h-4 w-4 rounded-full border-2 border-card ${
              status === "online" ? "bg-green-500" : "bg-gray-400"
            }`}
            title={status === "online" ? "Online" : "Offline"}
          ></span>
        </div>
        <div className="flex-grow">
          <h4 className="font-bold text-lg">{name}</h4>
          <div className="flex items-center gap-1 text-sm text-yellow-500 mb-1">
            <Award className="h-4 w-4" />
            <span>Mentor for "{badge}"</span>
          </div>
          <p className="text-sm text-muted-foreground">{bio}</p>
        </div>
        {render_action_section()}
      </CardContent>
    </Card>
  );
};

// Skeleton for loading
const MentorCardSkeleton: React.FC = () => (
  <div className="flex items-center gap-4 p-4 border border-border rounded-lg">
    <div className="h-16 w-16 rounded-full bg-secondary animate-pulse"></div>
    <div className="flex-grow space-y-2">
      <div className="h-5 w-1/3 bg-secondary animate-pulse rounded"></div>
      <div className="h-4 w-1/2 bg-secondary animate-pulse rounded"></div>
      <div className="h-4 w-full bg-secondary animate-pulse rounded"></div>
    </div>
    <div className="ml-auto h-10 w-24 bg-secondary animate-pulse rounded-lg"></div>
  </div>
);

const PeerTeachingPage: React.FC = () => {
  const { user } = useContext(AppContext);

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isCurrentUserMentor, setIsCurrentUserMentor] = useState<boolean>(false);
  const [requests, setRequests] = useState<MentorRequest[]>([]);
  const [activeCall, setActiveCall] = useState<Mentor | null>(null);

  // Mock mentors (with peerId)
  useEffect(() => {
    const mockMentors: Mentor[] = [
      {
        id: 1,
        name: "Arjun Patel",
        badge: "Advanced Java",
        avatar:
          "https://cdn.prod.website-files.com/6600e1eab90de089c2d9c9cd/662c092880a6d18c31995e13_66236537d4f46682e079b6ce_Casual%2520Portrait.webp",
        bio: "Software Engineer with 5+ years of experience in enterprise Java applications.",
        status: "online",
        peerId: "mentor-arjun-123",
      },
      {
        id: 2,
        name: "Ananya Sharma",
        badge: "Machine Learning",
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPtnSjnCcqFxGeKu0jTzpOn2L757Gp5hp1vw&s",
        bio: "Data Scientist specializing in NLP and computer vision models.",
        status: "offline",
        peerId: "mentor-ananya-456",
      },
      {
        id: 3,
        name: "Ishaan Malik",
        badge: "Python Basics",
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ95EQHFKXOpaKUY7Xeno-Q7_P9_nCqByGvZA&s",
        bio: "Helping beginners get started with their Python journey.",
        status: "online",
        peerId: "mentor-ishaan-789",
      },
      {
        id: 4,
        name: "Priya Singh",
        badge: "React Hooks",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        bio: "Frontend developer passionate about modern React and state management.",
        status: "offline",
        peerId: "mentor-priya-012",
      },
    ];

    setTimeout(() => {
      setMentors(mockMentors);
      setIsLoading(false);
    }, 1500);
  }, []);

  // Simulate auto-accept after 5s
  useEffect(() => {
    const pendingRequest = requests.find((r) => r.status === "pending");

    if (pendingRequest) {
      const timer = setTimeout(() => {
        setRequests((prevRequests) =>
          prevRequests.map((r) => {
            if (r.mentorId === pendingRequest.mentorId && r.status === "pending") {
              const startTime = new Date();
              const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
              return { ...r, status: "accepted", startTime, endTime };
            }
            return r;
          })
        );
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [requests]);

  if (!user) return null;

  const handleRequestAction = (mentorId: number, action: "request" | "cancel") => {
    if (action === "request") {
      setRequests((prev) => [...prev, { mentorId, status: "pending" }]);
    } else if (action === "cancel") {
      setRequests((prev) => prev.filter((r) => r.mentorId !== mentorId));
    }
  };

  const handleOptIn = () => setIsCurrentUserMentor(true);

  const filteredMentors = mentors.filter(
    (mentor) =>
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.badge.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.bio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Video Chat Modal */}
      {activeCall && (
        <VideoChatModal mentor={activeCall} onClose={() => setActiveCall(null)} />
      )}

      {/* Become a Mentor */}
      <Card>
        <CardHeader>
          <CardTitle>Become a Mentor</CardTitle>
          <CardDescription>
            Share your knowledge and earn rewards by teaching topics you've
            mastered.
          </CardDescription>
        </CardHeader>
       <CardContent>
  {(user.badges?.length || 0) > 0 ? (
    <div className="space-y-4">
      <p>You are eligible to mentor in the following topics:</p>
      <div className="flex flex-wrap gap-2">
        {user.badges?.map((badge) => (
          <span
            key={badge}
            className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-full text-sm"
          >
            <Award className="h-4 w-4 text-yellow-500" /> {badge}
          </span>
        ))}
      </div>
      {isCurrentUserMentor ? (
        <div className="mt-4 flex items-center gap-2 text-green-600 font-semibold p-3 bg-green-500/10 rounded-lg">
          <CheckCircle className="h-5 w-5" />
          You are listed as a mentor. Happy teaching!
        </div>
      ) : (
        <button
          onClick={handleOptIn}
          className="mt-4 bg-primary text-primary-foreground font-bold py-2 px-4 rounded-lg hover:bg-primary/80 transition-colors flex items-center gap-2"
        >
          <UserPlus className="h-5 w-5" />
          Opt-in as a Mentor
        </button>
      )}
    </div>
  ) : (
    <p className="text-muted-foreground">
      Complete modules and earn badges to become a mentor!
    </p>
  )}
</CardContent>

      </Card>

      {/* My Mentor Requests */}
      <Card>
        <CardHeader>
          <CardTitle>My Mentor Requests</CardTitle>
          <CardDescription>
            Here are your pending and accepted requests. Accepted sessions will
            show a connect button.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length > 0 ? (
            <div className="space-y-4">
              {requests.map((request) => {
                const mentor = mentors.find((m) => m.id === request.mentorId);
                if (!mentor) return null;
                return (
                  <MentorCard
                    key={`req-${mentor.id}`}
                    mentor={mentor}
                    request={request}
                    on_request_action={handleRequestAction}
                    on_connect={setActiveCall}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8 flex flex-col items-center justify-center gap-2">
              <Info className="h-8 w-8 text-muted-foreground/50" />
              <p>You haven't requested any mentors yet.</p>
              <p className="text-sm">
                Find one in the list below to get started!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Find a Peer Mentor */}
      <Card>
        <CardHeader>
          <CardTitle>Find a Peer Mentor</CardTitle>
          <CardDescription>
            Get help from fellow learners who have mastered the topics you're
            working on.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, topic, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-secondary border border-border rounded-lg p-2 pl-10 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Available Mentors</h3>
            {isLoading ? (
              <div className="space-y-4">
                <MentorCardSkeleton />
                <MentorCardSkeleton />
              </div>
            ) : filteredMentors.length > 0 ? (
              filteredMentors.map((mentor) => {
                const request_for_this_mentor = requests.find(
                  (r) => r.mentorId === mentor.id
                );
                return (
                  <MentorCard
                    key={mentor.id}
                    mentor={mentor}
                    request={request_for_this_mentor}
                    on_request_action={handleRequestAction}
                    on_connect={setActiveCall}
                  />
                );
              })
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No mentors found matching your search. Try another keyword!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PeerTeachingPage;
