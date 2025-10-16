'use client'

import { useRef, useEffect } from 'react'
import { Smile, Paperclip, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  value: string
  onChange: (val: string) => void
  onSend: () => void
}

export default function ChatInput({ value, onChange, onSend }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto resize tinggi textarea
  useEffect(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = Math.min(el.scrollHeight, 150) + 'px'
      el.style.overflowY = el.scrollHeight > 150 ? 'auto' : 'hidden'
    }
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="relative border-t border-secondary p-2 w-full overflow-hidden">
      <div className="flex items-end gap-2 max-w-4xl mx-auto">
        {/* Emoji picker (belum dihubungkan) */}
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Smile size={22} />
        </button>

        {/* Tombol lampiran */}
        <label
          htmlFor="file-upload"
          className="p-2 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <Paperclip size={22} />
        </label>
        <input id="file-upload" type="file" hidden />

        {/* Textarea adaptif */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tulis pesan..."
          rows={1}
          spellCheck={false}
          autoComplete="off"
          className="flex-1 resize-none overflow-y-auto max-h-[150px] rounded-xl border border-input bg-card p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {/* Tombol kirim */}
        <AnimatePresence>
          {value.trim() && (
            <motion.button
              key="send-btn"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'tween', stiffness: 250, damping: 15 }}
              onClick={onSend}
              className={cn(
                'flex items-center justify-center rounded-full p-2 transition-colors',
                'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
            >
              <Send size={20} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
