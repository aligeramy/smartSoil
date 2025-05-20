import { useTutorial } from '@/app/context/TutorialContext';
import { Colors as ColorPalette } from '@/constants/Colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

// Import centralized ESP utilities from lib index
import {
  fetchAllSensorData,
  moistureToAnalog
} from '@/lib';

// Lesson 2 steps
const lesson2Steps = [
  {
    title: 'Data Visualization',
    description: 'Learn how to display sensor data in meaningful ways for plant monitoring.',
    customComponent: true
  },
  {
    title: 'Raw Analog Values',
    description: 'See how soil moisture sensors output raw values that need interpretation.',
    customComponent: true
  },
  {
    title: 'Interactive Moisture Analysis',
    description: 'Practice interpreting soil moisture readings through an interactive simulation.',
    customComponent: true
  },
  {
    title: 'Creating Dashboards',
    description: 'A well designed dashboard helps you monitor soil conditions across multiple field locations for better crop management.',
    customComponent: true
  },
];

// Lesson ID for tracking progress
const LESSON_ID = 'lesson2';

// Mock sensor data for visualization
const mockSensorData = {
  moisture: 57,
  temperature: 24.3,
  humidity: 58.6,
  heatIndex: 25.1,
  rawAnalog: 642,
  resistanceTop: 5500,
  resistanceBottom: 10000 // Changed from 9800 to exactly 10000 ohms (10kΩ)
};

// Constants
let ESP_BASE = "http://192.168.4.1"; // ESP8266 base URL in AP mode

