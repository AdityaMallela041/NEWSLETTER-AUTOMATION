"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Users, Clock, FileText } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">AI Chronical</span>
          </div>
          <Button asChild variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent">
            <a href="/login">Login</a>
          </Button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-gray-50 to-white pt-20 pb-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text Content */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  Stay Updated with the Latest in <span className="text-blue-600">AI & Machine Learning</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Get personalized, AI-driven newsletters tailored for CSE students and faculty. Stay ahead with
                  cutting-edge research, trends, and insights — delivered straight to your inbox.
                </p>
                <Button asChild className="bg-gray-900 text-white hover:bg-gray-800 px-8 py-6 text-base">
                  <a href="/login">Login</a>
                </Button>
              </motion.div>

              {/* Right Column - Newsletter Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="bg-white shadow-xl border border-gray-200">
                  <CardHeader className="border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">AI Weekly Digest</span>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Latest Breakthroughs in Neural Networks
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-2">
                      Discover the most recent advances in deep learning architectures and their applications in
                      real-world scenarios...
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Dec 15, 2024</span>
                      <Button asChild variant="link" className="text-blue-600 hover:text-blue-700 p-0">
                        <a href="#">Read More →</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Because we bring you AI-powered content, student-focused insights, and real-time updates — all designed
                to keep you informed and inspired.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gray-50 border-gray-200 h-full hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8 pb-8 px-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Content</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Advanced algorithms curate and summarize the most relevant AI/ML content for you.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gray-50 border-gray-200 h-full hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8 pb-8 px-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Student Focused</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Tailored specifically for CSE students and faculty with academic-oriented content.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gray-50 border-gray-200 h-full hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8 pb-8 px-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Updates</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Get the latest news and research updates delivered automatically to your inbox.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-gray-400">© 2025 AI Chronical. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  )
}
