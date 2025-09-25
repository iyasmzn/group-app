"use client";

import { useRef, useEffect } from "react";
import { Smile, Paperclip, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
}

export default function ChatInput({ value, onChange, onSend }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto resize tinggi textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 150) + "px"; // max 150px
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 border-t bg-background">
      <div className="flex items-end gap-2 max-w-4xl mx-auto">
        {/* Tombol emoji */}
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Smile size={22} />
        </button>

        {/* Tombol lampiran */}
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Paperclip size={22} />
        </button>

        {/* Textarea adaptif */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tulis pesan..."
          rows={1}
          className="flex-1 resize-none overflow-y-auto max-h-[150px] rounded-lg border border-input bg-card p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          style={{ overflowY: "auto" }} // pastikan auto, bukan scroll
        />

        {/* Tombol kirim dengan animasi */}
        <AnimatePresence>
          {value.trim() && (
            <motion.button
              key="send-btn"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              onClick={onSend}
              className={cn(
                "flex items-center justify-center rounded-full p-2 transition-colors",
                "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              <Send size={20} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}