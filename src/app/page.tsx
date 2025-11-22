'use client'
import LandingLayout from './landing-layout'
import Link from 'next/link'
import Reveal from '@/components/animations/Reveal'
import FeaturesSection from '@/components/landing/features-section'
import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

export default function LandingPage() {
  const { user } = useAuth()

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error)
    }
  }, [])

  return (
    <LandingLayout>
      <div>
        {/* Hero Section */}
        <section
          id="home"
          className="relative flex flex-col items-center justify-center text-center px-6 py-32"
        >
          <Reveal>
            <h1 className="text-3xl md:text-6xl font-bold mb-6">Manage Your Groups Effortlessly</h1>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="md:text-xl max-w-2xl mb-8">
              Create groups, chat in real-time, assign dynamic roles, and customize permissions with
              ease.
            </p>
          </Reveal>
          <div className="flex gap-8 md:gap-4 flex-wrap justify-center">
            <Reveal delay={0.6}>
              <Link
                href="/login"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {user ? 'Manage' : 'Get Started'}
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
            <h2 className="text-3xl font-bold text-center mb-4">Features</h2>
          </Reveal>
          <Reveal delay={0.5} animation="fadeInUp">
            <FeaturesSection />
          </Reveal>
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
