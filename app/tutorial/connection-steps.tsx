import { useTutorial } from '@/app/context/TutorialContext';
import { Colors as ColorPalette } from '@/constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
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
    FadeOut
} from 'react-native-reanimated';

// Connection steps content
const connectionSteps = [
  {
    title: 'Step 1: Identify Pins',
    description: 'Locate the following pins on your ESP8266:',
    points: [
      '3V (Power)',
      'G (Ground)',
      'A0 (Analog Input)',
      'D4 (Digital I/O for DHT11)'
    ],
    image: require('@/assets/sections/stepx/1.png') // Placeholder - use actual image
  },
  {
    title: 'Step 2: Connect Soil Sensor',
    description: 'Connect the Resistive Soil Moisture Sensor v1.2:',
    points: [
      'VCC → 3V',
      'GND → G',
      'OUT → A0'
    ],
    image: require('@/assets/sections/stepx/2.png') // Placeholder - use actual image
  },
  {
    title: 'Step 3: Connect DHT11 Sensor',
    description: 'Connect the DHT11 Sensor:',
    points: [
      'VCC → 3V',
      'GND → G',
      'DATA → D4'
    ],
    image: require('@/assets/sections/stepx/3.png') // Placeholder - use actual image
  }
];

export default function ConnectionStepsScreen() {
  const { updateLessonStep } = useTutorial();
  const [currentStep, setCurrentStep] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const isLastStep = currentStep === connectionSteps.length - 1;
  
  // For navigation purposes
  const params = useLocalSearchParams();
  
  // Handle back button press
  const handleBack = () => {
    if (currentStep > 0) {
      // Go back to previous step
      setLeaving(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setLeaving(false);
      }, 300);
    } else {
      // Go back to lesson 1
      router.back();
    }
  };
  
  // Handle next button press
  const handleNext = () => {
    if (currentStep < connectionSteps.length - 1) {
      // Go to next connection step
      setLeaving(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setLeaving(false);
      }, 300);
    } else {
      // On the last step, go to lesson 1 step 1 (ESP unit ready)
      router.push({
        pathname: "/tutorial/lesson1",
        params: { startAtStep: "1" }
      });
    }
  };
  
  // Render the current step
  const renderCurrentStep = () => {
    const step = connectionSteps[currentStep];
    
    // Render each pin point with a bullet point and stylized pin label
    const renderPinPoint = (point: string, index: number) => {
      // Check which type of pin this is
      const isGroundPin = point.includes('G (Ground)') || point.includes('GND');
      const isVccPin = point.includes('VCC') || point.includes('3V');
      const isAnalogPin = point.includes('A0') || point.includes('Analog');
      const isDataPin = point.includes('D4') || point.includes('DATA');
      
      // Parse the text to separate the pin identifier from descriptions
      let displayComponents = [];
      
      if (isGroundPin) {
        if (point.includes('G (Ground)')) {
          // First step - ground pin identification
          displayComponents.push(
            <View key="g-container" style={styles.pinPointRow}>
              <View style={styles.gndPin}>
                <Text style={styles.pinText}>G</Text>
              </View>
              <Text style={styles.pointText}> (Ground)</Text>
            </View>
          );
        } else if (point.includes('GND → G')) {
          // Connection steps - with arrow
          const parts = point.split('→');
          displayComponents.push(
            <View key="gnd-container" style={styles.pinPointRow}>
              <Text style={styles.pointText}>{parts[0].trim()}</Text>
              <Text style={styles.pointText}> → </Text>
              <View style={styles.gndPin}>
                <Text style={styles.pinText}>G</Text>
              </View>
            </View>
          );
        }
      } else if (isVccPin) {
        if (point.includes('3V (Power)')) {
          // First step - power pin identification
          displayComponents.push(
            <View key="vcc-container" style={styles.pinPointRow}>
              <View style={styles.vccPin}>
                <Text style={styles.pinText}>3V</Text>
              </View>
              <Text style={styles.pointText}> (Power)</Text>
            </View>
          );
        } else if (point.includes('VCC → 3V')) {
          // Connection steps - with arrow
          const parts = point.split('→');
          displayComponents.push(
            <View key="vcc-container" style={styles.pinPointRow}>
              <Text style={styles.pointText}>{parts[0].trim()}</Text>
              <Text style={styles.pointText}> → </Text>
              <View style={styles.vccPin}>
                <Text style={styles.pinText}>3V</Text>
              </View>
            </View>
          );
        }
      } else if (isAnalogPin) {
        if (point.includes('A0 (Analog Input)')) {
          // First step - analog pin identification
          displayComponents.push(
            <View key="analog-container" style={styles.pinPointRow}>
              <View style={styles.analogPin}>
                <Text style={styles.pinText}>A0</Text>
              </View>
              <Text style={styles.pointText}> (Analog Input)</Text>
            </View>
          );
        } else if (point.includes('OUT → A0')) {
          // Connection steps - with arrow
          const parts = point.split('→');
          displayComponents.push(
            <View key="analog-container" style={styles.pinPointRow}>
              <Text style={styles.pointText}>{parts[0].trim()}</Text>
              <Text style={styles.pointText}> → </Text>
              <View style={styles.analogPin}>
                <Text style={styles.pinText}>A0</Text>
              </View>
            </View>
          );
        }
      } else if (isDataPin) {
        if (point.includes('D4 (Digital I/O for DHT11)')) {
          // First step - digital pin identification
          displayComponents.push(
            <View key="data-container" style={styles.pinPointRow}>
              <View style={styles.dataPin}>
                <Text style={styles.pinText}>D4</Text>
              </View>
              <Text style={styles.pointText}> (Digital I/O for DHT11)</Text>
            </View>
          );
        } else if (point.includes('DATA → D4')) {
          // Connection steps - with arrow
          const parts = point.split('→');
          displayComponents.push(
            <View key="data-container" style={styles.pinPointRow}>
              <Text style={styles.pointText}>{parts[0].trim()}</Text>
              <Text style={styles.pointText}> → </Text>
              <View style={styles.dataPin}>
                <Text style={styles.pinText}>D4</Text>
              </View>
            </View>
          );
        }
      } else {
        // Default case for any other points
        displayComponents.push(
          <View key="default" style={styles.pinPointRow}>
            <Text style={styles.pointText}>{point}</Text>
          </View>
        );
      }
      
      return (
        <View key={index} style={styles.pointItem}>
          <View style={styles.pointItemRow}>
            <View style={styles.bulletPoint} />
            {displayComponents}
          </View>
        </View>
      );
    };
    
    return (
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>{step.title}</Text>
        
        <View style={styles.imageContainer}>
          <Image 
            source={step.image}
            style={styles.stepImage}
            resizeMode="contain"
          />
        </View>
        
        <Text style={styles.stepDescription}>{step.description}</Text>
        
        <View style={styles.pointsContainer}>
          {step.points.map((point, index) => renderPinPoint(point, index))}
        </View>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#194838', '#123524']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable 
              style={({pressed}) => [
                styles.navButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleBack}
            >
              <MaterialCommunityIcons name="chevron-left" size={30} color="white" />
              <Text style={styles.navButtonText}>Back</Text>
            </Pressable>
            
            <View style={styles.stepIndicator}>
              <Text style={styles.stepIndicatorText}>
                {currentStep + 1}/{connectionSteps.length}
              </Text>
            </View>
            
            <Pressable 
              style={({pressed}) => [
                styles.navButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleNext}
            >
              <Text style={styles.navButtonText}>
                {isLastStep ? 'Finish' : 'Next'}
              </Text>
              <MaterialCommunityIcons name="chevron-right" size={30} color="white" />
            </Pressable>
          </View>
          
          {/* Main Content */}
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.contentContainer}>
              {!leaving ? (
                <Animated.View 
                  style={styles.animatedContent}
                  entering={FadeInDown.duration(500)}
                  exiting={FadeOut.duration(300)}
                  key={`step-${currentStep}`}
                >
                  {renderCurrentStep()}
                </Animated.View>
              ) : null}
            </View>
          </ScrollView>
          
          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.stepProgressContainer}>
              <View style={styles.stepProgressBackground} />
              <View 
                style={[
                  styles.stepProgressFill, 
                  { width: `${((currentStep + 1) / connectionSteps.length) * 100}%` }
                ]} 
              />
            </View>
            
            <Pressable
              style={({pressed}) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleNext}
            >
              <Text style={styles.buttonText}>{isLastStep ? 'Go to Power Setup' : 'Next Step'}</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#123524',
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
    paddingTop: Platform.OS === 'android' ? 45 : 15,
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
  stepIndicator: {
    alignItems: 'center',
  },
  stepIndicatorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ColorPalette.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  animatedContent: {
    width: '100%',
  },
  stepContent: {
    alignItems: 'center',
    width: '100%',
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: ColorPalette.white,
    textAlign: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    width: '100%',
    height: 250,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 10,
  },
  stepImage: {
    width: '100%',
    height: '100%',
  },
  stepDescription: {
    fontSize: 18,
    color: ColorPalette.white,
    textAlign: 'center',
    marginBottom: 20,
  },
  pointsContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    alignItems: 'flex-start',
  },
  pointItem: {
    marginVertical: 6,
  },
  pointItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3BDF52',
    marginRight: 10,
  },
  pointText: {
    fontSize: 15,
    color: ColorPalette.white,
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  stepProgressContainer: {
    height: 4,
    width: 250,
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 2,
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
    fontWeight: '600',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  vccPin: {
    backgroundColor: '#FF3B30',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 6,
  },
  gndPin: {
    backgroundColor: '#000000',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 6,
  },
  dataPin: {
    backgroundColor: '#FFCC00',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 6,
  },
  analogPin: {
    backgroundColor: '#007AFF',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 6,
  },
  formattedPointText: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  pinPointRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
}); 