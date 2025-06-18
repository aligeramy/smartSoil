# SmartSoil Tutorial App Documentation

## Overview

SmartSoil is an educational React Native/Expo application that teaches users how to build a smart plant-watering system using IoT sensors, data visualization, and machine learning. The app provides an interactive tutorial experience covering three main areas: IoT sensor setup, data visualization, and machine learning applications.

## App Architecture

### Technology Stack
- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **Animations**: React Native Reanimated
- **Styling**: React Native StyleSheet with LinearGradient
- **State Management**: React Context API
- **Hardware Integration**: ESP8266 microcontroller with sensors

### Project Structure
```
app/
├── tutorial/
│   ├── intro.tsx           # Tutorial introduction
│   ├── lesson1.tsx         # IoT Sensors & Hardware Setup
│   ├── lesson2.tsx         # Data Visualization
│   ├── lesson3.tsx         # Machine Learning
│   └── connection-steps.tsx # Hardware connection guide
├── context/
│   └── TutorialContext.tsx # Tutorial progress management
└── components/
    ├── ModelFeatureGame.tsx
    └── WateringDecisionTool.tsx
```

## Tutorial Flow

### 1. Introduction (`intro.tsx`)
**Purpose**: Welcomes users and provides an overview of what they'll learn.

**Features**:
- 4-step introduction covering IoT, App Design, and Machine Learning
- Animated step transitions with FadeInDown/FadeOut
- Progress indicator
- Options to start tutorial or skip all lessons
- Navigation to first lesson or main app

**Key Components**:
- Step-by-step image carousel
- Animated navigation buttons with haptic feedback
- Progress bar visualization

### 2. Lesson 1: IoT Sensors & Hardware Setup (`lesson1.tsx`)
**Purpose**: Teaches ESP8266 setup, sensor connections, and real-time data collection.

**Learning Objectives**:
- ESP8266 microcontroller setup
- Sensor wiring (DHT11 temperature/humidity, resistive soil moisture)
- WiFi network creation and connection
- Real-time data fetching from sensors

**Key Features**:
- **Interactive Setup Options**: Users can choose between guided connection help or proceeding with ready hardware
- **Hardware Connection Guide**: Step-by-step visual instructions for sensor wiring
- **Live Data Visualization**: Real-time sensor readings with connection status
- **Demo Mode**: Fallback simulation when hardware isn't available
- **ESP8266 Integration**: Direct communication with microcontroller via HTTP endpoints

**Technical Implementation**:
```javascript
// ESP8266 data fetching
const fetchESPData = async () => {
  const data = await fetchAllSensorData();
  // Updates moisture, temperature, humidity readings
};

// Sensor data endpoints
GET /raw_a              // Analog soil moisture
GET /raw_dht11          // Temperature & humidity
```

**Components**:
- `ESPDataVisualizer`: Live sensor data display
- Connection status indicators
- Raw analog value interpretation
- Sensor explanation with practical applications

### 3. Connection Steps (`connection-steps.tsx`)
**Purpose**: Detailed hardware setup guide for ESP8266 and sensors.

**Features**:
- **3-Step Visual Guide**:
  1. Pin identification (3V, G, A0, D4)
  2. Soil sensor connection (VCC→3V, GND→G, OUT→A0)
  3. DHT11 sensor connection (VCC→3V, GND→G, DATA→D4)
- Color-coded pin representations
- Visual wiring diagrams
- Step-by-step progression with validation

**Pin Color Coding**:
- **Red (VCC)**: Power pins (3V)
- **Black (GND)**: Ground pins
- **Blue (A0)**: Analog input
- **Yellow (D4)**: Digital I/O

### 4. Lesson 2: Data Visualization (`lesson2.tsx`)
**Purpose**: Teaches data interpretation, analog-to-digital conversion, and dashboard design.

**Learning Objectives**:
- Understanding raw sensor values vs. meaningful data
- Analog-to-digital conversion (0-1023 → 0-100%)
- Interactive data analysis
- Dashboard design principles

**Key Features**:
- **Live Data Display**: Real-time sensor readings with visual gauges
- **Analog Value Education**: Voltage scale (0V-5V) to analog values (0-1023)
- **Interactive Moisture Simulator**: Adjustable slider showing plant health for different species
- **Multi-Plant Dashboard**: Farm management interface example

