import { AppBottombar } from "@/components/app/bottombar";
import { AppTopbar } from "@/components/app/topbar";
import PageWrapper from "@/components/page-wrapper";
import { MessageCircle } from "lucide-react";

export default function ChatPage() {
  return (
    <>
      <AppTopbar title="Chat" titleIcon={<MessageCircle className="w-6 h-6" />} />
      <AppBottombar />
      <PageWrapper>
        <div className="max-w-4xl mx-auto p-4">
          <h1 className="text-2xl font-bold">Chat</h1>
          <p className="mt-2">Chat with your group members here.</p>
        </div>
      </PageWrapper>
    </>
  )
}
