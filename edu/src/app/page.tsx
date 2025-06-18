import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Download, Smartphone, Users } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #194838 0%, #123524 100%)' }}>
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#34C759] rounded-lg flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">SmartSoil</h1>
              <p className="text-sm text-white/70">Educational Resources for Philippines</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Welcome to SmartSoil Educational Hub
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Comprehensive resources for teachers and students to learn IoT, data visualization, 
            and machine learning through smart agriculture. Perfect for overseas education programs.
          </p>
        </div>

        {/* Main Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Teachers Guide Card */}
          <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-all duration-300 border-2 hover:border-[#34C759]/50 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-[#34C759]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-[#34C759]" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Teachers Guide
              </CardTitle>
              <CardDescription className="text-white/70">
                Complete guide for educators to navigate and teach the SmartSoil app effectively
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-[#A8C64A]" />
                  <span className="text-sm text-white/80">Step-by-step lesson navigation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-[#A8C64A]" />
                  <span className="text-sm text-white/80">Teaching tips and best practices</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-[#A8C64A]" />
                  <span className="text-sm text-white/80">Interactive component explanations</span>
                </div>
              </div>
              <Link href="/teachers-guide" className="block">
                <Button className="w-full bg-[#34C759] hover:bg-[#34C759]/90 text-white border-0">
                  Access Teachers Guide
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Download Guide Card */}
          <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-all duration-300 border-2 hover:border-[#A8C64A]/50 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-[#A8C64A]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-[#A8C64A]" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Download Guide
              </CardTitle>
              <CardDescription className="text-white/70">
                Instructions for downloading and installing the SmartSoil app on mobile devices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Download className="w-4 h-4 text-[#A8C64A]" />
                  <span className="text-sm text-white/80">Android APK installation guide</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Download className="w-4 h-4 text-[#A8C64A]" />
                  <span className="text-sm text-white/80">App Store download instructions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Download className="w-4 h-4 text-[#A8C64A]" />
                  <span className="text-sm text-white/80">Troubleshooting tips</span>
                </div>
              </div>
              <Link href="/download-guide" className="block">
                <Button className="w-full bg-[#A8C64A] hover:bg-[#A8C64A]/90 text-white border-0">
                  View Download Options
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-white mb-4">
              About SmartSoil
            </h3>
            <p className="text-white/80 leading-relaxed">
              SmartSoil is an educational app that teaches IoT sensor setup, data visualization, 
              and machine learning through hands-on plant monitoring. Students learn to build 
              smart agriculture systems using ESP8266 microcontrollers and various sensors.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 bg-[#34C759]/20 text-[#34C759] rounded-full text-sm border border-[#34C759]/30">IoT Education</span>
              <span className="px-3 py-1 bg-[#A8C64A]/20 text-[#A8C64A] rounded-full text-sm border border-[#A8C64A]/30">Smart Agriculture</span>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">Machine Learning</span>
              <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm border border-orange-500/30">Data Visualization</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-white/70">
            <p>&copy; 2024 SofTx Innovations Inc. All rights reserved.</p>
            <p className="mt-2 text-sm">Educational resources for overseas teaching programs</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
