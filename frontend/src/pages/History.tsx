import { useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ChatHistory } from "@/components/chat/ChatHistory";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";

const History = () => {
  const [activeItem, setActiveItem] = useState("/history");

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar activeItem={activeItem} onItemClick={setActiveItem} />
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          <WelcomeHeader userName="User" />

          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold text-foreground">Chat History</h2>
            </div>
            <div className="max-w-7xl">
              <ChatHistory />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default History;