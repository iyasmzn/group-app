"use client"
import LandingLayout from "./landing-layout";
import Link from "next/link";
import { useAuth } from "@/lib/supabase/auth";
import Reveal from "@/components/animations/Reveal";

export default function LandingPage() {
  const { user } = useAuth()

  return (
     <LandingLayout>
      <div>
        {/* Hero Section */}
        <section
          id="home"
          className="relative flex flex-col items-center justify-center text-center px-6 py-32"
        >
          <Reveal>
            <h1 className="text-3xl md:text-6xl font-bold mb-6">
              Manage Your Groups Effortlessly
            </h1>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="md:text-xl max-w-2xl mb-8">
              Create groups, chat in real-time, assign dynamic roles, and customize permissions with ease.
            </p>
          </Reveal>
          <div className="flex gap-8 md:gap-4 flex-wrap justify-center">
            <Reveal delay={0.6}>
              <Link
                href="/login"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {user ? "Manage" : "Get Started"}
              </Link>
            </Reveal>
            <Reveal delay={0.9}>
              <a
                href="#features"
                className="px-8 py-3 border border-gray-300 rounded-lg font-semibold transition-colors"
              >
                Learn More
              </a>
            </Reveal>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-6xl mx-auto py-24 px-6">
          <Reveal>
            <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Reveal>
              <div className="border p-6 rounded-xl shadow hover:shadow-lg transition-shadow">
                <h3 className="font-semibold text-xl mb-2">Group Management</h3>
                <p>Create and manage groups with flexible member roles.</p>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="border p-6 rounded-xl shadow hover:shadow-lg transition-shadow">
                <h3 className="font-semibold text-xl mb-2">Realtime Chat</h3>
                <p>Chat with your group members instantly, upload files and images.</p>
              </div>
            </Reveal>
            <Reveal delay={0.6}>
              <div className="border p-6 rounded-xl shadow hover:shadow-lg transition-shadow">
                <h3 className="font-semibold text-xl mb-2">Dynamic Roles</h3>
                <p>Owners can create custom roles with permissions dynamically.</p>
              </div>
            </Reveal>
            <Reveal delay={0.9}>
              <div className="border p-6 rounded-xl shadow hover:shadow-lg transition-shadow">
                <h3 className="font-semibold text-xl mb-2">Theme & Accessibility</h3>
                <p>Toggle dark/light mode and enjoy fully responsive design.</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Call to Action */}
        <section id="contact" className="py-24 px-6 text-center">
          <Reveal>
            <h2 className="text-3xl font-bold mb-6">Ready to start?</h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className=" mb-8 max-w-xl mx-auto">
              Join thousands of users managing their groups efficiently with Group App.
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <Link
              href="/login"
              className="px-10 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Create Account
            </Link>
          </Reveal>
        </section>

        {/* Footer */}
        <footer id="footer" className="py-8 text-center border-t">
          <p>&copy; {new Date().getFullYear()} Group App. All rights reserved.</p>
        </footer>
      </div>
    </LandingLayout>
  )
}
