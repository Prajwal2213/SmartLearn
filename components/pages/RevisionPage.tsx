
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Calendar, Check, Wand2 } from 'lucide-react';

const RevisionPage: React.FC = () => {
    const [schedule, setSchedule] = useState<any[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const generateSchedule = () => {
        setIsLoading(true);
        // Simulate AI call
        setTimeout(() => {
            setSchedule([
                { topic: 'React Basics: What and Why', date: '3 days from now', status: 'Upcoming' },
                { topic: 'Advanced State Management', date: '1 week from now', status: 'Upcoming' },
                { topic: 'Mastering Hooks', date: '2 weeks from now', status: 'Upcoming' },
            ]);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>AI Revision Scheduler</CardTitle>
                <CardDescription>Let our AI create a personalized revision plan based on the principles of spaced repetition to maximize your retention.</CardDescription>
            </CardHeader>
            <CardContent>
                {!schedule && !isLoading && (
                     <div className="text-center py-10">
                        <p className="text-muted-foreground mb-4">You have completed several modules. Ready to generate a smart revision schedule?</p>
                        <button onClick={generateSchedule} className="bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:bg-primary/80 transition-colors flex items-center gap-2 mx-auto">
                            <Wand2 className="h-5 w-5" />
                            Generate My Schedule
                        </button>
                    </div>
                )}
                {isLoading && (
                    <div className="text-center py-10">
                        <Wand2 className="h-10 w-10 text-primary animate-pulse mx-auto mb-4" />
                        <p>Generating your optimal revision plan...</p>
                    </div>
                )}
                {schedule && (
                    <div className="space-y-4">
                        {schedule.map((item, index) => (
                            <div key={index} className="flex items-center justify-between bg-secondary p-4 rounded-lg">
                                <div>
                                    <p className="font-semibold">{item.topic}</p>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4"/>
                                        <span>Revise in: {item.date}</span>
                                    </div>
                                </div>
                                <button className="flex items-center gap-2 text-sm bg-green-600/20 text-green-400 px-3 py-1 rounded-full">
                                    <Check className="h-4 w-4"/>
                                    Mark as Done
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default RevisionPage;
