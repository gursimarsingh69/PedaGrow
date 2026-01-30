import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  MessageCircle, 
  History, 
  User, 
  Users, 
  FileText, 
  HelpCircle,
  Menu,
  X,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ChatPanel } from "@/components/chat/ChatPanel";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  isChat?: boolean;
}

const navItems: NavItem[] = [
  { icon: MessageCircle, label: "Chat", href: "#chat", isChat: true },
  { icon: History, label: "Chat History", href: "/history" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Users, label: "Community", href: "#community" },
  { icon: HelpCircle, label: "AI Generated Quizzes", href: "#quizzes" },
];

interface AppSidebarProps {
  activeItem: string;
  onItemClick: (href: string) => void;
}

export function AppSidebar({ activeItem, onItemClick }: AppSidebarProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Listen for external requests to open the chat panel (e.g., restore action)
  useEffect(() => {
    const handler = (e: Event) => {
      // if needed, we could read (e as CustomEvent).detail
      setIsChatOpen(true);
    };
    window.addEventListener("pedagrow:open-chat", handler as EventListener);
    return () => window.removeEventListener("pedagrow:open-chat", handler as EventListener);
  }, []);

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-sidebar text-sidebar-foreground shadow-md"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Backdrop for mobile when open */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setIsMobileOpen(false)} />
      )}

    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "h-screen bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 shadow-card",
        isMobileOpen ? "fixed inset-y-0 left-0 z-50 w-64" : "hidden md:flex w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <span className="font-display font-semibold text-lg">PedaGrow AI</span>
        </motion.div>
        <button onClick={() => setIsMobileOpen(false)} className="md:hidden p-2 rounded-lg hover:bg-sidebar-accent" aria-label="Close sidebar">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item, index) => {
          const isActive = activeItem === item.href || location.pathname === item.href;

          return (
            <motion.button
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              onClick={() => {
                if (item.isChat) {
                  setIsChatOpen(true);
                } else if (item.href.startsWith("/")) {
                  navigate(item.href);
                } else {
                  onItemClick(item.href);
                }
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                "hover:bg-sidebar-accent group",
                isActive && "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110",
                isActive && "drop-shadow-sm"
              )} />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-medium whitespace-nowrap overflow-hidden"
              >
                {item.label}
              </motion.span>
            </motion.button>
          );
        })}
      </nav>

      {/* Theme Toggle & Footer */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        <ThemeToggle collapsed={false} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-sidebar-foreground/60 px-3 pt-2"
        >
          <p>© 2024 PedaGrow AI</p>
        </motion.div>
      </div>

      {/* Chat Panel */}
      <motion.div>
        {isChatOpen && (
          <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        )}
      </motion.div>
    </motion.aside>
    </>
  );
}