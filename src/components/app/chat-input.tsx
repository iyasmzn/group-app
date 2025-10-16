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
  onFileSelect?: (files: File[]) => void
}

export default function ChatInput({ value, onChange, onSend, onFileSelect }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const docInputRef = useRef<HTMLInputElement>(null)

  const [showEmoji, setShowEmoji] = useState(false)
  const [showUploadMenu, setShowUploadMenu] = useState(false)
  const [previewFiles, setPreviewFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<{ [key: string]: string | null }>({})

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

  // File handling (multiple)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    setPreviewFiles((prev) => [...prev, ...files])
    const newUrls: { [key: string]: string | null } = {}
    files.forEach((f) => {
      if (f.type.startsWith('image/')) newUrls[f.name] = URL.createObjectURL(f)
      else newUrls[f.name] = null
    })
    setPreviewUrls((prev) => ({ ...prev, ...newUrls }))

    setShowUploadMenu(false)
    e.target.value = ''
  }

  // Send message or files
  const handleSend = () => {
    if (previewFiles.length && onFileSelect) {
      onFileSelect(previewFiles)
      setPreviewFiles([])
      setPreviewUrls({})
    }
    if (value.trim()) onSend()
    setShowEmoji(false)
  }

  // Remove single preview
  const removeFile = (name: string) => {
    setPreviewFiles((prev) => prev.filter((f) => f.name !== name))
    setPreviewUrls((prev) => {
      const newUrls = { ...prev }
      delete newUrls[name]
      return newUrls
    })
  }

  return (
    <div className="relative border-t border-secondary p-2 sm:p-3 w-full overflow-visible">
      {/* Multiple Preview Files */}
      <AnimatePresence>
        {previewFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-2 mb-3 bg-muted/40 border rounded-lg max-w-full sm:max-w-4xl mx-auto"
          >
            {previewFiles.map((file) => (
              <motion.div
                key={file.name}
                layout
                className="relative rounded-lg overflow-hidden group border bg-background"
              >
                {previewUrls[file.name] ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={previewUrls[file.name]!}
                      alt={file.name}
                      className="w-full h-40 sm:h-48 object-cover rounded-t-md"
                    />
                    <div className="p-2 w-full text-center text-xs sm:text-sm border-t bg-card truncate">
                      <p className="truncate font-medium">{file.name}</p>
                      <p className="text-muted-foreground">
                        {file.size > 1024 * 1024
                          ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                          : `${(file.size / 1024).toFixed(1)} KB`}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 bg-muted rounded-md p-2 text-center">
                    <FileText className="w-8 h-8 text-muted-foreground mb-1" />
                    <p className="text-xs truncate">{file.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                )}

                <button
                  onClick={() => removeFile(file.name)}
                  className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Bar */}
      <div className="flex items-end gap-2 max-w-full sm:max-w-4xl mx-auto relative">
        {/* Emoji toggle */}
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
                  width={280}
                  height={350}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Upload menu */}
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

        {/* Hidden file inputs */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleFileChange}
        />
        <input
          ref={docInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          multiple
          hidden
          onChange={handleFileChange}
        />

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder="Tulis pesan..."
          rows={1}
          spellCheck={false}
          autoComplete="off"
          className="flex-1 resize-none overflow-y-auto max-h-[150px] rounded-xl border border-input bg-card p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {/* Send button */}
        <AnimatePresence>
          {(value.trim() || previewFiles.length > 0) && (
            <motion.button
              key="send-btn"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 250, damping: 15 }}
              onClick={handleSend}
              className={cn(
                'flex items-center justify-center rounded-full p-2 transition-colors shrink-0',
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
