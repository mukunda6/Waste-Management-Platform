
'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {chat, ChatInput} from '@/ai/flows/chatbot-flow';
import {useAuth} from '@/hooks/use-auth';
import {Message, Part} from 'genkit';
import {ScrollArea} from './ui/scroll-area';
import {Bot, User, Loader2} from 'lucide-react';
import {cn} from '@/lib/utils';

export function Chatbot() {
  const {user} = useAuth();
  const [history, setHistory] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    const userMessage: Message = {
      role: 'user',
      content: [{text: prompt}],
    };
    const newHistory = [...history, userMessage];
    setHistory(newHistory);
    setPrompt('');
    try {
      const result = await chat({
        history: newHistory,
        prompt: prompt,
      } as ChatInput);

      const modelMessage: Message = {
        role: 'model',
        content: [{text: result}],
      };

      setHistory([...newHistory, modelMessage]);
    } catch (e: any) {
      const modelMessage: Message = {
        role: 'model',
        content: [{text: `Error: ${e.message}`}],
      };
      setHistory([...newHistory, modelMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = (content: Part[]) => {
    return content.map((part, index) => {
      if (part.text) {
        return (
          <p key={index} className="whitespace-pre-wrap">
            {part.text}
          </p>
        );
      }
      return null;
    });
  };

  return (
    <div className="flex flex-col h-[60vh]">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {history.map((msg, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-3',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {msg.role === 'model' && (
                <div className="p-2 bg-muted rounded-full">
                  <Bot className="w-5 h-5" />
                </div>
              )}
              <div
                className={cn(
                  'p-3 rounded-lg max-w-sm',
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                {renderContent(msg.content)}
              </div>
              {msg.role === 'user' && (
                <div className="p-2 bg-muted rounded-full">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-muted rounded-full">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-3 rounded-lg bg-muted flex items-center">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Ask a question..."
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            disabled={loading}
          />
          <Button onClick={handleSend} disabled={loading || !prompt}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
