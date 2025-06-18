import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, ArrowLeft, CheckCircle, Download, Settings, Shield, Smartphone } from 'lucide-react'
import Link from 'next/link'

// APK download link - to be updated when available
const APK_DOWNLOAD_URL = "https://example.com/smartsoil.apk"

export default function AndroidAPKGuide() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #194838 0%, #123524 100%)' }}>
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#A8C64A] rounded-lg flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Android APK Installation</h1>
                <p className="text-sm text-white/70">Step-by-step guide for installing SmartSoil APK</p>
              </div>
            </div>
            <Link href="/download-guide">
              <Button variant="outline" className="flex items-center space-x-2 border-white/20 text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Downloads</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Download Section */}
        <Card className="mb-8 bg-[#A8C64A]/10 border-[#A8C64A]/30 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Download SmartSoil APK</CardTitle>
            <CardDescription className="text-white/80">
              Latest version for Android devices
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex justify-center items-center space-x-4">
              <Badge variant="secondary" className="bg-[#A8C64A]/20 text-[#A8C64A] border border-[#A8C64A]/30">
                Version 1.0.0
              </Badge>
              <Badge variant="secondary" className="bg-[#34C759]/20 text-[#34C759] border border-[#34C759]/30">
                25.4 MB
              </Badge>
            </div>
            <a href={APK_DOWNLOAD_URL} download>
              <Button size="lg" className="bg-[#A8C64A] hover:bg-[#A8C64A]/90 text-white border-0">
                <Download className="w-5 h-5 mr-2" />
                Download SmartSoil.apk
              </Button>
            </a>
            <p className="text-sm text-white/70">
              Compatible with Android 6.0 and above
            </p>
          </CardContent>
        </Card>

        {/* Installation Steps */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-white mb-8">Installation Instructions</h2>

          {/* Step 1 */}
          <Card className="bg-white/10 border-white/20 border-l-4 border-l-[#34C759] backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <div className="w-8 h-8 bg-[#34C759] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <span>Enable Unknown Sources</span>
              </CardTitle>
              <CardDescription className="text-white/70">
                Allow installation of apps from sources other than Google Play Store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-[#34C759]/10 border border-[#34C759]/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center space-x-2 text-white">
                  <Settings className="w-4 h-4 text-[#34C759]" />
                  <span>For Android 8.0 and above:</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-white/80">
                  <li>Go to <strong>Settings</strong> → <strong>Apps & notifications</strong></li>
                  <li>Tap <strong>Special app access</strong></li>
                  <li>Tap <strong>Install unknown apps</strong></li>
                  <li>Select your browser (Chrome, Firefox, etc.)</li>
                  <li>Toggle <strong>Allow from this source</strong></li>
                </ol>
              </div>
              <div className="bg-white/5 border border-white/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center space-x-2 text-white">
                  <Settings className="w-4 h-4 text-white/60" />
                  <span>For Android 7.0 and below:</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-white/70">
                  <li>Go to <strong>Settings</strong> → <strong>Security</strong></li>
                  <li>Find <strong>Unknown sources</strong></li>
                  <li>Toggle it <strong>ON</strong></li>
                  <li>Confirm by tapping <strong>OK</strong></li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="bg-white/10 border-white/20 border-l-4 border-l-[#A8C64A] backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <div className="w-8 h-8 bg-[#A8C64A] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <span>Download the APK File</span>
              </CardTitle>
              <CardDescription className="text-white/70">
                Download SmartSoil APK to your Android device
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-[#A8C64A]/10 border border-[#A8C64A]/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-white">Download Options:</h4>
                <ul className="space-y-2 text-sm text-white/80">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-[#A8C64A]" />
                    <span>Direct download from this page (recommended)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-[#A8C64A]" />
                    <span>Share download link via email or messaging</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-[#A8C64A]" />
                    <span>Transfer from computer via USB cable</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="bg-white/10 border-white/20 border-l-4 border-l-purple-500 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <span>Install the APK</span>
              </CardTitle>
              <CardDescription className="text-white/70">
                Run the downloaded APK file to install SmartSoil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-white">Installation Process:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-white/80">
                  <li>Open your device file manager or Downloads folder</li>
                  <li>Find the <strong>SmartSoil.apk</strong> file</li>
                  <li>Tap on the APK file to start installation</li>
                  <li>Review app permissions and tap <strong>Install</strong></li>
                  <li>Wait for installation to complete</li>
                  <li>Tap <strong>Open</strong> to launch SmartSoil</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card className="bg-white/10 border-white/20 border-l-4 border-l-orange-500 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <span>Launch and Setup</span>
              </CardTitle>
              <CardDescription className="text-white/70">
                Complete initial setup and start learning
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-white">First Launch:</h4>
                <ul className="space-y-1 text-sm text-white/80">
                  <li>• Grant necessary permissions (camera, storage)</li>
                  <li>• Choose to start tutorial or skip to main app</li>
                  <li>• Connect to ESP8266 sensor (optional - demo mode available)</li>
                  <li>• Begin learning IoT and machine learning concepts</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Notice */}
        <Card className="mt-12 bg-yellow-500/10 border-yellow-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-300">
              <Shield className="w-5 h-5" />
              <span>Security Notice</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-yellow-300 mb-2">Normal Security Warnings:</h4>
                <ul className="text-sm text-yellow-200/80 space-y-1">
                  <li>• Android may show &quot;Install blocked&quot; initially</li>
                  <li>• &quot;Unknown app&quot; warnings are expected</li>
                  <li>• These are standard for APK installations</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-300 mb-2">Safety Tips:</h4>
                <ul className="text-sm text-yellow-200/80 space-y-1">
                  <li>• Only download from official sources</li>
                  <li>• Verify file size matches listed size</li>
                  <li>• Disable unknown sources after installation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card className="mt-8 bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              <span>Troubleshooting</span>
            </CardTitle>
            <CardDescription className="text-white/70">Common issues and solutions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-l-red-400 pl-4">
                <h4 className="font-semibold text-red-300">Installation Failed</h4>
                <p className="text-sm text-red-200/80">
                  Ensure you have enabled unknown sources and have sufficient storage space (100MB+)
                </p>
              </div>
              <div className="border-l-4 border-l-orange-400 pl-4">
                <h4 className="font-semibold text-orange-300">App Won&apos;t Open</h4>
                <p className="text-sm text-orange-200/80">
                  Check if your Android version is 6.0 or higher. Restart your device and try again.
                </p>
              </div>
              <div className="border-l-4 border-l-blue-400 pl-4">
                <h4 className="font-semibold text-blue-300">Sensor Connection Issues</h4>
                <p className="text-sm text-blue-200/80">
                  Use demo mode if ESP8266 hardware is not available. The app works fully without sensors.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <div className="mt-12 text-center">
          <Card className="bg-[#34C759]/10 border-[#34C759]/30 backdrop-blur-sm">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Need Additional Help?
              </h3>
              <p className="text-white/80 mb-4">
                Contact our support team for assistance with APK installation or app usage.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" className="border-[#34C759]/50 text-[#34C759] hover:bg-[#34C759]/10">
                  Email Support
                </Button>
                <Link href="/teachers-guide">
                  <Button variant="outline" className="border-[#34C759]/50 text-[#34C759] hover:bg-[#34C759]/10">
                    View Teachers Guide
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 