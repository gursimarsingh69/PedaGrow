import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ContentCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  variant?: "default" | "accent" | "muted";
  delay?: number;
  onClick?: () => void;
}

export function ContentCard({ 
  title, 
  description, 
  icon: Icon,
  variant = "default",
  delay = 0,
  onClick 
}: ContentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={onClick}
      className={cn(
        "p-6 rounded-2xl cursor-pointer transition-shadow duration-300",
        "border shadow-soft hover:shadow-card",
        variant === "default" && "bg-card border-border",
        variant === "accent" && "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20",
        variant === "muted" && "bg-muted border-muted-foreground/10"
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
        variant === "default" && "bg-secondary text-primary",
        variant === "accent" && "bg-primary text-primary-foreground",
        variant === "muted" && "bg-muted-foreground/10 text-muted-foreground"
      )}>
        <Icon className="w-6 h-6" />
      </div>
      
      <h3 className="font-display font-semibold text-lg text-card-foreground mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}