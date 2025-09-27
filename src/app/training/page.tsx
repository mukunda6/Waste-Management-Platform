

'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Award, Recycle, CheckCircle, Lightbulb, Star, Gamepad2, Timer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Confetti from 'react-confetti';
import { useAuth } from '@/hooks/use-auth';
import { updateUserScore } from '@/lib/firebase-service';
import { cn } from '@/lib/utils';

const modules = [
  {
    id: 'segregation',
    title: 'Waste Segregation 101',
    description: 'Learn to separate waste into Dry, Wet, and Hazardous categories.',
    content: 'Properly separating waste at its source is the most critical step in effective waste management. This simple habit prevents recyclable materials from being contaminated and reduces the amount of waste sent to landfills.',
    quiz: {
      question: 'Which of the following is considered "Dry Waste"?',
      options: ['Vegetable Peels', 'Plastic Bottles', 'Leftover Food'],
      answer: 'Plastic Bottles',
    },
    badge: { name: 'Segregation Star', icon: <Star className="h-4 w-4" /> },
    points: 25,
  },
  {
    id: 'composting',
    title: 'Composting at Home',
    description: 'Turn your kitchen scraps into valuable compost for your plants.',
    content: 'Composting is a natural process that recycles organic matter like leaves and food scraps into a rich soil amendment. It reduces landfill waste, enriches soil, and helps retain moisture.',
    quiz: {
      question: 'Which of these should NOT be composted at home?',
      options: ['Fruit Peels', 'Egg Shells', 'Meat & Dairy'],
      answer: 'Meat & Dairy',
    },
    badge: { name: 'Compost Champ', icon: <Recycle className="h-4 w-4" /> },
    points: 25,
  },
  {
    id: 'reuse',
    title: 'Creative Plastic Reuse',
    description: 'Discover fun DIY projects to give plastic waste a new life.',
    content: 'Before recycling, consider reusing! Many single-use plastic items can be transformed into useful objects for your home, such as planters, organizers, or even art. This reduces the demand for new plastic production.',
    quiz: {
      question: 'What is a common DIY project for a plastic bottle?',
      options: ['Bird Feeder', 'Cooking Pot', 'Light Bulb'],
      answer: 'Bird Feeder',
    },
    badge: { name: 'Reuse Rockstar', icon: <Lightbulb className="h-4 w-4" /> },
    points: 25,
  },
  {
    id: 'game',
    title: 'Waste Sorting Challenge',
    description: 'Test your knowledge in a fun, timed sorting game!',
    content: 'This challenge will test your ability to quickly classify different types of waste. For each item, choose the correct bin: Dry, Wet, or Hazardous. Try to get as many correct as you can before the time runs out!',
    badge: { name: 'Sorting Pro', icon: <Gamepad2 className="h-4 w-4" /> },
    points: 50,
  },
];


