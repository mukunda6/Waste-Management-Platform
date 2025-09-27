
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Bot, Phone } from 'lucide-react';
import { Chatbot } from './chatbot';

export function CustomerCareButton() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            size="icon"
            className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
            aria-label="Open AI Assistant"
          >
            <Bot className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] md:max-w-2xl">
          <DialogHeader>
            <DialogTitle>AI Customer Assistant</DialogTitle>
          </DialogHeader>
          <Chatbot />
        </DialogContent>
      </Dialog>
    </>
  );
}
