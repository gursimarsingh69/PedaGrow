import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Send, Bot, User, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { sendChatMessage, type ChatMessage as APIChatMessage } from "@/lib/api";
import { saveConversation, getAndClearRestore } from "@/lib/chatHistory";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your PedaGrow AI assistant. How can I help you with your studies today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when panel is opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // When opening the chat panel, check if a conversation was saved to be restored
  useEffect(() => {
    const restore = getAndClearRestore();
    if (restore) {
      setConversationId(restore.id);
      setMessages(
        restore.messages.map((m, i) => ({
          id: `${restore.id}-${i}`,
          role: m.role as "user" | "assistant",
          content: m.content,
          sources: m.sources,
        }))
      );

      // ensure scroll & focus
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        inputRef.current?.focus();
      }, 60);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Ensure we have a stable conversation id for storing history
    const convId = conversationId ?? `local-${Date.now()}`;
    if (!conversationId) setConversationId(convId);

    // Helper: save after message changes
    const saveIfReady = (msgs: Message[], id = convId) => {
      const userCount = msgs.filter((m) => m.role === "user").length;
      if (userCount === 0) return; // don't save empty/bot-only greeting
      const title = msgs.find((m) => m.role === "user")?.content?.slice(0, 120) ?? "Conversation";
      saveConversation({
        id,
        title,
        messages: msgs.map((m) => ({ role: m.role, content: m.content, sources: m.sources })),
        updatedAt: new Date().toISOString(),
      });
    };

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

setMessages((prev) => {
        const next = [...prev, userMessage];
        saveIfReady(next);
        return next;
      });
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      // Convert messages to API format (excluding the current user message)
      const history: APIChatMessage[] = messages
        .slice(1) // Skip the initial greeting
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      // Call the backend API
      const response = await sendChatMessage(
        userMessage.content,
        conversationId,
        history.length > 0 ? history : undefined
      );

      // Update conversation ID if provided
      if (response.conversation_id) {
        setConversationId(response.conversation_id);
      }

      // Add AI response to messages
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.response,
        sources: response.sources,
      };

      setMessages((prev) => {
        const next = [...prev, aiMessage];
        saveIfReady(next, conversationId ?? convId);
        return next;
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to get response. Please check if the backend is running.";
      setError(errorMessage);

      // Add error message to chat
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Sorry, I encountered an error: ${errorMessage}. Please make sure the backend server is running at http://localhost:8000`,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-y-0 right-0 w-full sm:w-[1740  px] bg-card border-1 border-border shadow-xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">PedaGrow Chat</h2>
            <p className="text-xs text-muted-foreground">AI Learning Assistant</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-3",
              message.role === "user" && "flex-row-reverse"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                message.role === "assistant"
                  ? "bg-primary/10 text-primary"
                  : "bg-accent text-accent-foreground"
              )}
            >
              {message.role === "assistant" ? (
                <Bot className="w-4 h-4" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2.5",
                message.role === "assistant"
                  ? "bg-muted text-foreground rounded-tl-sm"
                  : "bg-primary text-primary-foreground rounded-tr-sm"
              )}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              {message.sources && message.sources.length > 0 && (
                <div className="mt-2 pt-2 border-t border-border/50">
                  <p className="text-xs text-muted-foreground">
                    Sources: {message.sources.join(", ")}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="max-w-[80%] rounded-2xl px-4 py-2.5 bg-muted text-foreground rounded-tl-sm">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <p className="text-sm text-muted-foreground">Thinking...</p>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-2.5 rounded-full bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}