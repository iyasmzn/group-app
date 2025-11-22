'use client'

import { useState, useEffect } from 'react'
import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ParagraphNode, TextNode, SerializedEditorState } from 'lexical'

import { TooltipProvider } from '@/components/ui/tooltip'
import { editorTheme } from '@/components/editor/themes/editor-theme'
import { ContentEditable } from '@/components/editor/editor-ui/content-editable'

type AppEditorProps = {
  value?: SerializedEditorState
  defaultValue?: SerializedEditorState
  onChange?: (val: SerializedEditorState) => void
  placeholder?: string
  className?: string
  height?: string
}

const baseConfig: InitialConfigType = {
  namespace: 'AppEditor',
  theme: editorTheme,
  nodes: [HeadingNode, ParagraphNode, TextNode, QuoteNode],
  onError: (error: Error) => {
    console.error(error)
  },
}

export function AppEditor({
  value,
  defaultValue,
  onChange,
  placeholder = 'Tulis sesuatu...',
  className,
  height = 'h-72',
}: AppEditorProps) {
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null)
  const [internalState, setInternalState] = useState<SerializedEditorState | undefined>(
    defaultValue
  )

  const editorState = value ?? internalState

  useEffect(() => {
    if (value) setInternalState(value)
  }, [value])

  const onRef = (elem: HTMLDivElement) => {
    if (elem !== null) setFloatingAnchorElem(elem)
  }

  return (
    <div className={`bg-background w-full overflow-hidden rounded-lg border ${className}`}>
      <LexicalComposer initialConfig={baseConfig}>
        <TooltipProvider>
          <RichTextPlugin
            contentEditable={
              <div>
                <div ref={onRef}>
                  <ContentEditable
                    placeholder={placeholder}
                    className={`ContentEditable__root relative block min-h-full overflow-auto px-8 py-4 focus:outline-none ${height}`}
                  />
                </div>
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          {/* Tambahkan plugin tambahan di sini */}
        </TooltipProvider>
      </LexicalComposer>
    </div>
  )
}