export default function TrainingPage() {
  const { toast } = useToast();
  const { user, refreshUser } = useAuth();
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [showConfetti, setShowConfetti] = useState(false);
  

  const progress = (completedModules.length / modules.length) * 100;
  const isAllCompleted = completedModules.length === modules.length;

  const handleQuizAnswer = (moduleId: string, answer: string) => {
    setQuizAnswers(prev => ({ ...prev, [moduleId]: answer }));
  };

  const handleCompleteModule = async (moduleId: string) => {
    if (!user) return;
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;
    
    if (module.quiz && quizAnswers[moduleId] !== module.quiz.answer) {
      toast({
        variant: 'destructive',
        title: 'Incorrect Answer',
        description: 'Please try the quiz again to complete the module.',
      });
      return;
    }

    if (!completedModules.includes(moduleId)) {
      const newCompleted = [...completedModules, moduleId];
      setCompletedModules(newCompleted);

      await updateUserScore(user.uid, module.points);
      await refreshUser();
      
      toast({
        title: 'Module Completed!',
        description: `You've earned the "${module.badge.name}" badge and ${module.points} coins!`,
      });

      if (newCompleted.length === modules.length) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 8000);
      }
    }
  };

  
  return (
    <>
      {showConfetti && <Confetti recycle={false} />}
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
            <GraduationCap className="h-8 w-8" />
            Waste Management Training Hub
          </h1>
          <p className="text-muted-foreground">
            Learn how to manage waste better, earn rewards, and become a Green Champion!
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Training Progress</CardTitle>
            <CardDescription>Complete all modules to receive your Green Champion certificate.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Progress value={progress} className="w-full" />
              <span className="font-bold whitespace-nowrap">{Math.round(progress)}%</span>
            </div>
            {isAllCompleted && (
              <div className="p-4 bg-green-100 dark:bg-green-900/50 border border-green-300 dark:border-green-700 rounded-lg text-center">
                <Award className="mx-auto h-12 w-12 text-green-600 dark:text-green-400" />
                <h3 className="text-lg font-semibold mt-2 text-green-800 dark:text-green-200">Congratulations, Green Champion!</h3>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">You've completed all training modules. Your certificate is now available on your profile.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Training Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {modules.map(module => (
                <AccordionItem key={module.id} value={module.id}>
                  <AccordionTrigger className="text-lg">
                    <div className="flex items-center gap-4">
                       {completedModules.includes(module.id) ? 
                         <CheckCircle className="h-6 w-6 text-green-500" /> : 
                         <div className="h-6 w-6 flex items-center justify-center"><div className="h-4 w-4 rounded-full border-2 border-muted-foreground"/></div>
                       }
                      {module.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-6 pt-4">
                    <p className="text-muted-foreground">{module.content}</p>
                    
                    {module.quiz && (
                        <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                            <h4 className="font-semibold">Mini Quiz</h4>
                            <p className="mb-2">{module.quiz.question}</p>
                            <RadioGroup onValueChange={(value) => handleQuizAnswer(module.id, value)} disabled={completedModules.includes(module.id)}>
                                {module.quiz.options.map(option => (
                                <div key={option} className="flex items-center space-x-2">
                                    <RadioGroupItem value={option} id={`${module.id}-${option}`} />
                                    <Label htmlFor={`${module.id}-${option}`}>{option}</Label>
                                </div>
                                ))}
                            </RadioGroup>
                        </div>
                    )}
                    
                    {module.id === 'game' && <WasteSortingGame onComplete={() => handleCompleteModule('game')} isCompleted={completedModules.includes('game')} />}

                    {completedModules.includes(module.id) ? (
                        <div className="flex items-center justify-between p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                            <p className="text-sm font-medium text-green-700 dark:text-green-300">Module Completed!</p>
                             <Badge variant="secondary" className="gap-1 bg-white">
                                {module.badge.icon}
                                {module.badge.name}
                            </Badge>
                        </div>
                    ) : (
                        module.quiz && (
                            <Button onClick={() => handleCompleteModule(module.id)} disabled={!quizAnswers[module.id]}>
                                Complete Module & Earn Badge
                            </Button>
                        )
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </>
  );
}


// --- Waste Sorting Game Component ---

const gameItems = [
    { item: 'Plastic Bottle', type: 'Dry Waste' },
    { item: 'Vegetable Peels', type: 'Wet Waste' },
    { item: 'Used Battery', type: 'Hazardous Waste' },
    { item: 'Newspaper', type: 'Dry Waste' },
    { item: 'Leftover Food', type: 'Wet Waste' },
    { item: 'Old Smartphone', type: 'Hazardous Waste' },
    { item: 'Glass Jar', type: 'Dry Waste' },
    { item: 'Egg Shells', type: 'Wet Waste' },
    { item: 'Expired Medicine', type: 'Hazardous Waste' },
    { item: 'Cardboard Box', type: 'Dry Waste' },
];

const binTypes = ['Dry Waste', 'Wet Waste', 'Hazardous Waste'] as const;

function WasteSortingGame({ onComplete, isCompleted }: { onComplete: () => void, isCompleted: boolean }) {
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);

    useEffect(() => {
        if (gameState !== 'playing' || timeLeft <= 0) return;
        const timerId = setInterval(() => {
            setTimeLeft(t => t - 1);
        }, 1000);
        return () => clearInterval(timerId);
    }, [gameState, timeLeft]);

    useEffect(() => {
        if (timeLeft === 0) {
            setGameState('finished');
        }
    }, [timeLeft]);

    const startGame = () => {
        setGameState('playing');
        setCurrentItemIndex(0);
        setScore(0);
        setTimeLeft(30);
    };

    const handleAnswer = (answer: typeof binTypes[number]) => {
        if (gameItems[currentItemIndex].type === answer) {
            setScore(s => s + 1);
        }
        if (currentItemIndex < gameItems.length - 1) {
            setCurrentItemIndex(i => i + 1);
        } else {
            setGameState('finished');
        }
    };
    
    if (isCompleted) {
        return null; // Don't show game if module is completed
    }

    if (gameState === 'idle') {
        return <Button onClick={startGame}><Gamepad2 className="mr-2" />Start Sorting Challenge</Button>;
    }
    
    if (gameState === 'finished') {
        const isWin = score >= 5;
        return (
            <div className="p-4 bg-muted/50 rounded-lg space-y-4 text-center">
                <h3 className="font-bold text-lg">Challenge Over!</h3>
                <p>You scored: <span className="font-bold text-primary">{score} / {gameItems.length}</span></p>
                {isWin ? (
                    <>
                        <p className="text-green-600">Great job! You passed the challenge.</p>
                        <Button onClick={onComplete}>Complete Module & Earn Badge</Button>
                    </>
                ) : (
                    <>
                        <p className="text-red-600">You need a score of 5 or more to pass. Try again!</p>
                        <Button onClick={startGame}>Play Again</Button>
                    </>
                )}
            </div>
        )
    }

    return (
        <div className="p-4 bg-muted/50 rounded-lg space-y-4">
            <div className="flex justify-between items-center font-mono">
                <div>Score: <span className="font-bold">{score}</span></div>
                <div className="flex items-center gap-2 text-red-500"><Timer/> <span className="font-bold">{timeLeft}s</span></div>
            </div>
            <div className="text-center bg-background p-6 rounded-md">
                <p className="text-muted-foreground">Which bin does this go in?</p>
                <p className="text-2xl font-bold my-2">{gameItems[currentItemIndex].item}</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" onClick={() => handleAnswer('Dry Waste')}>Dry Waste</Button>
                <Button variant="outline" onClick={() => handleAnswer('Wet Waste')}>Wet Waste</Button>
                <Button variant="outline" onClick={() => handleAnswer('Hazardous Waste')}>Hazardous</Button>
            </div>
        </div>
    )
}
