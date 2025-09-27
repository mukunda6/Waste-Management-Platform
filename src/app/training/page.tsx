

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
import { useLanguage } from '@/hooks/use-language';

const modules = [
  {
    id: 'segregation',
    titleKey: 'training_module_segregation_title',
    descriptionKey: 'training_module_segregation_desc',
    contentKey: 'training_module_segregation_content',
    quiz: {
      questionKey: 'training_module_segregation_q',
      optionsKeys: ['training_module_segregation_o1', 'training_module_segregation_o2', 'training_module_segregation_o3'],
      answerKey: 'training_module_segregation_o2',
    },
    badge: { nameKey: 'training_badge_segregation', icon: <Star className="h-4 w-4" /> },
    points: 25,
  },
  {
    id: 'composting',
    titleKey: 'training_module_composting_title',
    descriptionKey: 'training_module_composting_desc',
    contentKey: 'training_module_composting_content',
    quiz: {
      questionKey: 'training_module_composting_q',
      optionsKeys: ['training_module_composting_o1', 'training_module_composting_o2', 'training_module_composting_o3'],
      answerKey: 'training_module_composting_o3',
    },
    badge: { nameKey: 'training_badge_composting', icon: <Recycle className="h-4 w-4" /> },
    points: 25,
  },
  {
    id: 'reuse',
    titleKey: 'training_module_reuse_title',
    descriptionKey: 'training_module_reuse_desc',
    contentKey: 'training_module_reuse_content',
    quiz: {
      questionKey: 'training_module_reuse_q',
      optionsKeys: ['training_module_reuse_o1', 'training_module_reuse_o2', 'training_module_reuse_o3'],
      answerKey: 'training_module_reuse_o1',
    },
    badge: { nameKey: 'training_badge_reuse', icon: <Lightbulb className="h-4 w-4" /> },
    points: 25,
  },
  {
    id: 'game',
    titleKey: 'training_module_game_title',
    descriptionKey: 'training_module_game_desc',
    contentKey: 'training_module_game_content',
    badge: { nameKey: 'training_badge_game', icon: <Gamepad2 className="h-4 w-4" /> },
    points: 50,
  },
];


export default function TrainingPage() {
  const { toast } = useToast();
  const { user, refreshUser } = useAuth();
  const { t } = useLanguage();
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
    
    if (module.quiz && quizAnswers[moduleId] !== t(module.quiz.answerKey)) {
      toast({
        variant: 'destructive',
        title: t('training_toast_incorrect_title'),
        description: t('training_toast_incorrect_desc'),
      });
      return;
    }

    if (!completedModules.includes(moduleId)) {
      const newCompleted = [...completedModules, moduleId];
      setCompletedModules(newCompleted);

      await updateUserScore(user.uid, module.points);
      await refreshUser();
      
      toast({
        title: t('training_toast_complete_title'),
        description: `${t('training_toast_complete_desc_1')} "${t(module.badge.nameKey)}" ${t('training_toast_complete_desc_2')} ${module.points} ${t('training_toast_complete_desc_3')}`,
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
            {t('training_hub_title')}
          </h1>
          <p className="text-muted-foreground">
            {t('training_hub_desc')}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('training_progress_title')}</CardTitle>
            <CardDescription>{t('training_progress_desc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Progress value={progress} className="w-full" />
              <span className="font-bold whitespace-nowrap">{Math.round(progress)}%</span>
            </div>
            {isAllCompleted && (
              <div className="p-4 bg-green-100 dark:bg-green-900/50 border border-green-300 dark:border-green-700 rounded-lg text-center">
                <Award className="mx-auto h-12 w-12 text-green-600 dark:text-green-400" />
                <h3 className="text-lg font-semibold mt-2 text-green-800 dark:text-green-200">{t('training_congrats_title')}</h3>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">{t('training_congrats_desc')}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('training_modules_title')}</CardTitle>
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
                      {t(module.titleKey)}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-6 pt-4">
                    <p className="text-muted-foreground">{t(module.contentKey)}</p>
                    
                    {module.quiz && (
                        <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                            <h4 className="font-semibold">{t('training_quiz_title')}</h4>
                            <p className="mb-2">{t(module.quiz.questionKey)}</p>
                            <RadioGroup onValueChange={(value) => handleQuizAnswer(module.id, value)} disabled={completedModules.includes(module.id)}>
                                {module.quiz.optionsKeys.map(optionKey => (
                                <div key={optionKey} className="flex items-center space-x-2">
                                    <RadioGroupItem value={t(optionKey)} id={`${module.id}-${optionKey}`} />
                                    <Label htmlFor={`${module.id}-${optionKey}`}>{t(optionKey)}</Label>
                                </div>
                                ))}
                            </RadioGroup>
                        </div>
                    )}
                    
                    {module.id === 'game' && <WasteSortingGame onComplete={() => handleCompleteModule('game')} isCompleted={completedModules.includes('game')} t={t} />}

                    {completedModules.includes(module.id) ? (
                        <div className="flex items-center justify-between p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                            <p className="text-sm font-medium text-green-700 dark:text-green-300">{t('training_module_completed')}</p>
                             <Badge variant="secondary" className="gap-1 bg-white">
                                {module.badge.icon}
                                {t(module.badge.nameKey)}
                            </Badge>
                        </div>
                    ) : (
                        module.quiz && (
                            <Button onClick={() => handleCompleteModule(module.id)} disabled={!quizAnswers[module.id]}>
                                {t('training_complete_module_button')}
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

function WasteSortingGame({ onComplete, isCompleted, t }: { onComplete: () => void, isCompleted: boolean, t: (key: string) => string }) {
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
        return <Button onClick={startGame}><Gamepad2 className="mr-2" />{t('training_game_start_button')}</Button>;
    }
    
    if (gameState === 'finished') {
        const isWin = score >= 5;
        return (
            <div className="p-4 bg-muted/50 rounded-lg space-y-4 text-center">
                <h3 className="font-bold text-lg">{t('training_game_over_title')}</h3>
                <p>{t('training_game_score')}: <span className="font-bold text-primary">{score} / {gameItems.length}</span></p>
                {isWin ? (
                    <>
                        <p className="text-green-600">{t('training_game_passed')}</p>
                        <Button onClick={onComplete}>{t('training_complete_module_button')}</Button>
                    </>
                ) : (
                    <>
                        <p className="text-red-600">{t('training_game_failed')}</p>
                        <Button onClick={startGame}>{t('training_game_play_again')}</Button>
                    </>
                )}
            </div>
        )
    }

    return (
        <div className="p-4 bg-muted/50 rounded-lg space-y-4">
            <div className="flex justify-between items-center font-mono">
                <div>{t('score')}: <span className="font-bold">{score}</span></div>
                <div className="flex items-center gap-2 text-red-500"><Timer/> <span className="font-bold">{timeLeft}s</span></div>
            </div>
            <div className="text-center bg-background p-6 rounded-md">
                <p className="text-muted-foreground">{t('training_game_item_question')}</p>
                <p className="text-2xl font-bold my-2">{gameItems[currentItemIndex].item}</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" onClick={() => handleAnswer('Dry Waste')}>{t('dry_waste')}</Button>
                <Button variant="outline" onClick={() => handleAnswer('Wet Waste')}>{t('wet_waste')}</Button>
                <Button variant="outline" onClick={() => handleAnswer('Hazardous Waste')}>{t('hazardous_waste')}</Button>
            </div>
        </div>
    )
}
