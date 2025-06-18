# SmartSoil Educational Hub

A comprehensive educational resource platform for teachers and students in the Philippines to learn IoT, data visualization, and machine learning through the SmartSoil app.

## Overview

This Next.js application provides:

- **Teachers Guide**: Complete navigation guide for educators to effectively teach the SmartSoil app
- **Download Guide**: Instructions for downloading and installing SmartSoil on Android devices
- **APK Installation**: Step-by-step guide for installing Android APK files

## Features

### Teachers Guide
- Step-by-step lesson navigation
- Teaching tips and best practices
- Interactive component explanations
- Troubleshooting common issues
- Quick reference for all 21 tutorial steps

### Download Guide
- Android APK installation instructions
- iOS App Store information (coming soon)
- System requirements
- Security notices and safety tips
- Troubleshooting support

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd edu
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
edu/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Main landing page
│   │   ├── teachers-guide/
│   │   │   └── page.tsx               # Teachers guide
│   │   └── download-guide/
│   │       ├── page.tsx               # Download options
│   │       └── android-apk/
│   │           └── page.tsx           # APK installation guide
│   ├── components/
│   │   └── ui/                        # shadcn/ui components
│   └── lib/
│       └── utils.ts                   # Utility functions
├── public/                            # Static assets
└── README.md
```

## Configuration

### APK Download Link
Update the APK download URL in the following files:
- `src/app/download-guide/android-apk/page.tsx`

```typescript
const APK_DOWNLOAD_URL = "https://your-domain.com/smartsoil.apk"
```

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Deploy automatically

### Other Platforms
```bash
npm run build
npm start
```

## Target Audience

- **Primary**: Teachers and educators in the Philippines
- **Secondary**: Students learning IoT and machine learning
- **Tertiary**: International educators teaching overseas

## SmartSoil App Overview

The SmartSoil app teaches:
1. **IoT Sensors & Hardware** (5 steps) - ESP8266 setup and sensor connections
2. **Data Visualization** (4 steps) - Understanding sensor data and dashboards  
3. **Machine Learning** (5 steps) - ML concepts and predictive watering

**Total**: 21 steps across 5 screens | Duration: 15-25 minutes

## Support

For technical support or questions about the educational platform:
- Email: support@softxinnovations.com
- Documentation: This README and in-app guides

## License

© 2024 SofTx Innovations Inc. All rights reserved.

---

**Educational resources for overseas teaching programs**
