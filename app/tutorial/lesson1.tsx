import { useTutorial } from '@/app/context/TutorialContext';
import { Colors as ColorPalette } from '@/constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  Animated as RNAnimated,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeOut
} from 'react-native-reanimated';

// Lesson 1 steps
const lesson1Steps = [
  {
    title: 'Soil Moisture Sensor Setup',
    description: 'Choose an option below to continue with your sensor setup.',
    // First step will use custom cards instead of an image
  },
  {
    title: 'Connect Your ESP Unit',
    description: 'To begin using your soil moisture sensor, first power up your ESP32 microcontroller:',
    // Custom ESP power step with detailed instructions
    customComponent: true
  },
  {
    title: 'Understanding IoT Sensors',
    description: 'Your ESP device has two sensors for measuring environmental conditions.',
    customComponent: true
  },
  {
    title: 'Connect to the Soil Monitor',
    description: 'Connect to your ESP8266 WiFi network to view sensor data in real-time.',
    customComponent: true
  },
  {
    title: 'Congratulations!',
    description: 'You\'ve completed the soil moisture sensor setup tutorial. Now you\'re ready to start monitoring your plants.',
    customComponent: true
  }
];

// Constants
const ESP_BASE = "http://192.168.4.1"; // ESP8266 base URL in AP mode

// Lesson ID for tracking progress
const LESSON_ID = 'lesson1';

