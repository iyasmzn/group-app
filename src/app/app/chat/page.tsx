import { MobileTopbar } from "@/components/mobile-topbar";
import { NavbarApp } from "@/components/navbar-app";
import PageWrapper from "@/components/page-wrapper";
import { MessageCircle } from "lucide-react";

export default function ChatPage() {
  return (
    <>
      <NavbarApp />
      <MobileTopbar title="Chat" titleIcon={<MessageCircle className="w-6 h-6" />} />
      <PageWrapper>
        <div className="max-w-4xl mx-auto p-4">
          <h1 className="text-2xl font-bold">Chat</h1>
          <p className="mt-2">Chat with your group members here.</p>
        </div>
      </PageWrapper>
    </>
  )
}
