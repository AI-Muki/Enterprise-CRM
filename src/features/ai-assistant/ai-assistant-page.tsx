import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Paperclip, Mic, ArrowUp, Bot, User, Zap, TrendingUp, Mail } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hi Alex! I'm your Nexus AI assistant. I can help you analyze your pipeline, draft emails, summarize contacts, and suggest next steps. What would you like to do?",
    timestamp: 'Just now',
  },
];

const suggestions = [
  { icon: TrendingUp, label: 'Summarize my pipeline', prompt: 'Give me a summary of my current sales pipeline' },
  { icon: Mail, label: 'Draft a follow-up email', prompt: 'Draft a follow-up email to Acme Corp about the Enterprise deal' },
  { icon: Zap, label: 'Suggest next steps', prompt: 'What should I focus on today based on my deals?' },
  { icon: TrendingUp, label: 'Show deals closing this week', prompt: 'Show me all deals closing this week over $10,000' },
];

export function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (text?: string) => {
    const content = text || input;
    if (!content.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: 'Just now',
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I've analyzed your data and here's what I found: You have 124 active deals worth $2.49M in your pipeline. 8 deals are closing this month, with your top opportunity being Wayne Ent. — Enterprise Suite at $62K. I'd recommend focusing on the 3 deals in Negotiation stage, as they have a 75% probability of closing. Would you like me to draft follow-up emails for any of these?",
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div>
      <PageHeader
        title="AI Assistant"
        description="Your AI-powered sales copilot — analyze, draft, and strategize"
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
        {/* Chat */}
        <Card className="animate-fade-in-up flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
          <CardContent className="flex flex-1 flex-col p-0">
            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex gap-3 animate-fade-in-up',
                    msg.role === 'user' && 'flex-row-reverse'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                      msg.role === 'assistant'
                        ? 'bg-gradient-to-br from-primary-600 to-primary-400 text-white'
                        : 'bg-secondary text-foreground'
                    )}
                  >
                    {msg.role === 'assistant' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>
                  <div className={cn('max-w-[80%] rounded-2xl px-4 py-3', msg.role === 'assistant' ? 'bg-secondary text-foreground' : 'bg-primary text-primary-foreground')}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <p className={cn('mt-1.5 text-xs', msg.role === 'assistant' ? 'text-muted-foreground' : 'text-primary-foreground/70')}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 animate-fade-in">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-400 text-white">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl bg-secondary px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-border p-4">
              <div className="flex items-end gap-2 rounded-xl border border-border bg-background p-2 focus-within:ring-2 focus-within:ring-ring transition-all">
                <button className="rounded-lg p-2 text-muted-foreground hover:bg-secondary transition-colors">
                  <Paperclip className="h-4 w-4" />
                </button>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask anything about your CRM..."
                  rows={1}
                  className="flex-1 resize-none bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
                  style={{ maxHeight: '120px' }}
                />
                <button className="rounded-lg p-2 text-muted-foreground hover:bg-secondary transition-colors">
                  <Mic className="h-4 w-4" />
                </button>
                <Button
                  size="icon"
                  onClick={() => handleSend()}
                  disabled={!input.trim() && !isTyping}
                  className="h-9 w-9"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                AI can make mistakes. Verify important information.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Suggestions sidebar */}
        <div className="space-y-3">
          <Card className="animate-fade-in-up animate-delay-100">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold">Quick Actions</p>
              </div>
              <div className="space-y-2">
                {suggestions.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSend(s.prompt)}
                      className="group flex w-full items-center gap-2.5 rounded-lg border border-border p-2.5 text-left transition-all hover:border-primary/30 hover:bg-primary/5"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs font-medium">{s.label}</span>
                      <ArrowUp className="ml-auto h-3 w-3 rotate-45 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up animate-delay-200">
            <CardContent className="p-4">
              <p className="mb-2 text-sm font-semibold">Conversation History</p>
              <div className="space-y-1">
                {['Pipeline analysis — Jul 21', 'Email draft — Jul 20', 'Q3 forecast — Jul 18', 'Lead scoring — Jul 15'].map((conv, i) => (
                  <button key={i} className="block w-full truncate rounded-lg px-2 py-1.5 text-left text-xs text-muted-foreground hover:bg-secondary transition-colors">
                    {conv}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
