import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Trash2, ArrowRight, Eye, Download, Edit3, Check, X } from "lucide-react";
import {
  loadConversations,
  deleteConversation,
  clearConversations,
  setRestoreConversation,
  saveConversation,
  Conversation,
} from "@/lib/chatHistory";

export function ChatHistory() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);

  // Rename state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");

  useEffect(() => {
    setConversations(loadConversations());
  }, []);

  const refresh = () => setConversations(loadConversations());

  const handleDelete = (id: string) => {
    deleteConversation(id);
    refresh();
    if (selected?.id === id) setSelected(null);
  };

  const handleClearAll = () => {
    if (!confirm("Clear all chat history?")) return;
    clearConversations();
    refresh();
    setSelected(null);
  };

  const handleRestore = (conv: Conversation) => {
    setRestoreConversation(conv);
    // Dispatch event so sidebar opens the Chat panel immediately
    window.dispatchEvent(new CustomEvent("pedagrow:open-chat", { detail: { id: conv.id } }));
    // Small confirmation
    alert("Conversation restored and Chat panel opened.");
  };

  const handleRenameStart = (conv: Conversation) => {
    setEditingId(conv.id);
    setEditingValue(conv.title || "");
  };

  const handleRenameSave = (conv: Conversation) => {
    const updated: Conversation = { ...conv, title: editingValue, updatedAt: new Date().toISOString() };
    saveConversation(updated);
    refresh();
    setEditingId(null);
    setEditingValue("");
    if (selected?.id === conv.id) setSelected(updated);
  };

  const handleRenameCancel = () => {
    setEditingId(null);
    setEditingValue("");
  };

  const handleExport = (conv: Conversation) => {
    const blob = new Blob([JSON.stringify(conv, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pedagrow-conversation-${conv.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Chat History</h3>
        <div className="flex items-center gap-2">
          <button className="text-sm text-destructive hover:underline" onClick={handleClearAll}>
            Clear All
          </button>
        </div>
      </div>

      {conversations.length === 0 ? (
        <p className="text-sm text-muted-foreground">No chat history yet. Start a conversation to save it here.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            {conversations.map((conv) => (
              <div key={conv.id} className="p-3 rounded-lg border border-border mb-3 flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      {editingId === conv.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            className="px-2 py-1 border rounded w-full"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                          />
                          <button className="p-2 rounded hover:bg-muted" onClick={() => handleRenameSave(conv)} title="Save">
                            <Check className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded hover:bg-muted text-destructive" onClick={handleRenameCancel} title="Cancel">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className="font-medium">{conv.title || "Conversation"}</p>
                          <p className="text-xs text-muted-foreground">{conv.messages.length} messages • {format(new Date(conv.updatedAt), "PP p")}</p>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button title="View" className="p-2 rounded hover:bg-muted" onClick={() => setSelected(conv)}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button title="Restore in Chat" className="p-2 rounded hover:bg-muted" onClick={() => handleRestore(conv)}>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button title="Export" className="p-2 rounded hover:bg-muted" onClick={() => handleExport(conv)}>
                        <Download className="w-4 h-4" />
                      </button>
                      <button title="Rename" className="p-2 rounded hover:bg-muted" onClick={() => handleRenameStart(conv)}>
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button title="Delete" className="p-2 rounded hover:bg-muted text-destructive" onClick={() => handleDelete(conv.id)}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            {selected ? (
              <div className="p-4 rounded-lg border border-border bg-muted">
                <div className="mb-3">
                  <p className="font-semibold">{selected.title}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(selected.updatedAt), "PPpp")}</p>
                </div>
                <div className="space-y-3 max-h-[60vh] overflow-auto">
                  {selected.messages.map((msg, idx) => (
                    <div key={idx} className={`p-3 rounded ${msg.role === "assistant" ? "bg-card" : "bg-primary text-primary-foreground"}`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      {msg.sources && msg.sources.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-2">Sources: {msg.sources.join(", ")}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Select a conversation to view its messages.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