// Helper function to map values from one range to another
function mapValue(x: number, in_min: number, in_max: number, out_min: number, out_max: number): number {
  return Math.max(out_min, Math.min(out_max, (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min));
}

// Update the ESPDataVisualizer to show raw data in simple, smaller cards
const ESPDataVisualizer = ({ onConnected, demoMode: initialDemoMode = false }: { onConnected: () => void, demoMode?: boolean }) => {
  const [rawAnalog, setRawAnalog] = useState<number | null>(null);
  const [rawHumidity, setRawHumidity] = useState<string | null>(null);
  const [rawTemperature, setRawTemperature] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [demoMode, setDemoMode] = useState(initialDemoMode);
  
  // Animation values
  const fadeAnim = React.useRef(new RNAnimated.Value(1)).current;
  const scaleAnim = React.useRef(new RNAnimated.Value(1)).current;

  // Fetch data from ESP8266
  const fetchData = async (showLoadingIndicator = false) => {
    if (showLoadingIndicator) setRefreshing(true);

    try {
      // Animate value change
      RNAnimated.sequence([
        RNAnimated.parallel([
          RNAnimated.timing(fadeAnim, {
            toValue: 0.5,
            duration: 300,
            useNativeDriver: true,
          }),
          RNAnimated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        RNAnimated.parallel([
          RNAnimated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          RNAnimated.timing(scaleAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
      
      const dhtRes = await fetch(`${ESP_BASE}/raw_dht11`);
      const rawDHT = await dhtRes.text();
      const [humidityStr, temperatureStr] = rawDHT.trim().split(" ");

      const analogRes = await fetch(`${ESP_BASE}/raw_a`);
      const rawAnalogText = await analogRes.text();
      const rawAnalogValue = parseInt(rawAnalogText.trim());

      // Round to 1 significant figure for simplicity
      const tempRounded = Math.round(parseFloat(temperatureStr || "0"));
      const humRounded = Math.round(parseFloat(humidityStr || "0"));

      setRawHumidity(humRounded.toString());
      setRawTemperature(tempRounded.toString());
      setRawAnalog(rawAnalogValue);
      setLastUpdated(new Date().toLocaleTimeString());
      setConnectionError(false);
      setDemoMode(false);
      
      // Notify that we successfully connected
      if (loading) {
        onConnected();
      }
    } catch (error) {
      console.log("ESP connection not available, using demo mode");
      setConnectionError(true);
      setDemoMode(true);
      if (rawAnalog === null) {
        // Set some mock data for display when not connected
        setRawAnalog(642);
        setRawHumidity("59");
        setRawTemperature("24");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Manual refresh handler
  const onRefresh = () => {
    fetchData(true);
  };

  // Set up the interval to fetch data
  useEffect(() => {
    fetchData(); // Fetch data on first load
    const interval = setInterval(() => fetchData(), 3000); // Refresh every 3 sec
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <View style={styles.espDataContainer}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.dataCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.sensorDataTitle}>Raw Sensor Data</Text>
            {!loading && !connectionError && (
              <View style={styles.connectionStatus}>
                <View style={[styles.statusDot, { backgroundColor: '#28a745' }]} />
                <Text style={styles.statusText}>Connected</Text>
              </View>
            )}
            {connectionError && (
              <View style={styles.connectionStatus}>
                <View style={[styles.statusDot, { backgroundColor: '#dc3545' }]} />
                <Text style={styles.statusText}>Disconnected</Text>
              </View>
            )}
            {demoMode && (
              <View style={styles.demoModeTag}>
                <Text style={styles.demoModeText}>DEMO</Text>
              </View>
            )}
          </View>
          
          {loading && rawAnalog === null ? (
            <View style={styles.connectingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.connectingTitle}>Connecting to ESP8266...</Text>
              <Text style={styles.connectingDescription}>
                Make sure you're connected to the ESP8266_SoilMonitor_XX WiFi network.
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.rawDataContainer}>
                <View style={styles.rawDataCard}>
                  <Text style={styles.rawDataLabel}>Soil Analog</Text>
                  <Text style={styles.rawDataValue}>
                    {rawAnalog !== null ? rawAnalog : '--'}
                  </Text>
                  <Text style={styles.rawDataUnit}>raw (0-1023)</Text>
                </View>
                
                <View style={styles.rawDataCard}>
                  <Text style={styles.rawDataLabel}>Temperature</Text>
                  <Text style={styles.rawDataValue}>
                    {rawTemperature !== null ? rawTemperature : '--'}
                  </Text>
                  <Text style={styles.rawDataUnit}>°C</Text>
                </View>
                
                <View style={styles.rawDataCard}>
                  <Text style={styles.rawDataLabel}>Humidity</Text>
                  <Text style={styles.rawDataValue}>
                    {rawHumidity !== null ? rawHumidity : '--'}
                  </Text>
                  <Text style={styles.rawDataUnit}>%</Text>
                </View>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoText}>
                  Last update: {lastUpdated || 'Never'}
                </Text>
              </View>
              
              <View style={styles.codeSnippet}>
                <Text style={styles.codeComment}>// Raw sensor data endpoints</Text>
                <Text style={styles.codeLine}>GET /raw_a              // Analog pin (soil)</Text>
                <Text style={styles.codeLine}>GET /raw_dht11          // Temperature, humidity</Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

// Simplified final step component that doesn't use hooks
const SimplifiedLastStep = ({ onNextPress }: { onNextPress: () => void }) => {
  return (
    <View style={styles.lessonContent}>
      <View style={styles.finalStepContainer}>
        <View style={styles.keyLearningsContainer}>
          <Text style={styles.keyLearningsTitle}>Key Learnings</Text>
          <View style={styles.learningItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.learningText}>ESP8266 setup and configuration</Text>
          </View>
          <View style={styles.learningItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.learningText}>Temperature and humidity sensor readings</Text>
          </View>
        </View>
        
        <View style={[styles.keyLearningsContainer, {marginTop: 20}]}>
          <Text style={styles.keyLearningsTitle}>Next Steps</Text>
          <View style={styles.learningItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.learningText}>Soil moisture measurement and Analysis</Text>
          </View>
          <View style={styles.learningItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.learningText}>Basic IoT data visualization</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function Lesson1Screen() {
  const { updateLessonStep, completeLesson } = useTutorial();
  const [currentStep, setCurrentStep] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [espConnected, setEspConnected] = useState(false);
  const isLastStep = currentStep === lesson1Steps.length - 1;
  
  // Check for navigation parameters
  const params = useLocalSearchParams();
  
  // Initialize lesson progress when component mounts
  useEffect(() => {
    // Check if we should go to the last step (coming back from lesson 2)
    if (params.goToLastStep === "true") {
      setCurrentStep(lesson1Steps.length - 1);
      setEspConnected(true); // Make sure we're marked as connected
    }
    // Check if we should start at a specific step (coming from connection-steps)
    else if (params.startAtStep) {
      const stepIndex = parseInt(params.startAtStep as string, 10);
      if (!isNaN(stepIndex) && stepIndex >= 0 && stepIndex < lesson1Steps.length) {
        setCurrentStep(stepIndex);
        // Mark as connected if going directly to a step that requires connection
        if (stepIndex > 3) {
          setEspConnected(true);
        }
      }
    }
  }, []);
  
  // Update lesson progress when current step changes
  useEffect(() => {
    updateLessonStep(LESSON_ID, currentStep);
  }, [currentStep]);
  
  // Update the handleNext function to handle the completion properly
  const handleNext = () => {
    // Only allow progress if we're not on step 3 (ESP connection step)
    // or if we've already connected to the ESP
    if (currentStep === 3 && !espConnected) {
      // Don't allow progression if not connected to ESP
      return;
    }
    
    // If this is the last step, mark the lesson as complete and navigate to lesson2
    if (currentStep === lesson1Steps.length - 1) {
      completeLesson(LESSON_ID);
      try {
        router.push("/tutorial/lesson2");
      } catch (error) {
        console.error("Navigation error:", error);
        // Fallback navigation
        router.push("/");
      }
      return;
    }
    
    // Otherwise, go to the next step with animation
    setLeaving(true);
    setTimeout(() => {
      setCurrentStep(currentStep + 1);
      setLeaving(false);
    }, 300);
  };

  // Simple function to skip to the next step
  const skipConnectionStep = () => {
    setEspConnected(true); // Mark as connected so we can proceed
    setLeaving(true);
    setTimeout(() => {
      setCurrentStep(4); // Skip directly to the final step
      setLeaving(false);
    }, 300);
  };

  // Check if we should disable the Next button (only on the ESP connection step when not connected)
  const isNextButtonDisabled = currentStep === 3 && !espConnected;

  // Render current step content based on step index
  const renderStepContent = () => {
    const currentStepData = lesson1Steps[currentStep];
    
    // Always show title and description (except for step 0 which has cards)
    const headerContent = currentStep === 0 ? null : (
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
        stepContent = renderOptionsCards();
        break;
      case 1:
        stepContent = (
          <>
            <View style={styles.espImageContainer}>
              <Image 
                source={require('@/assets/sections/lesson-1/3.png')}
                style={styles.espConnectionImage}
                resizeMode="contain"
              />
            </View>
            {headerContent}
            <View style={styles.instructionsContainer}>
              <View style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>1</Text>
                </View>
                <Text style={styles.instructionText}>Connect a micro-USB cable to your ESP32</Text>
              </View>
              
              <View style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>2</Text>
                </View>
                <Text style={styles.instructionText}>Plug the USB cable into a power source</Text>
              </View>
              
              <View style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>3</Text>
                </View>
                <Text style={styles.instructionText}>Check that the power LED is lit up.</Text>
              </View>
            </View>
          </>
        );
        break;
      case 2:
        stepContent = (
          <>
            {headerContent}
            {renderIoTSensorsStep()}
          </>
        );
        break;
      case 3:
        stepContent = (
          <>
            {headerContent}
            <ESPDataVisualizer 
              onConnected={() => setEspConnected(true)} 
              demoMode={false}
            />
            <Pressable
              style={({pressed}) => [
                styles.skipConnectionButton,
                pressed && styles.buttonPressed
              ]}
              onPress={() => {
                // Just mark this lesson as complete and go to main app
                completeLesson(LESSON_ID);
                router.replace("/tutorial/lesson2");
              }}
            >
              <Text style={styles.skipConnectionText}>Having trouble connecting? Skip</Text>
            </Pressable>
          </>
        );
        break;
      case 4:
        stepContent = (
          <>
            {headerContent}
            <SimplifiedLastStep onNextPress={handleNext} />
          </>
        );
        break;
      default:
        stepContent = (
          <>
            {headerContent}
            {!currentStepData.customComponent && (
              <Image 
                source={require('@/assets/sections/onboarding/background.jpg')} 
                style={styles.stepImage}
                resizeMode="contain"
              />
            )}
          </>
        );
    }
    
    return stepContent;
  };
  
  // Render two option cards for the first step
  const renderOptionsCards = () => {
    return (
      <View style={styles.cardsContainer}>
        <Pressable 
          style={({pressed}) => [
            styles.card,
            pressed && styles.cardPressed
          ]}
          onPress={() => {
            // Navigate to the connection help screen
            router.push("/tutorial/connection-steps");
          }}
        >
          <View style={styles.cardInner}>
            <Image 
              source={require('@/assets/sections/lesson-1/1.png')} 
              style={[styles.cardImage]} 
              resizeMode="contain"
            />
            <Text style={styles.cardTitle}>Help Me with Connection</Text>
            <Text style={styles.cardDescription}>
              Get step-by-step guidance on how to set up and connect your ESP8266 sensor unit
            </Text>
          </View>
        </Pressable>
        
        <Pressable 
          style={({pressed}) => [
            styles.card,
            pressed && styles.cardPressed
          ]}
          onPress={() => {
            // Handle ESP unit is ready - take to ESP connection step
            setCurrentStep(1);
          }}
        >
          <View style={styles.cardInner}>
            <Image 
              source={require('@/assets/sections/lesson-1/2.png')} 
              style={styles.cardImage} 
              resizeMode="contain"
            />
            <Text style={styles.cardTitle}>My ESP Unit is Ready</Text>
            <Text style={styles.cardDescription}>
              Start the tutorial with your ESP8266 already connected and powered
            </Text>
          </View>
        </Pressable>
      </View>
    );
  };
  
  // Add new components for each added step
  const renderIoTSensorsStep = () => {
    return (
      <View style={styles.lessonContent}>
        <View style={styles.sensorExplainerContainer}>
          <View style={styles.sensorItem}>
            <View style={styles.sensorImageContainer}>
              <Image 
                source={require('@/assets/sections/lesson-1/dht11.png')} // Replace with actual DHT11 image
                style={styles.sensorImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.sensorDetails}>
              <Text style={styles.sensorLabel}>DHT11 Temperature & Humidity</Text>
              <Text style={styles.sensorDescription}>
                The DHT11 sensor measures air temperature and humidity.
              </Text>
              <View style={styles.codeSnippet}>
                <Text style={styles.codeComment}>// Define the DHT sensor</Text>
                <Text style={styles.codeLine}>#define DHTPIN D4</Text>
                <Text style={styles.codeComment}>// Initialize sensor</Text>
                <Text style={styles.codeLine}>DHT dht(DHTPIN, DHTTYPE);</Text>
              </View>
            </View>
          </View>
          
          <View style={[styles.sensorItem, {marginTop: 20}]}>
            <View style={styles.sensorImageContainer}>
              <Image 
                source={require('@/assets/sections/lesson-1/cap-sensor.png')} // Replace with actual soil moisture sensor image
                style={styles.sensorImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.sensorDetails}>
              <Text style={styles.sensorLabel}>Capacitive Soil Moisture</Text>
              <Text style={styles.sensorDescription}>
                The capacitive soil moisture sensor measures water content in soil.
              </Text>
              <View style={styles.codeSnippet}>
                <Text style={styles.codeComment}>// Define soil moisture sensor</Text>
                <Text style={styles.codeLine}>#define SENSOR_PIN A0</Text>
                <Text style={styles.codeComment}>// Read analog value</Text>
                <Text style={styles.codeLine}>int value = analogRead(SENSOR_PIN);</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderConnectWiFiStep = () => {
    return (
      <View style={styles.lessonContent}>
        <View style={styles.wifiContainer}>
          <Text style={styles.wifiExplanation}>
            Your ESP device creates its own WiFi network that you can connect to directly:
          </Text>
          
          <View style={styles.codeSnippet}>
            <Text style={styles.codeComment}>// ESP creates its own WiFi network</Text>
            <Text style={styles.codeLine}>const char* ssid = "ESP8266_SoilMonitor_XX";</Text>
            <Text style={styles.codeLine}>const char* password = "12345678";</Text>
            <Text style={styles.codeLine}>WiFi.softAP(ssid, password);</Text>
          </View>
          
          <View style={styles.activityContainer}>
            <Text style={styles.activityTitle}>Connect to ESP's WiFi Network</Text>
            
            <View style={styles.compactStepContainer}>
              <View style={styles.activityStep}>
                <View style={styles.stepCircle}>
                  <Text style={styles.stepNumber}>1</Text>
                </View>
                <View style={styles.stepTextContainer}>
                  <Text style={styles.activityText}>
                    Go to your device WiFi settings and look for network named:
                  </Text>
                  <View style={styles.credentialsBox}>
                    <Text style={styles.credentialText}>ESP8266_SoilMonitor_XX</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.activityStep}>
                <View style={styles.stepCircle}>
                  <Text style={styles.stepNumber}>2</Text>
                </View>
                <View style={styles.stepTextContainer}>
                  <Text style={styles.activityText}>
                    Connect using this password:
                  </Text>
                  <View style={styles.credentialsBox}>
                    <Text style={styles.credentialText}>12345678</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        <Pressable
          style={({pressed}) => [
            styles.wifiButton,
            pressed && styles.buttonPressed
          ]}
          onPress={() => {
            // This would ideally open WiFi settings
            // Since we can't directly open settings in a web app, this is just for show
            alert("This would open WiFi settings on a real device");
          }}
        >
          <Text style={styles.wifiButtonText}>Open WiFi Settings</Text>
        </Pressable>

        <Pressable
          style={({pressed}) => [
            styles.troubleLink,
            pressed && styles.buttonPressed
          ]}
          onPress={() => {
            // Skip directly to the final step
            skipConnectionStep();
          }}
        >
          <Text style={styles.troubleLinkText}>Having trouble connecting?</Text>
        </Pressable>
      </View>
    );
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
              style={({pressed}) => [
                styles.navButton,
                pressed && styles.buttonPressed,
                isNextButtonDisabled && styles.navButtonDisabled
              ]}
              disabled={isNextButtonDisabled}
              onPress={() => {
                // If on step 1 or higher, go back to previous step
                if (currentStep > 0) {
                  setLeaving(true);
                  setTimeout(() => {
                    setCurrentStep(currentStep - 1);
                    setLeaving(false);
                  }, 300);
                } else {
                  // If on step 0, go back to intro
                  router.push("./intro");
                }
              }}
            >
              <MaterialCommunityIcons 
                name="chevron-left" 
                size={30} 
                color={isNextButtonDisabled ? "#888888" : "white"} 
              />
              <Text style={[
                styles.navButtonText,
                isNextButtonDisabled && styles.navButtonTextDisabled
              ]}>
                Back
              </Text>
            </Pressable>
            
            <View style={styles.stepIndicator}>
              <Text style={styles.stepIndicatorText}>{currentStep + 1}/{lesson1Steps.length}</Text>
            </View>
            
            <Pressable 
              style={({pressed}) => [
                styles.navButton,
                pressed && !isNextButtonDisabled && styles.buttonPressed,
                isNextButtonDisabled && styles.navButtonDisabled
              ]}
              disabled={isNextButtonDisabled}
              onPress={handleNext}
            >
              <Text style={[
                styles.navButtonText,
                isNextButtonDisabled && styles.navButtonTextDisabled
              ]}>
                {isLastStep ? 'Finish' : 'Next'}
              </Text>
              <MaterialCommunityIcons 
                name="chevron-right" 
                size={30} 
                color={isNextButtonDisabled ? "#888888" : "white"} 
              />
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
                {renderStepContent()}
              </Animated.View>
            ) : null}
          </View>
          
          <View style={styles.footer}>
            {/* Only show progress bar after the first step (step index 0) */}
            {currentStep > 0 && (
              <View style={styles.stepProgressContainer}>
                <View style={styles.stepProgressBackground} />
                <View 
                  style={[
                    styles.stepProgressFill, 
                    { width: `${((currentStep + 1) / lesson1Steps.length) * 100}%` }
                  ]} 
                />
              </View>
            )}
            
            {/* Show Next button for all steps after the first */}
            {currentStep > 0 && (
              <Pressable
                style={({pressed}) => [
                  styles.button,
                  pressed && !isNextButtonDisabled && styles.buttonPressed,
                  isNextButtonDisabled && styles.buttonDisabled
                ]}
                disabled={isNextButtonDisabled}
                onPress={handleNext}
              >
                <Text style={[
                  styles.buttonText,
                  isNextButtonDisabled && styles.buttonTextDisabled
                ]}>
                  {isLastStep ? 'Continue to Next Lesson' : 'Next'}
                </Text>
              </Pressable>
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#1f1503', // Fallback color matching the gradient end
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
    borderRadius: 8,
  },
  buttonPressed: {
    opacity: 0.7,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  navButtonText: {
    color: ColorPalette.white,
    marginHorizontal: 4,
    fontSize: 16,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonTextDisabled: {
    color: "#888888",
  },
  stepIndicator: {
    alignItems: 'center',
  },
  stepIndicatorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ColorPalette.white,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  stepContent: {
    width: '100%',
    alignItems: 'center',
  },
  stepImage: {
    width: 280,
    height: 200,
    marginTop: 30,
  },
  stepTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: ColorPalette.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  stepDescription: {
    fontSize: 18,
    color: ColorPalette.white,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 26,
    marginBottom: 20,
  },
  cardsContainer: {
    width: '100%',
    maxWidth: 320,
    marginTop: 10,
    gap: 20,
    alignItems: 'center',
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  
  },
  cardInner: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{scale: 0.98}],
  },
  cardImage: {
    width: '100%',
    height: 150,
    backgroundColor: 'transparent',
    padding: 5,
    marginTop: 15,
    resizeMode: 'contain',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: -0.1,
    color: '#fff',
    textAlign: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    paddingHorizontal: 15,
    paddingBottom: 15,
    lineHeight: 18,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#23C552',
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
  buttonDisabled: {
    backgroundColor: 'rgba(35, 197, 82, 0.5)', // Faded green
    opacity: 0.7,
  },
  buttonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
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
  espImageContainer: {
    width: '115%',
    alignItems: 'flex-start',
    position: 'relative',
    marginBottom: 25,
  },
  espConnectionImage: {
    width: '80%', 
    height: 180,
    marginLeft: -60, // Pull image to the left edge
    transformOrigin: 'left center',
  },
  instructionsContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    gap: 15,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  instructionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#23C552',
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionNumberText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  instructionText: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    lineHeight: 22,
  },
  // Sensor explanation styles
  lessonContent: {
    width: '100%',
    alignItems: 'center',
    marginTop: 0,
  },
  sensorExplainerContainer: {
    width: '100%',
    maxWidth: 500,
    paddingHorizontal: 5,
  },
  sensorItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sensorImageContainer: {
    width: 80,
    height: 140,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding:10,
    borderRadius: 8,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  sensorImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
  sensorDetails: {
    flex: 1,
  },
  sensorLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  sensorValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  sensorDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  codeSnippet: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    marginTop: 10,
  },
  codeComment: {
    color: '#88c0d0',
    fontSize: 10,
    fontFamily: 'Menlo',
    marginBottom: 0,

  },
  codeLine: {
    color: '#eceff4',
    fontSize: 11,
    fontFamily: 'Menlo',
    marginBottom: 6,
  },
  
  // WiFi connection styles
  wifiContainer: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginTop: 10,
  },
  wifiExplanation: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  activityContainer: {
    width: '100%',
    marginTop: 20,
  },
  activityTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  compactStepContainer: {
    width: '100%',
  },
  activityStep: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  stepTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#23C552',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activityText: {
    color: 'white',
    fontSize: 15,
    marginBottom: 8,
  },
  credentialsBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginTop: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    maxWidth: '100%',
  },
  credentialText: {
    color: '#1de9b6',
    fontSize: 16,
    fontFamily: 'Menlo',
  },
  
  // Data flow styles
  dataFlowContainer: {
    width: '100%',
    maxWidth: 500,
  },
  dataFlowIntro: {
    fontSize: 16,
    color: 'white',
    marginBottom: 20,
    lineHeight: 22,
  },
  dataFlowChart: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  dataFlowStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  dataFlowIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  dataFlowIconText: {
    fontSize: 18,
  },
  dataFlowArrow: {
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    height: 40,
  },
  arrowText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 18,
  },
  dataFlowText: {
    flex: 1,
  },
  dataFlowTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  dataFlowDesc: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 6,
  },
  liveCodeSnippet: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 6,
    padding: 10,
    marginTop: 5,
  },
  liveCalcRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 5,
  },
  miniCodeComment: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#88c0d0',
    marginBottom: 6,
  },
  liveCodeVarName: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#eceff4',
  },
  liveCodeValue: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#f08d49',
  },
  liveCodeOp: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#eceff4',
  },
  liveCodeResult: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#7ec699',
    fontWeight: 'bold',
  },
  liveCodeComment: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#88c0d0',
    marginLeft: 5,
  },
  liveCodeLine: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#eceff4',
    marginBottom: 3,
  },
  dataFlowConclusion: {
    fontSize: 15,
    color: 'white',
    lineHeight: 20,
    marginTop: 5,
  },
  continueToNextButton: {
    backgroundColor: '#23C552',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 300,
    marginTop: 30,
  },
  continueToNextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // ESP data visualization styles
  espDataContainer: {
    width: '100%',
    maxWidth: 500,
    marginTop: 15,
  },
  dataCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    width: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sensorDataTitle: {
    fontSize: 22,
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
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  connectingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  connectingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  connectingDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 20,
  },
  connectingIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
  },
  connectingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    margin: 4,
    opacity: 0.6,
  },
  dot1: {
    animationName: 'pulse',
    animationDuration: '1.5s',
    animationIterationCount: 'infinite',
    animationDelay: '0s',
  },
  dot2: {
    animationName: 'pulse',
    animationDuration: '1.5s',
    animationIterationCount: 'infinite',
    animationDelay: '0.3s',
  },
  dot3: {
    animationName: 'pulse',
    animationDuration: '1.5s',
    animationIterationCount: 'infinite',
    animationDelay: '0.6s',
  },
  connectingAttempt: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 10,
  },
  
  // Moisture display styles
  moistureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  moistureGaugeContainer: {
    marginRight: 15,
  },
  moistureGauge: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 6,
    borderColor: '#FFC107',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  moisturePercentage: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFC107',
  },
  moistureInfo: {
    flex: 1,
  },
  moistureLabel: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  moistureStatus: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  moistureDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 18,
  },
  sensorDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginVertical: 15,
  },
  
  // Temperature and humidity display styles  
  envMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  envMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
  },
  envIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  envIcon: {
    fontSize: 20,
  },
  envData: {
    flex: 1,
  },
  envLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  envValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  
  // Button styles
  wifiButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
    maxWidth: 500,
  },
  wifiButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  troubleLink: {
    marginTop: 15,
    paddingVertical: 8,
  },
  troubleLinkText: {
    color: '#007AFF',
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  skipConnectionButton: {
    marginTop: 15,
    paddingVertical: 8,
    alignSelf: 'center',
  },
  skipConnectionText: {
    color: '#007AFF',
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  
  // Architecture diagram styles
  architectureDiagram: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  archComponentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 10,
  },
  archComponent: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    width: 110,
  },
  archComponentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  archIconText: {
    fontSize: 20,
  },
  archComponentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  archComponentDesc: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  archArrow: {
    width: 60,
    alignItems: 'center',
  },
  archVerticalArrow: {
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  archArrowText: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  scrollContainer: {
    width: '100%',
  },
  infoItem: {
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    width: '100%',
  },
  reconnectButton: {
    backgroundColor: '#dc3545',
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  moistureStatusContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusResult: {
    fontSize: 14,
  },
  moistureVisualization: {
    marginTop: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 15,
    borderRadius: 8,
  },
  moistureScale: {
    height: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  moistureBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#28a745',
    borderRadius: 12,
  },
  scaleMarkers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    left: 0,
    right: 0,
    top: -20,
  },
  scaleMarker: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 30,
  },
  scaleLabel: {
    fontSize: 10,
    color: 'white',
    width: '20%',
    textAlign: 'center',
  },
  finalStepContainer: {
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  stepIconContainer: {
    backgroundColor: '#23C552',
    borderRadius: 30,
    padding: 10,
    marginBottom: 10,
  },
  finalStepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  finalStepDescription: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  keyLearningsContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 12,
    padding: 20,
  },
  keyLearningsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  learningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  bulletPoint: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  learningText: {
    fontSize: 16,
    color: 'white',
  },
  // Raw data metrics styles
  dataMetricsContainer: {
    width: '100%',
    padding: 5,
  },
  dataMetricBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  dataMetricLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  dataMetricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  dataMetricDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 5,
  },
  rawDataContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  rawDataCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 10,
    width: '32%',
    alignItems: 'center',
  },
  rawDataLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
  },
  rawDataValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  rawDataUnit: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  demoModeTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  demoModeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
}); 