**Interactive Components**:
```javascript
// Moisture level simulation
const InteractiveMoistureComponent = () => {
  const [sliderValue, setSliderValue] = useState(57);
  // Shows plant health for cacti, houseplants, tropical plants
  // Demonstrates optimal moisture ranges per plant type
};
```

**Plant Care Ranges**:
- **Cacti & Succulents**: 10-30% moisture
- **Most Houseplants**: 40-60% moisture  
- **Tropical Plants**: 60-80% moisture

### 5. Lesson 3: Machine Learning (`lesson3.tsx`)
**Purpose**: Introduces ML concepts for smart plant care and predictive watering.

**Learning Objectives**:
- ML model training process
- Feature selection importance
- Predictive watering decisions
- Environmental factor correlation

**Key Features**:
- **ML Concept Introduction**: Comparison of basic vs. ML-powered decisions
- **Training Process Visualization**: 4-step model development process
- **Interactive Feature Game**: Experiment with different ML features
- **Watering Decision Tool**: ML-powered recommendation system
- **Completion Summary**: Key learnings and next steps

**ML Training Process**:
1. **Data Collection**: 6+ months of sensor and weather data
2. **Feature Engineering**: Transform raw data into ML inputs
3. **Pattern Recognition**: Identify correlations between conditions
4. **Validation**: Test predictions against known outcomes

**Interactive Tools**:
- `ModelFeatureGame`: Feature selection experimentation
- `WateringDecisionTool`: ML-based watering recommendations

## Technical Implementation Details

### State Management
```javascript
// Tutorial Context for progress tracking
const TutorialContext = {
  updateLessonStep: (lessonId, step) => {},
  completeLesson: (lessonId) => {},
  skipTutorial: () => {}
};
```

### Hardware Integration
```javascript
// ESP8266 communication utilities
import {
  analogToMoisture,      // Convert raw analog to percentage
  fetchAllSensorData,    // Get all sensor readings
  getEspBaseUrl,         // ESP8266 network URL
  moistureToAnalog       // Convert percentage to analog
} from '@/lib';
```

### Animation System
- **React Native Reanimated**: Smooth transitions between steps
- **Shared Values**: Button press feedback and scaling
- **Animated Styles**: Dynamic color changes based on sensor values
- **Page Transitions**: FadeInDown/FadeOut for step changes

### Responsive Design
- **Platform Detection**: iOS/Android/Web specific styling
- **Safe Area Handling**: Proper status bar and notch accommodation
- **Flexible Layouts**: Adapts to different screen sizes
- **Touch Interactions**: Optimized for mobile and web

## Educational Approach

### Progressive Learning
1. **Hardware Basics**: Physical setup and connections
2. **Data Understanding**: Raw values to meaningful information
3. **Advanced Concepts**: ML and predictive analytics

### Interactive Elements
- **Hands-on Activities**: Real hardware interaction
- **Simulations**: Demo modes when hardware unavailable
- **Visual Learning**: Diagrams, charts, and animations
- **Immediate Feedback**: Real-time sensor data and responses

### Practical Applications
- **Real-world Context**: Coffee farm management example
- **Multiple Plant Types**: Different care requirements
- **Environmental Factors**: Weather integration
- **Automation Concepts**: Smart watering systems

## Key Features Summary

### User Experience
- ✅ Smooth animated transitions
- ✅ Progress tracking and resumption
- ✅ Skip options for experienced users
- ✅ Demo modes for accessibility
- ✅ Visual feedback and status indicators

### Educational Content
- ✅ Hardware setup and wiring
- ✅ Sensor data interpretation
- ✅ Data visualization techniques
- ✅ Machine learning fundamentals
- ✅ Practical IoT applications

### Technical Integration
- ✅ ESP8266 microcontroller support
- ✅ Real-time sensor data
- ✅ Cross-platform compatibility
- ✅ Offline demo capabilities
- ✅ Responsive design

## Navigation Flow

