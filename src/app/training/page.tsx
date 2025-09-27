
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
import { GraduationCap, Award, Recycle, CheckCircle, Lightbulb, Star, Trash2, AppleIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Confetti from 'react-confetti';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProps } from 'react-beautiful-dnd';
import { cn } from '@/lib/utils';


// Helper to reorder lists
const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

// Helper to move items between lists
const move = (source: any[], destination: any[], droppableSource: any, droppableDestination: any) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);
  destClone.splice(droppableDestination.index, 0, removed);
  return { [droppableSource.droppableId]: sourceClone, [droppableDestination.droppableId]: destClone };
};

const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
    const [enabled, setEnabled] = useState(false);
    useEffect(() => {
        const animation = requestAnimationFrame(() => setEnabled(true));
        return () => {
            cancelAnimationFrame(animation);
            setEnabled(false);
        };
    }, []);
    if (!enabled) {
        return null;
    }
    return <Droppable {...props}>{children}</Droppable>;
};


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
  },
];


const initialItems = [
    { id: 'item-1', content: 'Plastic Bottle', type: 'Dry Waste', emoji: '🍾' },
    { id: 'item-2', content: 'Apple Core', type: 'Wet Waste', emoji: '🍎' },
    { id: 'item-3', content: 'Newspaper', type: 'Dry Waste', emoji: '📰'},
    { id: 'item-4', content: 'Banana Peel', type: 'Wet Waste', emoji: '🍌' },
]


export default function TrainingPage() {
  const { toast } = useToast();
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [showConfetti, setShowConfetti] = useState(false);
  
  const [gameState, setGameState] = useState({
    items: initialItems,
    'Dry Waste': [] as any[],
    'Wet Waste': [] as any[],
  });

  const progress = (completedModules.length / modules.length) * 100;
  const isAllCompleted = completedModules.length === modules.length;
  
  const isGameWon = gameState.items.length === 0 && gameState['Dry Waste'].length + gameState['Wet Waste'].length === initialItems.length;

  const handleQuizAnswer = (moduleId: string, answer: string) => {
    setQuizAnswers(prev => ({ ...prev, [moduleId]: answer }));
  };

  const handleCompleteModule = (moduleId: string) => {
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
  
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const sourceId = source.droppableId;
    const destId = destination.droppableId;
    
    const item = gameState[sourceId as keyof typeof gameState][source.index];

    if (sourceId === destId) {
       if (sourceId !== 'items') return;
       const items = reorder(gameState.items, source.index, destination.index);
       setGameState(prev => ({ ...prev, items }));
    } else {
        if(destId === item.type) {
            toast({
                title: "Correct!",
                description: `A ${item.content} is ${item.type}.`,
            });
            const result = move(gameState[sourceId as keyof typeof gameState], gameState[destId as keyof typeof gameState], source, destination);
            setGameState(prev => ({
                ...prev,
                [sourceId]: result[sourceId as keyof typeof result],
                [destId]: result[destId as keyof typeof result],
            }));
        } else {
             toast({
                variant: 'destructive',
                title: "Incorrect!",
                description: `A ${item.content} should go in the ${item.type} bin.`,
            });
        }
    }
  };
  
  const resetGame = () => {
    setGameState({
        items: initialItems,
        'Dry Waste': [],
        'Wet Waste': [],
    });
  }

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
                <CardTitle>Segregation Challenge</CardTitle>
                <CardDescription>Drag and drop the items into the correct waste bins to test your knowledge.</CardDescription>
            </CardHeader>
            <CardContent>
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StrictModeDroppable droppableId="items">
                            {(provided, snapshot) => (
                                <Card
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={cn("p-4 bg-muted/50 min-h-[200px]", snapshot.isDraggingOver && "bg-muted")}
                                >
                                    <CardTitle className="text-lg text-center mb-4">Items to Sort</CardTitle>
                                    <div className="space-y-2">
                                        {gameState.items.map((item, index) => (
                                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="p-3 bg-card rounded-md shadow-sm flex items-center justify-center text-3xl"
                                                    >
                                                       {item.emoji}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                        {gameState.items.length === 0 && !isGameWon && (
                                            <div className="text-center text-muted-foreground p-4">Drop items here</div>
                                        )}
                                         {isGameWon && (
                                             <div className="text-center p-4">
                                                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                                                <p className="mt-2 font-semibold">Challenge Complete!</p>
                                                <Button size="sm" variant="outline" onClick={resetGame} className="mt-2">Play Again</Button>
                                             </div>
                                         )}
                                    </div>
                                </Card>
                            )}
                        </StrictModeDroppable>
                         <StrictModeDroppable droppableId="Dry Waste">
                            {(provided, snapshot) => (
                               <Card
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={cn("p-4 bg-blue-100/50 dark:bg-blue-900/20 border-blue-500 min-h-[200px]", snapshot.isDraggingOver && "bg-blue-200/50")}
                                >
                                     <CardTitle className="text-lg text-center mb-4 text-blue-800 dark:text-blue-300 flex items-center justify-center gap-2">
                                        <Recycle /> Dry Waste
                                    </CardTitle>
                                     <div className="space-y-2">
                                       {gameState['Dry Waste'].map((item, index) => (
                                            <div key={item.id} className="p-3 bg-card rounded-md shadow-sm flex items-center justify-center text-3xl">
                                                {item.emoji}
                                            </div>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                </Card>
                            )}
                        </StrictModeDroppable>
                         <StrictModeDroppable droppableId="Wet Waste">
                            {(provided, snapshot) => (
                               <Card
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={cn("p-4 bg-green-100/50 dark:bg-green-900/20 border-green-500 min-h-[200px]", snapshot.isDraggingOver && "bg-green-200/50")}
                                >
                                     <CardTitle className="text-lg text-center mb-4 text-green-800 dark:text-green-300 flex items-center justify-center gap-2">
                                        <AppleIcon /> Wet Waste
                                    </CardTitle>
                                     <div className="space-y-2">
                                        {gameState['Wet Waste'].map((item, index) => (
                                             <div key={item.id} className="p-3 bg-card rounded-md shadow-sm flex items-center justify-center text-3xl">
                                                {item.emoji}
                                            </div>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                </Card>
                            )}
                        </StrictModeDroppable>
                    </div>
                </DragDropContext>
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
                    
                    <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                      <h4 className="font-semibold">Mini Quiz</h4>
                      {module.quiz && (
                        <>
                            <p className="mb-2">{module.quiz.question}</p>
                            <RadioGroup onValueChange={(value) => handleQuizAnswer(module.id, value)} disabled={completedModules.includes(module.id)}>
                                {module.quiz.options.map(option => (
                                <div key={option} className="flex items-center space-x-2">
                                    <RadioGroupItem value={option} id={`${module.id}-${option}`} />
                                    <Label htmlFor={`${module.id}-${option}`}>{option}</Label>
                                </div>
                                ))}
                            </RadioGroup>
                        </>
                      )}
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
