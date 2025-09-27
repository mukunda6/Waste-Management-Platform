
'use client';

import { useState } from 'react';
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
import Image from 'next/image';
import { GraduationCap, Award, Recycle, CheckCircle, Lightbulb, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Confetti from 'react-confetti';

const modules = [
  {
    id: 'segregation',
    title: 'Waste Segregation 101',
    description: 'Learn to separate waste into Dry, Wet, and Hazardous categories.',
    content: 'Properly separating waste at its source is the most critical step in effective waste management. This simple habit prevents recyclable materials from being contaminated and reduces the amount of waste sent to landfills.',
    image: 'https://picsum.photos/seed/segregation/600/400',
    imageHint: 'waste segregation bins',
    quiz: {
      question: 'Which bin should a used plastic bottle go into?',
      options: ['Wet Waste', 'Dry Waste', 'Hazardous Waste'],
      answer: 'Dry Waste',
    },
    badge: { name: 'Segregation Star', icon: <Star className="h-4 w-4" /> },
  },
  {
    id: 'composting',
    title: 'Composting at Home',
    description: 'Turn your kitchen scraps into valuable compost for your plants.',
    content: 'Composting is a natural process that recycles organic matter like leaves and food scraps into a rich soil amendment. It reduces landfill waste, enriches soil, and helps retain moisture.',
    image: 'https://picsum.photos/seed/compost/600/400',
    imageHint: 'compost bin',
    quiz: {
      question: 'Which of these should NOT be composted at home?',
      options: ['Fruit Peels', 'Egg Shells', 'Meat & Dairy'],
      answer: 'Meat & Dairy',
    },
    badge: { name: 'Compost Champ', icon: <Recycle className="h-4 w-4" /> },
  },
  {
    id: 'reuse',
    title: 'Creative Plastic Reuse',
    description: 'Discover fun DIY projects to give plastic waste a new life.',
    content: 'Before recycling, consider reusing! Many single-use plastic items can be transformed into useful objects for your home, such as planters, organizers, or even art. This reduces the demand for new plastic production.',
    image: 'https://picsum.photos/seed/reuse/600/400',
    imageHint: 'plastic bottle planter',
    quiz: {
      question: 'What is a common DIY project for a plastic bottle?',
      options: ['Bird Feeder', 'Cooking Pot', 'Light Bulb'],
      answer: 'Bird Feeder',
    },
    badge: { name: 'Reuse Rockstar', icon: <Lightbulb className="h-4 w-4" /> },
  },
];

export default function TrainingPage() {
  const { toast } = useToast();
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [showConfetti, setShowConfetti] = useState(false);

  const progress = (completedModules.length / modules.length) * 100;
  const isAllCompleted = completedModules.length === modules.length;

  const handleQuizAnswer = (moduleId: string, answer: string) => {
    setQuizAnswers(prev => ({ ...prev, [moduleId]: answer }));
  };

  const handleCompleteModule = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;

    if (quizAnswers[moduleId] !== module.quiz.answer) {
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
      toast({
        title: 'Module Completed!',
        description: `You've earned the "${module.badge.name}" badge and 25 coins!`,
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
                    <div className="grid md:grid-cols-2 gap-6 items-center">
                        <div>
                            <p className="text-muted-foreground">{module.content}</p>
                        </div>
                        <div className="relative aspect-video">
                            <Image
                            src={module.image}
                            alt={module.title}
                            fill
                            className="rounded-lg object-cover"
                            data-ai-hint={module.imageHint}
                            />
                        </div>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-3">Mini Quiz</h4>
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

                    {completedModules.includes(module.id) ? (
                        <div className="flex items-center justify-between p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                            <p className="text-sm font-medium text-green-700 dark:text-green-300">Module Completed!</p>
                             <Badge variant="secondary" className="gap-1 bg-white">
                                {module.badge.icon}
                                {module.badge.name}
                            </Badge>
                        </div>
                    ) : (
                        <Button onClick={() => handleCompleteModule(module.id)} disabled={!quizAnswers[module.id]}>
                            Complete Module & Earn Badge
                        </Button>
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