```
Intro → Lesson 1 → Connection Steps (optional) → Lesson 2 → Lesson 3 → Dashboard
  ↓         ↓              ↓                        ↓           ↓
Skip    Hardware      Pin Diagrams            Data Viz      ML Tools
All     Setup         & Wiring               & Analysis    & Prediction
```

## Company Information
- **Developer**: SofTx Innovations Inc
- **App Name**: SmartSoil
- **Purpose**: Educational IoT and ML tutorial platform
- **Target Audience**: Students, makers, and IoT enthusiasts

This comprehensive tutorial system provides a complete learning experience for building smart agricultural monitoring systems, combining hardware interaction, data science, and machine learning concepts in an accessible, interactive format.

## Page-by-Page Breakdown

### `intro.tsx` - Tutorial Introduction
**4 Steps:**
1. **Welcome to SmartSoil** - App overview and learning objectives
2. **IoT (Internet of Things)** - Sensor data collection concepts
3. **App Design** - Mobile app and device connectivity
4. **Machine Learning** - Pattern recognition for smart decisions

**Navigation Options:**
- Start Tutorial → Goes to `lesson1.tsx`
- Skip All Lessons → Goes to main dashboard
- Back/Home → Returns to main app

---

### `lesson1.tsx` - IoT Sensors & Hardware Setup
**5 Steps:**
1. **Soil Moisture Sensor Setup** - Choose setup path (guided help vs. ready hardware)
2. **Connect Your ESP Unit** - Power up device with visual instructions
3. **Understanding IoT Sensors** - DHT11 and resistive soil sensor explanation
4. **Connect to the Soil Monitor** - ESP8266 WiFi connection and live data display
5. **Congratulations!** - Lesson completion summary

**Special Features:**
- Option to branch to `connection-steps.tsx` for detailed wiring help
- Live ESP8266 data integration with demo mode fallback
- Real-time sensor readings display

---

### `connection-steps.tsx` - Hardware Connection Guide
**3 Steps:**
1. **Step 1: Identify Pins** - ESP8266 pin identification (3V, G, A0, D4)
2. **Step 2: Connect Soil Sensor** - Resistive sensor wiring (VCC→3V, GND→G, OUT→A0)
3. **Step 3: Connect DHT11 Sensor** - Temperature/humidity sensor wiring (VCC→3V, GND→G, DATA→D4)

**Visual Elements:**
- Color-coded pin diagrams
- Step-by-step wiring illustrations
- Pin connection validation

**Navigation:**
- Returns to `lesson1.tsx` step 1 after completion

---

### `lesson2.tsx` - Data Visualization
**4 Steps:**
1. **Data Visualization** - Live sensor readings with gauges and metrics
2. **Raw Analog Values** - Voltage to digital conversion education (0V-5V → 0-1023)
3. **Interactive Moisture Analysis** - Adjustable slider showing plant health for different species
4. **Creating Dashboards** - Multi-field farm management interface example

**Interactive Components:**
- Real-time data display with connection status
- Moisture level simulator with plant type comparisons
- Coffee farm dashboard mockup

---

### `lesson3.tsx` - Machine Learning
**5 Steps:**
1. **Introduction to Smart Prediction** - Basic vs. ML-powered decision comparison
2. **ML Model Training** - 4-step training process visualization
3. **Feature Selection** - Interactive game for experimenting with ML features (`ModelFeatureGame`)
4. **Watering Decision** - ML-powered recommendation tool (`WateringDecisionTool`)
5. **Lesson Complete!** - Summary of key learnings and completion

**Advanced Features:**
- Full-screen interactive ML tools
- Feature importance experimentation
- Predictive watering recommendations
- Environmental factor correlation

---

### Navigation Flow Summary
```
intro.tsx (4 steps)
    ↓
lesson1.tsx (5 steps)
    ↓ (optional branch)
connection-steps.tsx (3 steps) → back to lesson1.tsx
    ↓
lesson2.tsx (4 steps)
    ↓
lesson3.tsx (5 steps)
    ↓
Dashboard/Main App
```

**Total Tutorial Steps:** 21 steps across 5 screens
**Estimated Completion Time:** 15-25 minutes
**Hardware Required:** ESP8266, DHT11 sensor, Resistive soil moisture sensor (optional - demo modes available) 