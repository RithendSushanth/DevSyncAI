"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreditCard, Sparkles, Zap, Shield, Check } from 'lucide-react'
import { motion } from "framer-motion"

export default function Billing() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      // Here you would typically send this to your backend
      setEmail("")
      setTimeout(() => setIsSubmitted(false), 3000)
    }
  }

  return (
    <div className="relative min-h-[80vh] overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-20 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container max-w-5xl mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center mb-12">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 p-4 mb-6"
          >
            <CreditCard className="h-10 w-10 text-white" />
          </motion.div>

          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600"
          >
            Premium Plans Coming Soon
          </motion.h1>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl"
          >
            We're crafting the perfect plans to supercharge your experience. Get ready for exclusive features that will take your productivity to the next level.
          </motion.p>
        </div>

        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          {[
            { 
              icon: <Zap className="h-6 w-6" />, 
              title: "Lightning Fast", 
              description: "Experience blazing speeds with our optimized infrastructure" 
            },
            { 
              icon: <Sparkles className="h-6 w-6" />, 
              title: "Premium Features", 
              description: "Unlock powerful tools designed for professionals" 
            },
            { 
              icon: <Shield className="h-6 w-6" />, 
              title: "Enhanced Security", 
              description: "Advanced protection for your most sensitive data" 
            }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200"
            >
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-gray-200"
        >
          <h2 className="text-2xl font-bold mb-4">Be the First to Know</h2>
          <p className="text-muted-foreground mb-6">
            Join our waitlist and get early access to our premium plans with an exclusive discount.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 transition-all duration-300"
            >
              {isSubmitted ? (
                <span className="flex items-center">
                  <Check className="mr-2 h-4 w-4" /> Notification Set!
                </span>
              ) : (
                "Notify Me"
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
