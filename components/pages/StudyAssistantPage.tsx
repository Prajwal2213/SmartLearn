import React, { useState, useCallback } from 'react';
import { generateStudyMaterials } from '../../services/geminiService';
import { GeneratedStudyMaterials, Flashcard as FlashcardType } from '../../types';
import { Loader2, Sparkles, BookOpen, Layers, HelpCircle, Bot } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';

const Flashcard: React.FC<{ card: FlashcardType }> = ({ card }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="w-full h-48 perspective-1000" onClick={() => setIsFlipped(!isFlipped)}>
            <div
                className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-700 ${isFlipped ? 'rotate-y-180' : ''}`}
            >
                <div className="absolute w-full h-full backface-hidden bg-secondary rounded-lg flex items-center justify-center p-4 text-center">
                    <p className="text-lg font-semibold">{card.term}</p>
                </div>
                <div className="absolute w-full h-full backface-hidden bg-primary text-primary-foreground rounded-lg flex items-center justify-center p-4 text-center rotate-y-180">
                    <p>{card.definition}</p>
                </div>
            </div>
        </div>
    );
};

const Quiz: React.FC<{ quiz: GeneratedStudyMaterials['quiz'] }> = ({ quiz }) => {
    const [answers, setAnswers] = useState<(number | null)[]>(quiz.map(() => null));
    const [submitted, setSubmitted] = useState(false);

    const handleSelect = (qIndex: number, oIndex: number) => {
        if (submitted) return;
        const newAnswers = [...answers];
        newAnswers[qIndex] = oIndex;
        setAnswers(newAnswers);
    };
    
    const getOptionClass = (qIndex: number, oIndex: number) => {
        if (!submitted) {
            return answers[qIndex] === oIndex ? 'bg-primary' : 'bg-secondary hover:bg-primary/50';
        }
        if (oIndex === quiz[qIndex].correctAnswerIndex) {
            return 'bg-green-600';
        }
        if (answers[qIndex] === oIndex) {
            return 'bg-red-600';
        }
        return 'bg-secondary opacity-50';
    };

    const score = answers.filter((ans, i) => ans === quiz[i].correctAnswerIndex).length;

    return (
        <div className="space-y-6">
            {quiz.map((q, qIndex) => (
                <div key={qIndex}>
                    <p className="font-semibold mb-2">{qIndex + 1}. {q.question}</p>
                    <div className="space-y-2">
                        {q.options.map((option, oIndex) => (
                            <button
                                key={oIndex}
                                onClick={() => handleSelect(qIndex, oIndex)}
                                disabled={submitted}
                                className={`w-full text-left p-3 rounded-md transition-colors ${getOptionClass(qIndex, oIndex)}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
            {!submitted ? (
                <button
                    onClick={() => setSubmitted(true)}
                    className="w-full bg-primary text-primary-foreground font-bold py-2 px-4 rounded-lg hover:bg-primary/80 transition-colors"
                >
                    Submit Quiz
                </button>
            ) : (
                <div className="text-center p-4 bg-secondary rounded-lg">
                    <p className="text-xl font-bold">Your score: {score} / {quiz.length}</p>
                </div>
            )}
        </div>
    );
};


type ActiveTab = 'summary' | 'flashcards' | 'quiz';

const StudyAssistantPage: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [materials, setMaterials] = useState<GeneratedStudyMaterials | null>(null);
    const [activeTab, setActiveTab] = useState<ActiveTab>('summary');

    const handleGenerate = useCallback(async () => {
        if (!inputText.trim()) {
            setError('Please enter some text to generate study materials.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setMaterials(null);

        try {
            const result = await generateStudyMaterials(inputText);
            setMaterials(result);
            setActiveTab('summary');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [inputText]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>Study Material Generator</CardTitle>
                    <CardDescription>Paste your notes, text, or any content below.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Paste your content here..."
                        className="w-full flex-grow bg-secondary border border-border rounded-lg p-4 resize-none focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="mt-4 w-full bg-primary text-primary-foreground font-bold py-3 px-4 rounded-lg hover:bg-primary/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-5 w-5" />
                                Generate with AI
                            </>
                        )}
                    </button>
                </CardContent>
            </Card>

            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>AI Generated Materials</CardTitle>
                    <CardDescription>Your summary, flashcards, and quiz will appear here.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <Loader2 className="h-12 w-12 animate-spin mb-4" />
                            <p className="text-lg">AI is working its magic...</p>
                        </div>
                    )}
                    {materials && (
                        <div>
                            <div className="border-b border-border mb-4 flex">
                                <TabButton icon={BookOpen} label="Summary" isActive={activeTab === 'summary'} onClick={() => setActiveTab('summary')} />
                                <TabButton icon={Layers} label="Flashcards" isActive={activeTab === 'flashcards'} onClick={() => setActiveTab('flashcards')} />
                                <TabButton icon={HelpCircle} label="Quiz" isActive={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')} />
                            </div>
                            <div>
                                {activeTab === 'summary' && <p className="whitespace-pre-wrap leading-relaxed">{materials.summary}</p>}
                                {activeTab === 'flashcards' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {materials.flashcards.map((card, index) => <Flashcard key={index} card={card} />)}
                                    </div>
                                )}
                                {activeTab === 'quiz' && <Quiz quiz={materials.quiz} />}
                            </div>
                        </div>
                    )}
                    {!isLoading && !materials && (
                         <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <Bot className="h-12 w-12 mb-4" />
                            <p className="text-lg text-center">Your generated materials will be shown here.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

const TabButton: React.FC<{
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon: Icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            isActive ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
        }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
);


export default StudyAssistantPage;