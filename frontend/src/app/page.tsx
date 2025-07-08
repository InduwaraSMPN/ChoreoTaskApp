'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, Clock, Users, ArrowRight, Github, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-100">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-secondary-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-secondary-900">
                {process.env.NEXT_PUBLIC_APP_NAME || 'Task Management'}
              </h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link 
                href="/dashboard" 
                className="btn-primary flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6 text-balance">
            Manage Your Tasks with
            <span className="text-primary-600 block">WSO2 Choreo</span>
          </h2>
          <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto text-balance">
            A comprehensive full-stack sample application demonstrating modern web development 
            with Next.js frontend and Node.js backend, all deployed on WSO2 Choreo platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="btn-primary text-lg px-8 py-3">
              Start Managing Tasks
            </Link>
            <a 
              href="https://github.com/your-org/choreo-fullstack-sample" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-outline text-lg px-8 py-3 flex items-center justify-center space-x-2"
            >
              <Github className="w-5 h-5" />
              <span>View Source</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="card p-8 text-center hover:shadow-medium transition-shadow duration-300">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-3">
              Task Management
            </h3>
            <p className="text-secondary-600">
              Create, update, and organize your tasks with an intuitive interface. 
              Set priorities, due dates, and track progress effortlessly.
            </p>
          </div>

          <div className="card p-8 text-center hover:shadow-medium transition-shadow duration-300">
            <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-success-600" />
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-3">
              User Authentication
            </h3>
            <p className="text-secondary-600">
              Secure authentication powered by Choreo's managed authentication system. 
              No complex setup required - just focus on your application logic.
            </p>
          </div>

          <div className="card p-8 text-center hover:shadow-medium transition-shadow duration-300">
            <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-warning-600" />
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-3">
              Real-time Updates
            </h3>
            <p className="text-secondary-600">
              Experience seamless real-time updates with optimistic UI patterns 
              and efficient API communication between frontend and backend.
            </p>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="card p-8 mb-16">
          <h3 className="text-2xl font-bold text-secondary-900 mb-6 text-center">
            Built with Modern Technologies
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-secondary-900 mb-4">Frontend</h4>
              <ul className="space-y-2 text-secondary-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-600" />
                  <span>Next.js 14 with App Router</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-600" />
                  <span>TypeScript for type safety</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-600" />
                  <span>Tailwind CSS for styling</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-600" />
                  <span>Choreo managed authentication</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-secondary-900 mb-4">Backend</h4>
              <ul className="space-y-2 text-secondary-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-600" />
                  <span>Node.js with Express.js</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-600" />
                  <span>RESTful API with OpenAPI spec</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-600" />
                  <span>JWT authentication integration</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-600" />
                  <span>Health monitoring endpoints</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-secondary-900 mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-lg text-secondary-600 mb-8 max-w-2xl mx-auto">
            Experience the power of full-stack development on WSO2 Choreo. 
            Sign in to start managing your tasks and explore the application features.
          </p>
          <Link href="/dashboard" className="btn-primary text-lg px-8 py-3 inline-flex items-center space-x-2">
            <span>Launch Application</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-secondary-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-secondary-600">
            <p>
              Built with ❤️ for the WSO2 Choreo community. 
              <a 
                href="https://wso2.com/choreo/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 ml-1"
              >
                Learn more about Choreo
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
