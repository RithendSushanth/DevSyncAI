"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Github, Code, Search, Share, ChevronRight, Terminal, Sparkles } from 'lucide-react'

export default function Home() {
  const [isTyping, setIsTyping] = useState(true)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [typedText, setTypedText] = useState("")
  
  const questions = [
    "How does the authentication flow work?",
    "Where is the user data being processed?",
    "What dependencies does this component have?",
    "Show me all API endpoints for users",
  ]

  useEffect(() => {
    if (!isTyping) return
    
    const question = questions[currentTextIndex]
    //@ts-ignore
    if (typedText.length < question.length) {
      const timeout = setTimeout(() => {
        //@ts-ignore
        setTypedText(question.substring(0, typedText.length + 1))
      }, 50)
      return () => clearTimeout(timeout)
    } else {
      const timeout = setTimeout(() => {
        setTypedText("")
        setCurrentTextIndex((currentTextIndex + 1) % questions.length)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [typedText, isTyping, currentTextIndex, questions])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
      {/* Hero Section */}
      <div className="w-full max-w-7xl px-6 py-24 md:py-32 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mb-12"
        >
          <div className="inline-block mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
              className="bg-primary/10 rounded-full p-3 inline-block"
            >
              <Sparkles className="h-6 w-6 text-primary" />
            </motion.div>
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            Understand Your Codebase with AI
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            Ask natural language questions about your code, and get instant answers powered by AI.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="rounded-full px-8 group">
                Get Started
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="https://github.com/your-repo" target="_blank">
              <Button variant="outline" size="lg" className="rounded-full">
                <Github className="mr-2 size-5" /> View on GitHub
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Demo Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full max-w-4xl mx-auto rounded-xl border shadow-lg overflow-hidden bg-card"
        >
          <div className="bg-muted p-3 flex items-center gap-2 border-b">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-xs font-mono text-muted-foreground flex-1 text-center">
              AI Code Assistant
            </div>
          </div>
          
          <div className="p-6 bg-black/5 dark:bg-white/5">
            <div className="flex items-start gap-4">
              <div className="mt-1 bg-primary/20 text-primary rounded-full p-2">
                <Terminal className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="font-medium mb-1">Ask anything about your code</div>
                <div className="relative">
                  <div className="font-mono text-sm bg-card rounded-lg p-3 border">
                    <span className="text-primary-foreground/70">{">"}</span> {typedText}
                    <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-0.5"></span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex items-start gap-4">
              <div className="mt-1 bg-green-500/20 text-green-600 dark:text-green-400 rounded-full p-2">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="font-medium mb-1">AI Response</div>
                <div className="bg-card rounded-lg p-3 border">
                  <div className="text-sm space-y-2">
                    <p>Here's how the authentication flow works in your app:</p>
                    <div className="bg-muted/50 p-2 rounded font-mono text-xs overflow-x-auto">
                      1. User submits credentials via <span className="text-blue-600 dark:text-blue-400">auth/login</span><br />
                      2. Validation in <span className="text-blue-600 dark:text-blue-400">src/lib/auth.js</span><br />
                      3. JWT token generated and stored in HTTP-only cookie<br />
                      4. Redirect to dashboard with active session
                    </div>
                    <p>The main authentication logic is in these files:</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Feature Section */}
      <div className="w-full bg-muted/30">
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-7xl mx-auto w-full py-24 px-6"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered tool helps you navigate and understand complex codebases with ease.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Code className="h-10 w-10" />,
                title: "Ask in Plain English",
                description: "No need to search files manually. Just ask your question and let the AI find the answer.",
              },
              {
                icon: <Search className="h-10 w-10" />,
                title: "Smart Code Search",
                description: "Semantic search powered by embeddings helps you find the most relevant files instantly.",
              },
              {
                icon: <Share className="h-10 w-10" />,
                title: "Save & Share",
                description: "Store useful answers and share them with your team to boost collaboration.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="bg-primary/10 rounded-full p-3 inline-block mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-7xl px-6 py-24 text-center"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to understand your code better?</h2>
          <p className="text-muted-foreground mb-8">
            Join developers who are saving hours every week by using AI to navigate their codebase.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="rounded-full px-8">
              Start for Free
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="w-full border-t py-8 text-center text-sm text-muted-foreground">
        <div className="max-w-7xl mx-auto px-6">
          <p className="mb-2">
            Built with ❤️ using Next.js, Prisma, pgvector, and AI.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
