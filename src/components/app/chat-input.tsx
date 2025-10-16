'use client'

import { useRef, useEffect, useState } from 'react'
import { Smile, Paperclip, Send, X, Image as ImageIcon, FileText } from 'lucide-react'
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
  const imageInputRef = useRef<HTMLInputElement>(null)
  const docInputRef = useRef<HTMLInputElement>(null)

  const [showEmoji, setShowEmoji] = useState(false)
  const [showUploadMenu, setShowUploadMenu] = useState(false)
  const [previewFile, setPreviewFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Ambil tema dari next-themes
  const { theme: appTheme } = useTheme()
  const emojiTheme: Theme = appTheme === 'dark' ? Theme.DARK : Theme.LIGHT

  // Auto resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = Math.min(el.scrollHeight, 150) + 'px'
      el.style.overflowY = el.scrollHeight > 150 ? 'auto' : 'hidden'
    }
  }, [value])

  // Kirim pesan (Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Emoji select
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

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPreviewFile(file)
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      setPreviewUrl(null)
    }

    setShowUploadMenu(false)
    e.target.value = ''
  }

  // Handle send
  const handleSend = () => {
    if (previewFile && onFileSelect) {
      onFileSelect(previewFile)
      setPreviewFile(null)
      setPreviewUrl(null)
    }
    if (value.trim()) onSend()
    setShowEmoji(false)
  }

  return (
    <div className="relative border-t border-secondary p-2 w-full overflow-visible">
      {/* Preview File */}
      <AnimatePresence>
        {previewFile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 p-2 border rounded-lg mb-2 bg-muted/40 max-w-4xl mx-auto"
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="preview"
                className="w-16 h-16 object-cover rounded-md border"
              />
            ) : (
              <div className="flex items-center justify-center w-16 h-16 bg-muted rounded-md">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{previewFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(previewFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => {
                setPreviewFile(null)
                setPreviewUrl(null)
              }}
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end gap-2 max-w-4xl mx-auto relative">
        {/* Emoji Picker toggle */}
        <div className="relative">
          <button
            type="button"
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => {
              setShowEmoji((v) => !v)
              setShowUploadMenu(false)
            }}
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

        {/* File Upload Menu */}
        <div className="relative">
          <button
            type="button"
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => {
              setShowUploadMenu((v) => !v)
              setShowEmoji(false)
            }}
          >
            <Paperclip size={22} />
          </button>

          <AnimatePresence>
            {showUploadMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-12 left-0 bg-popover border rounded-xl shadow-md overflow-hidden z-50"
              >
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors w-full"
                >
                  <ImageIcon className="w-4 h-4" /> Gambar
                </button>
                <button
                  onClick={() => docInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors w-full"
                >
                  <FileText className="w-4 h-4" /> Dokumen
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hidden inputs */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
        <input
          ref={docInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
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
          {(value.trim() || previewFile) && (
            <motion.button
              key="send-btn"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 250, damping: 15 }}
              onClick={handleSend}
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
