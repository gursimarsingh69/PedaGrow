import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface WelcomeHeaderProps {
  userName: string;
}

export function WelcomeHeader({ userName }: WelcomeHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex items-center gap-3 mb-2">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <Sparkles className="w-6 h-6 text-accent" />
        </motion.div>
        <span className="text-sm font-medium text-accent">Welcome back</span>
      </div>
      
      <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
        Hello, {userName}!
      </h1>
      
      <p className="text-muted-foreground max-w-xl">
        Ready to continue your learning journey? Explore AI-powered quizzes, 
        and connect with your community.
      </p>
    </motion.div>
  );
}