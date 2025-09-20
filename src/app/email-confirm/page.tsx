"use client"
import { useAuth } from "@/lib/supabase/auth";

export default function EmailConfirmPage() {
    const {user} = useAuth();

    if (user) {
        return (
            <div className="max-w-md mx-auto p-4 flex flex-col gap-2">
                <h1 className="text-xl font-bold mb-2">Email Already Confirmed</h1>
                <p>Your email is already confirmed. You can proceed to <a href="/login" className="text-primarry underline">login</a>.</p>
            </div>
        )
    }
    
    return (
        <div className="max-w-md mx-auto p-4 flex flex-col gap-2">
            <h1 className="text-xl font-bold mb-2">Please Confirm Your Email</h1>
            <p>We have sent a confirmation link to your email address. Please check your inbox and click the link to verify your account.</p>
        </div>
    )
}