import { motion } from "framer-motion";
import { User, GraduationCap, BookOpen, Target, Sparkles } from "lucide-react";

interface ProfileData {
  name: string;
  class: string;
  curriculum: string;
  age: number;
  scopeOfInterest: string[];
}

interface ProfileCardProps {
  profile: ProfileData;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const profileFields = [
    { icon: GraduationCap, label: "Class", value: profile.class },
    { icon: BookOpen, label: "Curriculum", value: profile.curriculum },
    { icon: User, label: "Name", value: profile.name },
    { icon: Target, label: "Age", value: `${profile.age} years old` },
    { icon: Sparkles, label: "Scope of Interest", value: profile.scopeOfInterest.join(", ") },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="bg-card rounded-2xl border border-border p-6 shadow-card"
    >
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-glow">
          <User className="w-8 h-8 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-xl text-card-foreground">
            {profile.name}
          </h2>
          <p className="text-sm text-muted-foreground">Student Profile</p>
        </div>
      </div>

      <div className="space-y-4">
        {profileFields.map((field, index) => (
          <motion.div
            key={field.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
            className="flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
              <field.icon className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {field.label}
              </p>
              <p className="text-sm text-card-foreground mt-0.5 truncate">
                {field.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}