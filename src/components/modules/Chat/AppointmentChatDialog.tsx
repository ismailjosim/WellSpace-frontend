"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Loader2, User, Stethoscope } from "lucide-react";
import {
  getChatRoom,
  sendChatMessage,
  markChatAsRead,
} from "@/services/chat/chat.service";
import { toast } from "sonner";

interface AppointmentChatDialogProps {
  appointmentId: string;
  counterpartName: string;
  role: "PATIENT" | "DOCTOR";
}

interface IChatMessage {
  id: string;
  senderRole: string;
  senderName?: string | null;
  content: string;
  createdAt: string;
  attachment?: string | null;
  fileType?: string | null;
  isRead?: boolean;
}

export default function AppointmentChatDialog({
  appointmentId,
  counterpartName,
  role,
}: AppointmentChatDialogProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    let isMounted = true;
    const fetchChat = async () => {
      const res = await getChatRoom(appointmentId);
      if (isMounted && res.success && res.data?.chatRoom?.messages) {
        setMessages(res.data.chatRoom.messages);
        markChatAsRead(appointmentId);
      }
      if (isMounted) {
        setLoading(false);
      }
    };

    fetchChat();
    const interval = setInterval(fetchChat, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [open, appointmentId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText.trim();
    setInputText("");
    setSending(true);

    const tempMessage: IChatMessage = {
      id: `temp-${Date.now()}`,
      senderRole: role,
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      const res = await sendChatMessage(appointmentId, { content: text });
      if (!res.success) {
        toast.error(res.message || "Failed to send message");
      }
    } catch {
      toast.error("Failed to deliver message");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          <span>Chat ({counterpartName})</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md h-[550px] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            {role === "PATIENT" ? (
              <Stethoscope className="h-5 w-5 text-primary" />
            ) : (
              <User className="h-5 w-5 text-primary" />
            )}
            <span>Consultation Chat: {counterpartName}</span>
          </DialogTitle>
        </DialogHeader>

        {/* Message Thread Body */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20"
        >
          {loading && messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Loading conversation...
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground text-xs p-6 space-y-1">
              <MessageSquare className="h-8 w-8 text-muted-foreground/40 mb-1" />
              <p className="font-medium text-foreground">No messages yet</p>
              <p>
                Say hello or share clinical details about your consultation.
              </p>
            </div>
          ) : (
            messages.map((msg, i) => {
              const isMine = msg.senderRole === role;
              return (
                <div
                  key={msg.id || i}
                  className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                >
                  <span className="text-[10px] text-muted-foreground mb-0.5 px-1">
                    {msg.senderName || (isMine ? "You" : counterpartName)}
                  </span>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                      isMine
                        ? "bg-primary text-primary-foreground rounded-br-xs"
                        : "bg-card border text-card-foreground rounded-bl-xs shadow-2xs"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[9px] text-muted-foreground/80 mt-0.5 px-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Send Input Footer */}
        <form onSubmit={handleSend} className="p-3 border-t bg-card flex gap-2">
          <Input
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={sending}
            className="flex-1 text-sm"
          />
          <Button
            type="submit"
            size="icon"
            disabled={sending || !inputText.trim()}
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
