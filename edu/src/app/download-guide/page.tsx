import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Apple, ArrowLeft, Clock, Download, Smartphone } from 'lucide-react'
import Link from 'next/link'

// APK download link - to be updated when available
const APK_DOWNLOAD_URL = "https://example.com/smartsoil.apk"

export default function DownloadGuide() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #194838 0%, #123524 100%)' }}>
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#A8C64A] rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Download Guide</h1>
                <p className="text-sm text-white/70">Get SmartSoil on your mobile device</p>
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Download Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Android APK */}
          <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-all duration-300 border-2 hover:border-[#A8C64A]/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-[#A8C64A]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-[#A8C64A]" />
              </div>
              <CardTitle className="text-xl text-white">Android APK</CardTitle>
              <CardDescription className="text-white/70">
                Direct installation file for Android devices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-[#A8C64A]/10 border border-[#A8C64A]/30 p-4 rounded-lg">
                <h4 className="font-semibold text-[#A8C64A] mb-2">Recommended for:</h4>
                <ul className="text-sm text-white/80 space-y-1">
                  <li>• Schools and educational institutions</li>
                  <li>• Offline installation without Google Play</li>
                  <li>• Testing and development purposes</li>
                </ul>
              </div>
              <Link href="/download-guide/android-apk">
                <Button className="w-full bg-[#A8C64A] hover:bg-[#A8C64A]/90 text-white border-0">
                  View APK Installation Guide
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* App Store */}
          <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 border-2 backdrop-blur-sm opacity-75">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Apple className="w-8 h-8 text-white/60" />
              </div>
              <CardTitle className="text-xl flex items-center justify-center space-x-2 text-white">
                <span>App Store</span>
                <Badge variant="secondary" className="bg-white/20 text-white/80">Coming Soon</Badge>
              </CardTitle>
              <CardDescription className="text-white/60">
                Official iOS App Store release
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2 flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Coming Soon:</span>
                </h4>
                <ul className="text-sm text-white/60 space-y-1">
                  <li>• Official iOS App Store release</li>
                  <li>• Automatic updates</li>
                  <li>• Enhanced security and verification</li>
                </ul>
              </div>
              <Button disabled className="w-full bg-white/20 cursor-not-allowed text-white/60 border-0">
                Not Available Yet
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Requirements */}
        <Card className="mb-8 bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">System Requirements</CardTitle>
            <CardDescription className="text-white/70">Minimum requirements for running SmartSoil</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center space-x-2 text-white">
                  <Smartphone className="w-5 h-5 text-[#A8C64A]" />
                  <span>Android Devices</span>
                </h4>
                <ul className="space-y-2 text-sm text-white/70">
                  <li>• Android 6.0 (API level 23) or higher</li>
                  <li>• 2GB RAM minimum, 4GB recommended</li>
                  <li>• 100MB free storage space</li>
                  <li>• WiFi connectivity for sensor data</li>
                  <li>• Camera permission (for QR codes)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 flex items-center space-x-2 text-white">
                  <Apple className="w-5 h-5 text-white/60" />
                  <span>iOS Devices (Coming Soon)</span>
                </h4>
                <ul className="space-y-2 text-sm text-white/60">
                  <li>• iOS 12.0 or later</li>
                  <li>• iPhone 6s or newer</li>
                  <li>• iPad (5th generation) or newer</li>
                  <li>• 100MB free storage space</li>
                  <li>• WiFi connectivity for sensor data</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="bg-orange-500/10 border-orange-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-300">
              <AlertTriangle className="w-5 h-5" />
              <span>Important Notes for Educators</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-orange-300 mb-2">APK Installation:</h4>
                <ul className="text-sm text-orange-200/80 space-y-1">
                  <li>• Requires enabling &quot;Unknown Sources&quot; on Android</li>
                  <li>• May trigger security warnings (this is normal)</li>
                  <li>• Best for controlled educational environments</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-orange-300 mb-2">Network Requirements:</h4>
                <ul className="text-sm text-orange-200/80 space-y-1">
                  <li>• WiFi needed for ESP8266 sensor connection</li>
                  <li>• Demo mode works without internet</li>
                  <li>• Consider school network policies</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Information */}
        <div className="mt-12 text-center">
          <Card className="bg-[#34C759]/10 border-[#34C759]/30 backdrop-blur-sm">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Need Help with Installation?
              </h3>
              <p className="text-white/80 mb-4">
                Our team is here to support educators in the Philippines with SmartSoil deployment.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" className="border-[#34C759]/50 text-[#34C759] hover:bg-[#34C759]/10">
                  Contact Support
                </Button>
                <Button variant="outline" className="border-[#34C759]/50 text-[#34C759] hover:bg-[#34C759]/10">
                  View FAQ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 