import React, { useContext, useState } from "react";
import { AppContext } from "../../contexts/AppContext";
import { LearnerType } from "../../types";
import { BrainCircuit, Zap, Turtle, User, Mail, Lock, BarChart2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card";

const LearnerTypeCard: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
  isSelected: boolean;
}> = ({ icon: Icon, title, description, onClick, isSelected }) => (
  <Card
    className={`text-center cursor-pointer hover:border-primary hover:scale-105 transition-all duration-300 ${
      isSelected ? "border-primary ring-2 ring-primary" : "border-border"
    }`}
    onClick={onClick}
  >
    <CardHeader className="pb-2">
      <div className="flex justify-center mb-2">
        <div className="p-3 bg-secondary rounded-full">
          <Icon className="h-8 w-8 text-primary" />
        </div>
      </div>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent className="pt-0">
      <CardDescription className="text-sm">{description}</CardDescription>
    </CardContent>
  </Card>
);

const LoginPage: React.FC = () => {
  const { login } = useContext(AppContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [selectedLearnerType, setSelectedLearnerType] = useState<LearnerType | null>(null);

  const validatePassword = (pw: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(pw);
    const hasLowerCase = /[a-z]/.test(pw);
    const hasDigit = /[0-9]/.test(pw);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pw);

    if (pw.length < minLength) return `Password must be at least ${minLength} characters.`;
    if (!hasUpperCase) return "Password must contain at least one uppercase letter.";
    if (!hasLowerCase) return "Password must contain at least one lowercase letter.";
    if (!hasDigit) return "Password must contain at least one number.";
    if (!hasSpecialChar) return "Password must contain a special character.";
    return "";
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pw = e.target.value;
    setPassword(pw);
    setPasswordError(validatePassword(pw));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !selectedLearnerType) {
      alert("Please fill in all fields and select your learning style.");
      return;
    }
    if (passwordError) {
      alert("Please fix password errors before proceeding.");
      return;
    }
    login({
  name,
  email,
  learnerType: selectedLearnerType,
});
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <BrainCircuit className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold tracking-tight">Welcome to EduSpark AI</h1>
          </div>
          <p className="text-xl text-muted-foreground">Your personalized, gamified learning journey starts here.</p>
        </div>

        <Card className="bg-background/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Your Profile & Choose Learning Style</CardTitle>
            <CardDescription>Enter your details and select a learning style to personalize your roadmap.</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
                    <User className="h-4 w-4" /> Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Your Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4" /> Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
                    <Lock className="h-4 w-4" /> Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Choose a strong password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-full bg-secondary border border-border rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none"
                    required
                  />
                  {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-semibold text-foreground">Select Your Learning Style:</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <LearnerTypeCard
                    icon={Turtle}
                    title={LearnerType.Slow}
                    description="Prefers detailed, step-by-step content at a relaxed pace."
                    onClick={() => setSelectedLearnerType?.(LearnerType.Slow)}
                    isSelected={selectedLearnerType === LearnerType.Slow}
                  />
                  {/* This is the new Mid Learner card */}
                  <LearnerTypeCard
                    icon={BarChart2}
                    title={LearnerType.Mid}
                    description="Likes balanced content, with moderate detail and pacing."
                    onClick={() => setSelectedLearnerType?.(LearnerType.Mid)}
                    isSelected={selectedLearnerType === LearnerType.Mid}
                  />
                  <LearnerTypeCard
                    icon={Zap}
                    title={LearnerType.Fast}
                    description="Quick learner, prefers advanced topics and concise content."
                    onClick={() => setSelectedLearnerType?.(LearnerType.Fast)}
                    isSelected={selectedLearnerType === LearnerType.Fast}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:bg-primary/80 transition-colors text-lg"
              >
                Start Learning Journey
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
