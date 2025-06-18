import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, ArrowLeft, BookOpen, CheckCircle, Clock, Lightbulb, Users } from 'lucide-react'
import Link from 'next/link'

export default function TeachersGuide() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #194838 0%, #123524 100%)' }}>
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#34C759] rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Teachers Guide</h1>
                <p className="text-sm text-white/70">SmartSoil App Navigation & Teaching Tips</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline" className="flex items-center space-x-2 border-white/20 text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Overview Section */}
        <div className="mb-12">
          <Card className="bg-[#34C759]/10 border-[#34C759]/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Users className="w-6 h-6 text-[#34C759]" />
                <span>Teaching Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-[#34C759]" />
                  <div>
                    <p className="font-semibold text-white">Duration</p>
                    <p className="text-sm text-white/70">15-25 minutes</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-[#34C759]" />
                  <div>
                    <p className="font-semibold text-white">Total Steps</p>
                    <p className="text-sm text-white/70">21 across 5 screens</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-[#34C759]" />
                  <div>
                    <p className="font-semibold text-white">Target</p>
                    <p className="text-sm text-white/70">Students & Makers</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* App Navigation Guide */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-white mb-8">App Navigation Guide</h2>

          {/* Introduction Screen */}
          <Card className="bg-white/10 border-white/20 border-l-4 border-l-[#A8C64A] backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-white">1. Introduction Screen</CardTitle>
                <Badge variant="secondary" className="bg-white/20 text-white">4 Steps</Badge>
              </div>
              <CardDescription className="text-white/70">Welcome and overview of learning objectives</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 text-white">What Students See:</h4>
                  <ul className="space-y-1 text-sm text-white/70">
                    <li>• Welcome to SmartSoil</li>
                    <li>• IoT (Internet of Things) concepts</li>
                    <li>• App Design principles</li>
                    <li>• Machine Learning introduction</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center space-x-2 text-white">
                    <Lightbulb className="w-4 h-4 text-[#A8C64A]" />
                    <span>Teaching Tips:</span>
                  </h4>
                  <ul className="space-y-1 text-sm text-white/70">
                    <li>• Explain each concept briefly before proceeding</li>
                    <li>• Ask students what they know about IoT</li>
                    <li>• Emphasize real-world applications</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lesson 1 */}
          <Card className="bg-white/10 border-white/20 border-l-4 border-l-[#34C759] backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-white">2. Lesson 1: IoT Sensors & Hardware</CardTitle>
                <Badge variant="secondary" className="bg-white/20 text-white">5 Steps</Badge>
              </div>
              <CardDescription className="text-white/70">ESP8266 setup and sensor connections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 text-white">Key Learning Points:</h4>
                  <ul className="space-y-1 text-sm text-white/70">
                    <li>• ESP8266 microcontroller basics</li>
                    <li>• DHT11 temperature/humidity sensor</li>
                                          <li>• Resistive soil moisture sensor</li>
                    <li>• WiFi network creation</li>
                    <li>• Real-time data collection</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center space-x-2 text-white">
                    <AlertCircle className="w-4 h-4 text-orange-400" />
                    <span>Important Notes:</span>
                  </h4>
                  <ul className="space-y-1 text-sm text-white/70">
                    <li>• Demo mode available if no hardware</li>
                    <li>• Connection steps are optional</li>
                    <li>• Students can skip if having trouble</li>
                  </ul>
                </div>
              </div>
              <div className="bg-[#34C759]/10 border border-[#34C759]/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-white">Hardware Connection Guide:</h4>
                <p className="text-sm text-white/70 mb-2">
                  If students choose &quot;Help Me with Connection&quot;, they&apos;ll see detailed wiring diagrams:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div className="bg-red-500/20 border border-red-500/30 p-2 rounded text-center">
                    <span className="font-semibold text-red-300">VCC (Red)</span><br/>Power pins
                  </div>
                  <div className="bg-gray-800 text-white p-2 rounded text-center border border-gray-600">
                    <span className="font-semibold">GND (Black)</span><br/>Ground pins
                  </div>
                  <div className="bg-blue-500/20 border border-blue-500/30 p-2 rounded text-center">
                    <span className="font-semibold text-blue-300">A0 (Blue)</span><br/>Analog input
                  </div>
                  <div className="bg-yellow-500/20 border border-yellow-500/30 p-2 rounded text-center">
                    <span className="font-semibold text-yellow-300">D4 (Yellow)</span><br/>Digital I/O
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lesson 2 */}
          <Card className="bg-white/10 border-white/20 border-l-4 border-l-purple-500 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-white">3. Lesson 2: Data Visualization</CardTitle>
                <Badge variant="secondary" className="bg-white/20 text-white">4 Steps</Badge>
              </div>
              <CardDescription className="text-white/70">Understanding sensor data and creating dashboards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 text-white">Interactive Components:</h4>
                  <ul className="space-y-1 text-sm text-white/70">
                    <li>• Live sensor data display</li>
                    <li>• Analog-to-digital conversion (0-1023 → 0-100%)</li>
                    <li>• Interactive moisture slider</li>
                    <li>• Multi-plant dashboard example</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-white">Plant Care Ranges:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <span className="text-white/70">Cacti & Succulents: 10-30%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-[#A8C64A] rounded-full"></div>
                      <span className="text-white/70">Most Houseplants: 40-60%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-[#34C759] rounded-full"></div>
                      <span className="text-white/70">Tropical Plants: 60-80%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center space-x-2 text-white">
                  <Lightbulb className="w-4 h-4 text-[#A8C64A]" />
                  <span>Teaching Strategy:</span>
                </h4>
                <p className="text-sm text-white/70">
                  Encourage students to experiment with the moisture slider. Ask them to predict 
                  what happens to different plant types at various moisture levels.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Lesson 3 */}
          <Card className="bg-white/10 border-white/20 border-l-4 border-l-orange-500 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-white">4. Lesson 3: Machine Learning</CardTitle>
                <Badge variant="secondary" className="bg-white/20 text-white">5 Steps</Badge>
              </div>
              <CardDescription className="text-white/70">ML concepts and predictive watering decisions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 text-white">ML Training Process:</h4>
                  <ol className="space-y-1 text-sm text-white/70 list-decimal list-inside">
                    <li>Data Collection (6+ months)</li>
                    <li>Feature Engineering</li>
                    <li>Pattern Recognition</li>
                    <li>Validation & Testing</li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-white">Interactive Tools:</h4>
                  <ul className="space-y-1 text-sm text-white/70">
                    <li>• Feature selection game</li>
                    <li>• ML-powered watering tool</li>
                    <li>• Environmental factor correlation</li>
                  </ul>
                </div>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-white">Key Concept to Emphasize:</h4>
                <p className="text-sm text-white/70">
                  ML doesn&apos;t just look at current moisture levels - it considers weather forecasts, 
                  historical patterns, and plant-specific needs to make smarter decisions.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Teaching Best Practices */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-8">Teaching Best Practices</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <CheckCircle className="w-5 h-5 text-[#34C759]" />
                  <span>Do&apos;s</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-white/70">
                  <li>• Allow students to explore at their own pace</li>
                  <li>• Encourage questions about real-world applications</li>
                  <li>• Use demo mode if hardware isn&apos;t available</li>
                  <li>• Connect concepts to agriculture in Philippines</li>
                  <li>• Emphasize hands-on learning</li>
                  <li>• Discuss career opportunities in IoT/ML</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <AlertCircle className="w-5 h-5 text-orange-400" />
                  <span>Common Challenges</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-white/70">
                  <li>• WiFi connectivity issues → Use demo mode</li>
                  <li>• Students rushing through → Encourage exploration</li>
                  <li>• Complex ML concepts → Use simple analogies</li>
                  <li>• Hardware not available → Focus on concepts</li>
                  <li>• Different learning speeds → Pair students</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="mt-16">
          <Card className="bg-white/5 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Quick Reference</CardTitle>
              <CardDescription className="text-white/70">Navigation flow and key points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-black/20 p-4 rounded-lg font-mono text-sm">
                <div className="text-center text-white/80">
                  Intro (4 steps) → Lesson 1 (5 steps) → [Connection Steps (3 steps)] → Lesson 2 (4 steps) → Lesson 3 (5 steps)
                </div>
                <div className="text-center text-xs text-white/60 mt-2">
                  Total: 21 steps | Duration: 15-25 minutes | Hardware: Optional (demo modes available)
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 