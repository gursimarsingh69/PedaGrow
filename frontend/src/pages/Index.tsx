import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { 
  MessageCircle, 
  FileText, 
  HelpCircle, 
  Users,
  ArrowRight,
  Zap
} from "lucide-react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ContentCard } from "@/components/dashboard/ContentCard";
import { ChatHistory } from "@/components/chat/ChatHistory";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getUserProfile } from "@/lib/user";
import { generateQuiz, submitQuiz, QuizResponse, QuizResult } from "@/lib/api";

const mockProfile = {
  name: "Alex Johnson",
  class: "Grade 10 - Section A",
  curriculum: "CBSE",
  age: 15,
  scopeOfInterest: ["Mathematics", "Physics", "Computer Science"],
};

const quickActions = [
  {
    title: "Start a Chat",
    description: "Get instant help with your studies using our AI assistant.",
    icon: MessageCircle,
    variant: "accent" as const,
  },
  {
    title: "Take a Quiz",
    description: "Test your knowledge with AI-generated quizzes.",
    icon: HelpCircle,
    variant: "default" as const,
  },
  {
    title: "Community",
    description: "Connect with fellow learners and share knowledge.",
    icon: Users,
    variant: "muted" as const,
  },
];

const Index = () => {
  const [activeItem, setActiveItem] = useState("#chat");
  const [quizDialogOpen, setQuizDialogOpen] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<QuizResponse | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [quizForm, setQuizForm] = useState({
    subject: "",
    class: "",
    curriculum: ""
  });
  const stored = getUserProfile();
  const userName = stored?.name ?? mockProfile.name;

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar activeItem={activeItem} onItemClick={setActiveItem} />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          <WelcomeHeader userName={mockProfile.name} />
          
          {/* Quick Actions Grid */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold text-foreground">
                Quick Actions
              </h2>
              <Button variant="ghost" size="sm" className="text-muted-foreground gap-1">
                View all
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <ContentCard
                  key={action.title}
                  title={action.title}
                  description={action.description}
                  icon={action.icon}
                  variant={action.variant}
                  delay={index * 0.1}
                  onClick={action.title === "Take a Quiz" ? () => setQuizDialogOpen(true) : undefined}
                />
              ))}
            </div>
          </section>

          {/* Quiz Section */}
          {currentQuiz && (
            <section className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Quiz: {quizForm.subject} ({quizForm.class})
                </h2>
                <Button variant="outline" onClick={() => setCurrentQuiz(null)}>
                  Close Quiz
                </Button>
              </div>
              
              {quizResult ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-primary to-primary-glow rounded-2xl p-6 text-primary-foreground shadow-glow"
                >
                  <h3 className="font-display text-2xl font-bold mb-4">Quiz Results</h3>
                  <p className="text-lg mb-2">Score: {quizResult.score} / {quizResult.total}</p>
                  <p className="text-lg mb-4">Percentage: {quizResult.percentage.toFixed(1)}%</p>
                  <p className="opacity-90">{quizResult.feedback}</p>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {currentQuiz.questions.map((question, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-card rounded-2xl p-6 border shadow-soft"
                    >
                      <h4 className="font-semibold text-lg mb-4">
                        Question {index + 1}: {question.question}
                      </h4>
                      <RadioGroup
                        value={quizAnswers[index]?.toString()}
                        onValueChange={(value) => {
                          const newAnswers = [...quizAnswers];
                          newAnswers[index] = parseInt(value);
                          setQuizAnswers(newAnswers);
                        }}
                      >
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <RadioGroupItem value={optionIndex.toString()} id={`q${index}-o${optionIndex}`} />
                            <Label htmlFor={`q${index}-o${optionIndex}`} className="cursor-pointer">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </motion.div>
                  ))}
                  
                  <div className="flex justify-center">
                    <Button
                      size="lg"
                      onClick={async () => {
                        try {
                          const result = await submitQuiz({
                            quiz_id: currentQuiz.quiz_id,
                            answers: quizAnswers
                          });
                          setQuizResult(result);
                        } catch (error) {
                          console.error("Failed to submit quiz:", error);
                          // TODO: Show error toast
                        }
                      }}
                      disabled={quizAnswers.includes(-1)}
                    >
                      Submit Quiz
                    </Button>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Quiz Dialog */}
          <Dialog open={quizDialogOpen} onOpenChange={setQuizDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate AI Quiz</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Mathematics, Physics, Chemistry"
                    value={quizForm.subject}
                    onChange={(e) => setQuizForm(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="class">Class/Grade</Label>
                  <Select value={quizForm.class} onValueChange={(value) => setQuizForm(prev => ({ ...prev, class: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your class" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i+1} value={`Grade ${i+1}`}>Grade {i+1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="curriculum">Curriculum</Label>
                  <Select value={quizForm.curriculum} onValueChange={(value) => setQuizForm(prev => ({ ...prev, curriculum: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your curriculum" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CBSE">CBSE</SelectItem>
                      <SelectItem value="ICSE">ICSE</SelectItem>
                      <SelectItem value="State Board">State Board</SelectItem>
                      <SelectItem value="IB">IB</SelectItem>
                      <SelectItem value="IGCSE">IGCSE</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={async () => {
                  try {
                    const quiz = await generateQuiz({
                      subject: quizForm.subject,
                      class_level: quizForm.class,
                      curriculum: quizForm.curriculum
                    });
                    setCurrentQuiz(quiz);
                    setQuizAnswers(new Array(quiz.questions.length).fill(-1));
                    setQuizResult(null);
                    setQuizDialogOpen(false);
                  } catch (error) {
                    console.error("Failed to generate quiz:", error);
                    // TODO: Show error toast
                  }
                }}>
                  Generate Quiz
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Chat History Section */}
          {activeItem === "#history" && (
            <section id="history" className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-semibold text-foreground">Chat History</h2>
              </div>
              <div className="max-w-7xl">
                <Suspense fallback={<div>Loading history...</div>}>
                  <ChatHistory />
                </Suspense>
              </div>
            </section>
          )}
          
          {/* Stats & Profile Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="lg:col-span-2 bg-gradient-to-br from-primary to-primary-glow rounded-2xl p-6 text-primary-foreground shadow-glow"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="font-display text-2xl font-bold mb-2">
                    Your Learning Progress
                  </h3>
                  <p className="opacity-90">Keep up the great work!</p>
                </div>
                <div className="w-12 h-12 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary-foreground/10 rounded-xl p-4">
                  <p className="text-3xl font-bold">28</p>
                  <p className="text-sm opacity-80">Quizzes</p>
                </div>
                <div className="bg-primary-foreground/10 rounded-xl p-4">
                  <p className="text-3xl font-bold">156</p>
                  <p className="text-sm opacity-80">Chat Sessions</p>
                </div>
              </div>
            </motion.div>
            
            {/* Profile Card */}
            <ProfileCard profile={mockProfile} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;