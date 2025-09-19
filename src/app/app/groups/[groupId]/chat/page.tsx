"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { uploadToCloudinary } from "@/lib/cloudinary"

export default function ChatPage({ groupId, userId }: { groupId: string; userId: string }) {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState("")
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("Messages")
        .select("*")
        .eq("groupId", groupId)
        .order("createdAt", { ascending: true })
      setMessages(data || [])
    }

    fetchMessages()

    const subscription = supabase
      .from(`Messages:groupId=eq.${groupId}`)
      .on("INSERT", payload => setMessages(prev => [...prev, payload.new]))
      .subscribe()

    return () => supabase.removeSubscription(subscription)
  }, [groupId])

  const sendMessage = async () => {
    let attachmentUrl = ""
    if (file) {
      attachmentUrl = await uploadToCloudinary(file)
      setFile(null)
    }
    if (!input.trim() && !attachmentUrl) return
    await supabase.from("Messages").insert([{ groupId, senderId: userId, content: input, attachmentUrl }])
    setInput("")
  }

  return (
     <div className="flex flex-col h-full max-w-4xl mx-auto p-4">
    <div className="flex-1 overflow-y-auto p-2 space-y-2 border rounded">
      {messages.map(msg => (
        <div key={msg.id} className="p-2 rounded bg-gray-100">
          <strong>{msg.senderId}:</strong> {msg.content}
          {msg.attachmentUrl && (
            <img src={msg.attachmentUrl} className="mt-2 max-h-40" />
          )}
        </div>
      ))}
    </div>

    <div className="flex gap-2 mt-2">
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === "Enter" && sendMessage()}
        className="flex-1 border rounded p-2"
        placeholder="Type a message..."
      />
      <input type="file" onChange={e => e.target.files && setFile(e.target.files[0])} />
      <button className="px-4 bg-blue-600 text-white rounded" onClick={sendMessage}>Send</button>
    </div>
  </div>
)
}

