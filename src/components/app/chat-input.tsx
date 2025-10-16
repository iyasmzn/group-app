'use client'

import { useRef, useEffect, useState } from 'react'
import { Smile, Paperclip, Send, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'

interface ChatInputProps {
  value: string
  onChange: (val: string) => void
  onSend: () => void
  onFileSelect?: (file: File) => void
}

export default function ChatInput({ value, onChange, onSend, onFileSelect }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showEmoji, setShowEmoji] = useState(false)

  // Ambil tema dari next-themes
  const { theme: appTheme } = useTheme()
  const emojiTheme: Theme = appTheme === 'dark' ? Theme.DARK : Theme.LIGHT

  // ---------- Auto resize ----------
  useEffect(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = Math.min(el.scrollHeight, 150) + 'px'
      el.style.overflowY = el.scrollHeight > 150 ? 'auto' : 'hidden'
    }
  }, [value])

  // ---------- Kirim pesan ----------
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
      setShowEmoji(false)
    }
  }

  // ---------- Emoji ----------
  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const newValue = value.slice(0, start) + emoji + value.slice(end)
    onChange(newValue)
    setTimeout(() => {
      el.selectionStart = el.selectionEnd = start + emoji.length
      el.focus()
    }, 0)
  }

  // ---------- File ----------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onFileSelect) onFileSelect(file)
    e.target.value = '' // reset input
  }

  return (
    <div className="relative border-t border-secondary p-2 w-full overflow-visible">
      <div className="flex items-end gap-2 max-w-4xl mx-auto relative">
        {/* Emoji Picker toggle */}
        <div className="relative">
          <button
            type="button"
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setShowEmoji((v) => !v)}
          >
            {showEmoji ? <X size={22} /> : <Smile size={22} />}
          </button>

          <AnimatePresence>
            {showEmoji && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-12 left-0 z-50"
              >
                <EmojiPicker
                  onEmojiClick={handleEmojiSelect}
                  autoFocusSearch={false}
                  theme={emojiTheme}
                  width={300}
                  height={350}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* File upload */}
        <button
          type="button"
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip size={22} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
          hidden
          onChange={handleFileChange}
        />

        {/* Textarea */}
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
              transition={{ type: 'spring', stiffness: 250, damping: 15 }}
              onClick={() => {
                onSend()
                setShowEmoji(false)
              }}
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