// First component - Introduction to Data Visualization
const DataVisualizationIntro = () => {
  // Add state for real sensor data
  const [sensorData, setSensorData] = useState(mockSensorData);
  const [connected, setConnected] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  
  // Fetch data from ESP8266
  const fetchData = async () => {
    if (demoMode) {
      // In demo mode, simulate small data changes
      const moistureVar = Math.floor(Math.random() * 10) - 5;
      const tempVar = (Math.random() * 1.5 - 0.75).toFixed(1);
      const humVar = (Math.random() * 3 - 1.5).toFixed(1);
      
      // Simulate resistance values changing with moisture
      const rTopVar = Math.floor(Math.random() * 500) - 250;
      const rBottomVar = Math.floor(Math.random() * 500) - 250;
      
      setSensorData(prev => ({
        moisture: Math.max(20, Math.min(80, prev.moisture + moistureVar)),
        temperature: Math.max(18, Math.min(30, prev.temperature + parseFloat(tempVar))),
        humidity: Math.max(40, Math.min(85, prev.humidity + parseFloat(humVar))),
        heatIndex: prev.temperature + 1.5,
        rawAnalog: moistureToAnalog(prev.moisture + moistureVar),
        resistanceTop: Math.max(2000, Math.min(8000, prev.resistanceTop + rTopVar)),
        resistanceBottom: Math.max(6000, Math.min(14000, prev.resistanceBottom + rBottomVar))
      }));
      setLastUpdated(new Date().toLocaleTimeString());
      return;
    }
    
    try {
      // Use the centralized functions to fetch data
      const data = await fetchAllSensorData();
      
      if (data) {
        setSensorData({
          moisture: data.moisture,
          temperature: data.temperature,
          humidity: data.humidity,
          heatIndex: data.temperature, // Use temperature as heat index for now
          rawAnalog: data.rawAnalog,
          resistanceTop: data.resistanceTop || 5500, // Default if not available
          resistanceBottom: data.resistanceBottom || 10000 // Changed from 9800 to exactly 10000 ohms (10kΩ)
        });
        
        setConnected(true);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.log("ESP connection not available, using demo mode");
      // If first attempt fails, switch to demo mode silently
      if (!connected && !demoMode) {
        setDemoMode(true);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    }
  };
  
  // Setup timer for data updates
  useEffect(() => {
    // Try connecting to ESP on first load
    fetchData();
    
    // Set up interval for updates
    const timer = setInterval(fetchData, 3000);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <View style={styles.lessonContent}>
      <Text style={styles.sectionTitle}>Current Sensor Readings</Text>
      
      <View style={styles.liveDataCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Live Sensor Data</Text>
          {connected ? (
            <View style={styles.connectionStatus}>
              <View style={[styles.statusDot, { backgroundColor: '#28a745' }]} />
              <Text style={styles.statusText}>Connected</Text>
            </View>
          ) : (
            <View style={styles.connectionStatus}>
              <Text style={styles.statusText}>Demo Mode</Text>
            </View>
          )}
          {demoMode && (
            <View style={styles.demoModeTag}>
              <Text style={styles.demoModeText}>DEMO</Text>
            </View>
          )}
        </View>
        
        <View style={styles.dataDisplay}>
          <View style={styles.dataGauge}>
            <View style={[
              styles.gaugeCircle, 
              { borderColor: getMoistureColor(sensorData.moisture) }
            ]}>
              <Text style={[
                styles.gaugeValue, 
                { color: getMoistureColor(sensorData.moisture) }
              ]}>
                {sensorData.moisture}%
              </Text>
              {demoMode && (
                <View style={styles.demoIndicator}>
                  <Text style={styles.demoIndicatorText}>DEMO</Text>
                </View>
              )}
            </View>
            <Text style={styles.gaugeLabel}>Soil Moisture</Text>
          </View>
          
          <View style={styles.dataMetrics}>
            <View style={styles.metricRow}>
              <View style={styles.metricIcon}>
                <Ionicons name="thermometer-outline" size={20} color="#ff9500" />
              </View>
              <View>
                <Text style={styles.metricLabel}>Temperature</Text>
                <Text style={styles.metricValue}>{sensorData.temperature.toFixed(1)}°C</Text>
              </View>
            </View>
            
            <View style={styles.metricRow}>
              <View style={styles.metricIcon}>
                <Ionicons name="water-outline" size={20} color="#007AFF" />
              </View>
              <View>
                <Text style={styles.metricLabel}>Humidity</Text>
                <Text style={styles.metricValue}>{sensorData.humidity.toFixed(1)}%</Text>
              </View>
            </View>
            
            <View style={styles.metricRow}>
              <View style={styles.metricIcon}>
                <Ionicons name="flame-outline" size={20} color="#FF3B30" />
              </View>
              <View>
                <Text style={styles.metricLabel}>Heat Index</Text>
                <Text style={styles.metricValue}>{sensorData.heatIndex.toFixed(1)}°C</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.lastUpdatedContainer}>
          <Text style={styles.lastUpdatedText}>
            Last updated: {lastUpdated || 'Never'}
            {demoMode && ' (Demo Mode)'}
          </Text>
        </View>
      </View>
    </View>
  );
};

// Get appropriate color based on moisture level
const getMoistureColor = (moisture: number) => {
  if (moisture < 30) return '#dc3545'; // Dry - red
  if (moisture < 60) return '#ffc107'; // Medium - yellow
  return '#28a745'; // Wet - green
};

// Get descriptive status based on moisture value
const getMoistureStatus = (moisture: number) => {
  if (moisture >= 80) return "Very Wet 🌊";
  if (moisture >= 60) return "Wet 💧";
  if (moisture >= 40) return "Moist 🌱";
  if (moisture >= 20) return "Dry 🌾";
  return "Very Dry 🌵";
};

// First component for Understanding Analog Values
const AnalogValuesComponent = () => {
  return (
    <View style={styles.lessonContent}>
      <View style={styles.contentCard}>
        <Text style={[styles.cardSectionTitle, {marginTop: 0}]}>Turning Voltage to Percentages</Text>
        <Text style={styles.contentText}>
          Soil moisture sensors provide raw analog values between 0-1023 based on the amount of moisture in the soil:
        </Text>
        <View style={styles.analogScaleContainer}>
          <View style={styles.analogPercentLabels}>
            <Text style={styles.analogPercentValue}>0%</Text>
            <Text style={styles.analogPercentValue}>50%</Text>
            <Text style={styles.analogPercentValue}>100%</Text>
          </View>
          <View style={styles.analogScale}>
            <View style={styles.analogScaleLabels}>
              <Text style={styles.analogScaleValue}>0</Text>
              <Text style={styles.analogScaleValue}>425</Text>
              <Text style={styles.analogScaleValue}>850</Text>
            </View>
          </View>
          <View style={styles.analogScaleDescriptions}>
            <Text style={styles.analogDescription}>Dry Soil</Text>
            <Text style={styles.analogDescription}>Wet Soil</Text>
          </View>
        </View>
        
      </View>
      
      <View style={styles.voltageScaleContainer}>
        <View style={styles.voltageScaleWrapper}>
          <View style={styles.voltageLabelsRow}>
            <Text style={styles.voltageValue}>0V</Text>
            <Text style={styles.voltageValue}>1.7V</Text>
            <Text style={styles.voltageValue}>3.3V</Text>
            <Text style={styles.voltageValue}>5V</Text>
            <Text style={styles.voltageTitle}>Voltage Values</Text>
          </View>
          
          <View style={styles.voltageScaleLine}>
            <View style={styles.voltageScaleBar} />
            <View style={styles.voltageTicksContainer}>
              <View style={styles.voltageTick} />
              <View style={styles.voltageTick} />
              <View style={styles.voltageTick} />
              <View style={styles.voltageTick} />
            </View>
          </View>
          
          <View style={styles.analogLabelsRow}>
            <Text style={styles.analogValue}>0  </Text>
            <Text style={styles.analogValue}>     425</Text>
            <Text style={styles.analogValue}>     850</Text>
            <Text style={styles.analogValue}>  1023</Text>
            <Text style={styles.analogTitle}>Equivalent Analog Value</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// Interactive Moisture Analysis
const InteractiveMoistureComponent = () => {
  const [sliderValue, setSliderValue] = useState<number>(mockSensorData.moisture);
  const moistureStatus = getMoistureStatus(sliderValue);
  const plantStatus = getPracticalAdvice(sliderValue);
  
  // Calculate the equivalent analog value
  const equivalentAnalog = moistureToAnalog(sliderValue);
  
  // Custom simplified slider implementation
  const [isTouching, setIsTouching] = useState(false);
  const [sliderWidth, setSliderWidth] = useState(300); // Default width

  // Get practical plant care advice based on moisture value
  function getPracticalAdvice(moisture: number): { status: string; action: string; icon: string } {
    if (moisture < 20) {
      return {
        status: "Critically Dry",
        action: "Water immediately! Plant is severely dehydrated.",
        icon: "water"
      };
    } else if (moisture < 40) {
      return {
        status: "Needs Water",
        action: "Water soon. The soil is becoming too dry.",
        icon: "water-outline"
      };
    } else if (moisture < 60) {
      return {
        status: "Optimal",
        action: "Soil moisture is ideal. No action needed.",
        icon: "checkmark-circle-outline"
      };
    } else if (moisture < 80) {
      return {
        status: "Well Watered",
        action: "No need to water. Check again in a few days.",
        icon: "time-outline"
      };
    } else {
      return {
        status: "Over-watered",
        action: "Do not water! Allow soil to dry out to prevent root rot.",
        icon: "warning-outline"
      };
    }
  }

  // Get plant health status based on moisture and plant type
  const getPlantHealth = (moisture: number, type: 'cacti' | 'houseplant' | 'tropical'): 
    {status: string; color: string} => {
    
    if (type === 'cacti') {
      if (moisture < 30) return {status: "Healthy", color: "#23C552"};
      if (moisture < 60) return {status: "Too Wet", color: "#FFC107"};
      return {status: "Drowning", color: "#DC3545"};
    }
    
    if (type === 'houseplant') {
      if (moisture < 20) return {status: "Dying", color: "#DC3545"};
      if (moisture < 40) return {status: "Dry", color: "#FFC107"};
      if (moisture < 70) return {status: "Healthy", color: "#23C552"};
      return {status: "Over-wet", color: "#FFC107"};
    }
    
    // Tropical
    if (moisture < 40) return {status: "Dying", color: "#DC3545"};
    if (moisture < 60) return {status: "Dry", color: "#FFC107"};
    if (moisture < 90) return {status: "Healthy", color: "#23C552"};
    return {status: "Too Wet", color: "#FFC107"};
  };
  
  const cactiHealth = getPlantHealth(sliderValue, 'cacti');
  const houseplantHealth = getPlantHealth(sliderValue, 'houseplant');
  const tropicalHealth = getPlantHealth(sliderValue, 'tropical');

  return (
    <View style={[styles.lessonContent, {width: '100%'}]}>
      <View style={[styles.contentCard, {width: '100%'}]}>
        <View style={styles.headerWithValueContainer}>
          <Text style={styles.interactiveLabel}>Adjust the moisture level:</Text>
          <View style={styles.moistureValueRow}>
            <View style={styles.percentageDisplay}>
              <Text 
                style={[
                  styles.moisturePercentage,
                  { color: getMoistureColor(sliderValue) }
                ]}
              >
                {sliderValue}%
              </Text>
            </View>
            <View style={styles.analogValueDisplay}>
              <Text style={styles.analogValueText}>Analog: {equivalentAnalog}</Text>
            </View>
          </View>
        </View>
        
        <View
          style={styles.sliderContainer}
          onLayout={(event) => setSliderWidth(event.nativeEvent.layout.width)}
        >
          <View style={styles.sliderTrack} />
          <View 
            style={[
              styles.sliderFill, 
              { 
                width: `${sliderValue}%`,
                backgroundColor: getMoistureColor(sliderValue) 
              }
            ]} 
          />
          <View
            style={[
              styles.sliderThumb,
              {
                left: `${sliderValue}%`,
                transform: [{ translateX: -10 }],
                backgroundColor: getMoistureColor(sliderValue),
                borderColor: isTouching ? 'white' : 'rgba(255,255,255,0.5)',
              }
            ]}
          />
          <View style={styles.sliderScaleLabels}>
            <Text style={styles.sliderScaleValue}>0</Text>
            <Text style={styles.sliderScaleValue}>425</Text>
            <Text style={styles.sliderScaleValue}>850</Text>
          </View>
          <Pressable
            style={styles.sliderPressArea}
            onTouchStart={() => setIsTouching(true)}
            onTouchEnd={() => setIsTouching(false)}
            onTouchMove={(event) => {
              const { locationX } = event.nativeEvent;
              const percentage = Math.min(100, Math.max(0, (locationX / sliderWidth) * 100));
              setSliderValue(Math.round(percentage));
            }}
          />
        </View>
        
        <View style={styles.sliderLabels}>
          <View style={styles.sliderLabelIcon}>
            <Ionicons name="leaf-outline" size={16} color="#cfd8dc" />
            <Text style={styles.sliderLabelSmall}>Cacti</Text>
          </View>
          <View style={styles.sliderLabelIcon}>
            <Ionicons name="flower-outline" size={16} color="#81c784" />
            <Text style={styles.sliderLabelSmall}>House</Text>
          </View>
          <View style={styles.sliderLabelIcon}>
            <Ionicons name="leaf" size={16} color="#4caf50" />
            <Text style={styles.sliderLabelSmall}>Tropical</Text>
          </View>
        </View>
        
        <View style={styles.plantTypesGrid}>
          <View style={styles.plantTypeItem}>
            <View style={styles.plantIconContainer}>
              <Ionicons name="leaf-outline" size={22} color="#cfd8dc" />
            </View>
            <Text style={styles.plantTypeTitle}>Cacti & Succulents</Text>
            <Text style={styles.plantTypeRange}>10-30%</Text>
            <View style={[styles.plantHealthIndicator, {backgroundColor: cactiHealth.color}]}>
              <Text style={styles.plantHealthText}>{cactiHealth.status}</Text>
            </View>
          </View>
          
          <View style={styles.plantTypeItem}>
            <View style={styles.plantIconContainer}>
              <Ionicons name="flower-outline" size={22} color="#81c784" />
            </View>
            <Text style={styles.plantTypeTitle}>Most Houseplants</Text>
            <Text style={styles.plantTypeRange}>40-60%</Text>
            <View style={[styles.plantHealthIndicator, {backgroundColor: houseplantHealth.color}]}>
              <Text style={styles.plantHealthText}>{houseplantHealth.status}</Text>
            </View>
          </View>
          
          <View style={styles.plantTypeItem}>
            <View style={styles.plantIconContainer}>
              <Ionicons name="leaf" size={22} color="#4caf50" />
            </View>
            <Text style={styles.plantTypeTitle}>Tropical Plants</Text>
            <Text style={styles.plantTypeRange}>60-80%</Text>
            <View style={[styles.plantHealthIndicator, {backgroundColor: tropicalHealth.color}]}>
              <Text style={styles.plantHealthText}>{tropicalHealth.status}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

// Fourth component - Creating Smart Dashboards  
const DashboardDesignComponent = () => {
  return (
    <View style={styles.lessonContent}>
      
      <View style={styles.dashboardWrapperContainer}>
        <View style={styles.dashboardContainer}>
          <View style={styles.dashboardHeader}>
            <Text style={styles.dashboardTitle}>My Coffee Farm</Text>
            <View style={styles.dashboardStats}>
              <Text style={styles.dashboardStatText}>3 Field Locations • 2 Need Irrigation</Text>
            </View>
          </View>
          
          <View style={styles.plantsList}>
            <View style={styles.plantCard}>
              <View style={styles.plantCardHeader}>
                <Text style={styles.plantName}>Field A - North</Text>
                <View style={styles.statusContainer}>
                  <View style={[styles.statusIndicator, { backgroundColor: '#dc3545' }]} />
                  <Text style={styles.dashboardStatusText}>Needs Water</Text>
                </View>
              </View>
              <View style={styles.plantCardBody}>
                <View style={styles.plantValueItem}>
                  <Ionicons name="water" size={16} color="#007AFF" />
                  <Text style={styles.plantValueText}>18% - Critical</Text>
                </View>
                <View style={styles.plantValueItem}>
                  <Ionicons name="thermometer-outline" size={16} color="#FF9500" />
                  <Text style={styles.plantValueText}>24°C</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.plantCard}>
              <View style={styles.plantCardHeader}>
                <Text style={styles.plantName}>Field B - Hillside</Text>
                <View style={styles.statusContainer}>
                  <View style={[styles.statusIndicator, { backgroundColor: '#28a745' }]} />
                  <Text style={styles.dashboardStatusText}>Optimal</Text>
                </View>
              </View>
              <View style={styles.plantCardBody}>
                <View style={styles.plantValueItem}>
                  <Ionicons name="water" size={16} color="#007AFF" />
                  <Text style={styles.plantValueText}>63% - Good</Text>
                </View>
                <View style={styles.plantValueItem}>
                  <Ionicons name="thermometer-outline" size={16} color="#FF9500" />
                  <Text style={styles.plantValueText}>23°C</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.plantCard}>
              <View style={styles.plantCardHeader}>
                <Text style={styles.plantName}>Field C - River Side</Text>
                <View style={styles.statusContainer}>
                  <View style={[styles.statusIndicator, { backgroundColor: '#ffc107' }]} />
                  <Text style={styles.dashboardStatusText}>Check Soon</Text>
                </View>
              </View>
              <View style={styles.plantCardBody}>
                <View style={styles.plantValueItem}>
                  <Ionicons name="water" size={16} color="#007AFF" />
                  <Text style={styles.plantValueText}>35% - Medium</Text>
                </View>
                <View style={styles.plantValueItem}>
                  <Ionicons name="thermometer-outline" size={16} color="#FF9500" />
                  <Text style={styles.plantValueText}>21°C</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function Lesson2Screen() {
  const { updateLessonStep, completeLesson } = useTutorial();
  const [currentStep, setCurrentStep] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const isLastStep = currentStep === lesson2Steps.length - 1;
  
  // Animated values for button feedback
  const backBtnScale = useSharedValue(1);
  const nextBtnScale = useSharedValue(1);
  const skipBtnScale = useSharedValue(1);
  
  // Animated styles for buttons
  const backBtnStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: backBtnScale.value }],
    };
  });
  
  const nextBtnStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: nextBtnScale.value }],
      backgroundColor: '#23C552',
    };
  });
  
  const skipBtnStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: skipBtnScale.value }],
    };
  });
  
  // Initialize lesson progress when component mounts
  useEffect(() => {
    updateLessonStep(LESSON_ID, currentStep);
  }, [currentStep]);
  
  // Handle the "Next" button press
  const handleNext = () => {
    if (isLastStep) {
      // If this is the last step, mark the lesson as complete and go to lesson3
      completeLesson(LESSON_ID);
      router.push("/tutorial/lesson3");
    } else {
      // Otherwise, go to the next step with animation
      setLeaving(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setLeaving(false);
      }, 300);
    }
  };

  // Render content based on current step
  const renderStepContent = () => {
    const currentStepData = lesson2Steps[currentStep];
    
    // Always show title and description 
    const headerContent = (
      <>
        <Text style={styles.stepTitle}>
          {currentStepData.title}
        </Text>
        <Text style={styles.stepDescription}>
          {currentStepData.description}
        </Text>
      </>
    );
    
    // Render the appropriate content for each step
    let stepContent;
    switch (currentStep) {
      case 0:
        stepContent = (
          <>
            {headerContent}
            <DataVisualizationIntro />
          </>
        );
        break;
      case 1:
        stepContent = (
          <>
            {headerContent}
            <AnalogValuesComponent />
          </>
        );
        break;
      case 2:
        stepContent = (
          <>
            {headerContent}
            <View style={{width: 350, alignItems: 'center'}}>
              <InteractiveMoistureComponent />
            </View>
          </>
        );
        break;
      case 3:
        stepContent = (
          <>
            {headerContent}
            <DashboardDesignComponent />
          </>
        );
        break;
      default:
        stepContent = (
          <>
            {headerContent}
            <Image 
              source={require('@/assets/sections/onboarding/background.jpg')} 
              style={styles.stepImage}
              resizeMode="contain"
            />
          </>
        );
    }
    
    return stepContent;
  };

  return (
    <View style={styles.outerContainer}>
      <LinearGradient
        colors={['#194838', '#123524']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeContainer}>
          <View style={styles.header}>
            <Pressable 
              onPressIn={() => {
                backBtnScale.value = withTiming(0.95, { duration: 100 });
              }}
              onPressOut={() => {
                backBtnScale.value = withTiming(1, { duration: 150 });
              }}
              onPress={() => {
                if (currentStep > 0) {
                  setLeaving(true);
                  setTimeout(() => {
                    setCurrentStep(currentStep - 1);
                    setLeaving(false);
                  }, 300);
                } else {
                  // If on first step, go back to the last step of lesson 1
                  try {
                    // Add a query parameter to indicate we want to go to the last step
                    router.replace({
                      pathname: "/tutorial/lesson1",
                      params: { goToLastStep: "true" }
                    });
                  } catch (error) {
                    console.error("Navigation error:", error);
                    router.push("/tutorial/lesson1");
                  }
                }
              }}
            >
              <Animated.View style={[styles.navButton, backBtnStyle]}>
                <MaterialCommunityIcons name="chevron-left" size={24} color="white" />
                <Text style={styles.navButtonText}>Back</Text>
              </Animated.View>
            </Pressable>
            
            <View style={styles.lessonInfoContainer}>
              <Text style={styles.lessonLabel}>LESSON 2</Text>
              <Text style={styles.lessonTitle}>Data Visualization</Text>
            </View>
            
            <Pressable 
              onPressIn={() => {
                skipBtnScale.value = withTiming(0.95, { duration: 100 });
              }}
              onPressOut={() => {
                skipBtnScale.value = withTiming(1, { duration: 150 });
              }}
              onPress={() => {
                // Just mark this lesson as complete and go to main app
                completeLesson(LESSON_ID);
                router.replace("/tutorial/lesson3");
              }}
            >
              <Animated.View style={[styles.navButton, skipBtnStyle]}>
                <Text style={styles.navButtonText}>Skip</Text>
                <MaterialCommunityIcons name="chevron-right" size={24} color="white" />
              </Animated.View>
            </Pressable>
          </View>

          <View style={styles.contentContainer}>
            {!leaving ? (
              <Animated.View 
                style={styles.stepContent}
                entering={FadeInDown.duration(500)}
                exiting={FadeOut.duration(300)}
                key={`step-${currentStep}`}
              >
                <ScrollView 
                  contentContainerStyle={styles.scrollContainer}
                  showsVerticalScrollIndicator={false}
                >
                  {renderStepContent()}
                </ScrollView>
              </Animated.View>
            ) : null}
          </View>
          
          <View style={styles.footer}>
            <View style={styles.stepProgressContainer}>
              <View style={styles.stepProgressBackground} />
              <View 
                style={[
                  styles.stepProgressFill, 
                  { width: `${((currentStep + 1) / lesson2Steps.length) * 100}%` }
                ]} 
              />
            </View>
            
            <Pressable
              onPressIn={() => {
                nextBtnScale.value = withTiming(0.95, { duration: 100 });
              }}
              onPressOut={() => {
                nextBtnScale.value = withTiming(1, { duration: 150 });
              }}
              onPress={handleNext}
            >
              <Animated.View style={[styles.button, nextBtnStyle]}>
                <Text style={styles.buttonText}>
                  {isLastStep ? 'Start Next Lesson' : 'Next'}
                </Text>
              </Animated.View>
            </Pressable>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#123524', // Fallback color matching the gradient end
  },
  gradient: {
    flex: 1,
  },
  safeContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 45 : 15, // Add extra padding on Android for status bar
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    minWidth: 100,
    justifyContent: 'center',
  },
  navButtonText: {
    color: ColorPalette.white,
    marginHorizontal: 4,
    fontSize: 16,
  },
  lessonInfoContainer: {
    alignItems: 'center',
  },
  lessonLabel: {
    fontSize: 14,
    color: ColorPalette.white,
    opacity: 0.8,
    marginBottom: 2,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ColorPalette.white,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    width: '100%',
  },
  stepContent: {
    width: '100%',
    alignItems: 'center',
    maxWidth: 350,
  },
  stepImage: {
    width: 280,
    height: 200,
    marginTop: 30,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: ColorPalette.white,
    textAlign: 'center',
    marginBottom: 12,
  },
  stepDescription: {
    fontSize: 16,
    color: ColorPalette.white,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 22,
    marginBottom: 15,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 300,
  },
  buttonText: {
    color: ColorPalette.white,
    fontSize: 22,
  },
  stepProgressContainer: {
    height: 4,
    width: 250, // Slightly narrower than the button (300)
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 20,
  },
  stepProgressBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  stepProgressFill: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // White fill
    borderRadius: 2,
  },
  
  // Lesson content styles
  lessonContent: {
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginTop: 15,
    width: '100%',
  },
  contentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 15,
    alignSelf: 'center',
  },
  contentText: {
    fontSize: 14,
    color: 'white',
    lineHeight: 20,
    marginBottom: 15,
  },
  benefitsList: {
    width: '100%',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(35, 197, 82, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  benefitText: {
    fontSize: 14,
    color: 'white',
    flex: 1,
  },
  
  // Live data card styles
  liveDataCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    width: '100%',
    marginBottom: 20,
    alignSelf: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#28a745',
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dataDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dataGauge: {
    alignItems: 'center',
    width: '40%',
  },
  gaugeCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    marginBottom: 8,
  },
  gaugeValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  gaugeLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  dataMetrics: {
    width: '55%',
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  
  // Code snippet styles
  codeSnippet: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 8,
    width: '100%',
  },
  codeComment: {
    color: '#88c0d0',
    fontSize: 12,
    fontFamily: 'Menlo',
    marginBottom: 3,
  },
  codeLine: {
    color: '#eceff4',
    fontSize: 12,
    fontFamily: 'Menlo',
    marginBottom: 2,
  },
  
  // Interactive conversion styles
  interactiveLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  headerWithValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  moistureValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentageDisplay: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 10,
    marginRight: 5,
  },
  moistureStatusDisplay: {
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
  moisturePercentage: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  moistureStatusText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  sliderContainer: {
    height: 50, // Increased height to accommodate the scale labels
    marginTop: 10, // Added margin to separate from the label
    width: '100%',
    position: 'relative',
  },
  sliderTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 20, // Adjusted position to make room for labels
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    zIndex: 1
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    top: 20, // Adjusted position to align with track
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    zIndex: 2
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    position: 'absolute',
    top: 15, // Adjusted position to align with track
    zIndex: 3,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    marginLeft: 0, // Fix for edge positioning
  },
  sliderPressArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 4,
  },
  sliderScaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  sliderScaleValue: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '100%',
    paddingHorizontal: 5,
  
  },
  sliderLabelIcon: {
    alignItems: 'center',
    
  },
  sliderLabelSmall: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 3,
    
  },
  moistureDisplayContainer: {
    marginTop: 18,
    marginBottom: 8,
    flexDirection: 'column',
    width: '100%',
  },
  moisturePercentageContainer: {
    alignItems: 'center',
    marginBottom: 15,
    height: 70,
  },
  adviceContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignSelf: 'center',
    minHeight: 80,
  },
  adviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  adviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 6,
  },
  adviceText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 18,
  },
  plantTypesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0)',
    borderRadius: 12,
    alignSelf: 'center',
    width: '100%',
    marginTop: 15,
  },
  plantTypeItem: {
    alignItems: 'center',
    width: '30%',
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 10,
  },
  plantIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  plantTypeTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 2,
    height: 30,
    flexWrap: 'wrap',
  },
  plantTypeRange: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 6,
  },
  plantHealthIndicator: {
    padding: 6,
    borderRadius: 7,
    width: '90%',
    alignItems: 'center',
    minHeight: 24,
    marginTop: 10,
  },
  plantHealthText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dashboardWrapperContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 15,
  },
  dashboardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    width: '100%',
    marginBottom: 20,
  },
  dashboardHeader: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 15,
    width: '100%',
  },
  dashboardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,

  },
  dashboardStats: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  dashboardStatText: {
    fontSize: 14,
    color: 'white',
  },
  plantsList: {
    flexDirection: 'column',
    width: '100%',
  },
  plantCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    marginBottom: 10,
  },
  plantCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  plantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  dashboardStatusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  plantCardBody: {
    flexDirection: 'column',
    gap: 3,
    width: '100%',
    
  },
  plantValueItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plantValueText: {
    fontSize: 14,
    color: 'white',
    marginLeft: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 6,
    borderRadius: 6,
  },
  scrollContainer: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
  },
  cardSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginTop: 0,
    width: '100%',
  },
  analogScaleContainer: {
    marginVertical: 15,
    width: '100%',
  },
  analogScale: {
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 8,
    width: '100%',
    paddingHorizontal: 5,
  },
  analogScaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  analogScaleDescriptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  analogDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  analogScaleValue: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  analogPercentLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 5,
  },
  analogPercentValue: {
    fontSize: 14,
    color: '#88c0d0',
    fontWeight: 'bold',
  },
  conversionExample: {
    marginTop: 10,
    marginBottom: 15,
  },
  rangeInfoContainer: {
    width: '100%',
    marginVertical: 15,
  },
  rangeInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rangeInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    width: 100,
  },
  rangeInfoText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
  },
  conversionStep: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  stepNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    textAlign: 'center',
    lineHeight: 20,
    color: 'white',
    marginRight: 8,
    fontSize: 12,
    fontWeight: 'bold',
  },
  conversionStepContent: {
    flex: 1,
  },
  stepText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
  },
  stepValue: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  moistureBar: {
    height: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  moistureFill: {
    height: '100%',
    borderRadius: 12,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  scaleLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  voltageScaleContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  voltageScaleWrapper: {
    width: '100%',
    minWidth: 250,
    height: 120,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  voltageLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    position: 'relative',
    width: '90%',
  },
  voltageValue: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  voltageTitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    position: 'absolute',
    right: '50%',
    top: -35,
    marginRight: -45,
  },
  voltageScaleLine: {
    position: 'relative',
    height: 30,
    marginVertical: 10,
  },
  voltageScaleBar: {
    height: 2,
    backgroundColor: 'white',
    width: '100%',
    position: 'absolute',
    top: 13,
  },
  voltageTicksContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    top: 0,
  },
  voltageTick: {
    width: 2,
    height: 30,
    backgroundColor: 'white',
  },
  analogLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    position: 'relative',
  },
  analogValue: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  analogTitle: {

    fontSize: 14,
    position: 'absolute',
    right: '50%',
    bottom: -25,
    marginRight: -75,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  simulationContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  valueLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginRight: 10,
    width: 85,
  },
  valueDisplay: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  arrowContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 10,
  },
  formulaContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'center',
    marginTop: 5,
  },
  formula: {
    color: '#88c0d0',
    fontFamily: 'Menlo',
    fontSize: 14,
  },
  // Simple equation styles
  simpleEquationContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  equationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  equationPart: {
    color: '#88c0d0',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Menlo',
  },
  equationOperator: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    margin: 5,
  },
  equationResult: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  equationExplanation: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  connectionStatusRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  connectedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(40, 167, 69, 0.2)',
    padding: 8,
    borderRadius: 5,
  },
  mockStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    padding: 8,
    borderRadius: 5,
  },
  updateTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginLeft: 10,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 123, 255, 0.7)',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 8,
  },
  lastUpdatedContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  lastUpdatedText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  demoModeTag: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    padding: 4,
    borderRadius: 4,
    marginLeft: 10,
  },
  demoModeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  demoIndicator: {
    position: 'absolute',
    bottom: -5,
    backgroundColor: 'rgba(255, 193, 7, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  demoIndicatorText: {
    fontSize: 9,
    color: 'rgba(0, 0, 0, 0.7)',
    fontWeight: 'bold',
  },
  miniDemoTag: {
    backgroundColor: 'rgba(255, 193, 7, 0.5)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 6,
    alignSelf: 'center',
  },
  miniDemoText: {
    fontSize: 10,
    color: 'rgba(0, 0, 0, 0.7)',
    fontWeight: 'bold',
  },
  analogValueDisplay: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 10,
    marginLeft: 8,
  },
  analogValueText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
}); 