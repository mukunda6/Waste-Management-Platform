
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
import { Phone } from 'lucide-react';
import { Chatbot } from './chatbot';

export function CallSystemButton() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            size="icon"
            className="fixed bottom-40 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
            aria-label="Open AI Assistant"
          >
            <Phone className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] md:max-w-2xl">
          <DialogHeader>
            <DialogTitle>AI Call Assistant</DialogTitle>
          </DialogHeader>
          <p className="text-center p-4">Calling feature coming soon!</p>
        </DialogContent>
      </Dialog>
    </>
  );
}
