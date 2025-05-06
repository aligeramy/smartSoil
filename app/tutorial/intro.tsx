import { useTutorial } from '@/app/context/TutorialContext';
import { Colors as ColorPalette } from '@/constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from 'react-native';
import Animated, {
    FadeIn,
    FadeInDown,
    FadeOut,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated';

// Tutorial introduction content
const introSteps = [
  {
    title: 'Welcome to Smart Soil',
    description: 'Learn how to build a smart plant-watering system.',
    image: require('@/assets/sections/onboarding/background.jpg'), // Replace with actual intro image
  },
  {
    title: 'Smart Monitoring',
    description: 'Monitor soil moisture and temperature in real time.',
    image: require('@/assets/sections/onboarding/background.jpg'), // Replace with actual image
  },
  {
    title: 'Data-Driven Insights',
    description: 'Get personalized recommendations based on plant type and conditions.',
    image: require('@/assets/sections/onboarding/background.jpg'), // Replace with actual image
  },
  {
    title: 'Ready to Begin?',
    description: 'Start your journey to smarter plant care.',
    image: require('@/assets/sections/onboarding/background.jpg'), // Replace with actual image
  },
];

export default function IntroScreen() {
  const { width } = useWindowDimensions();
  const [currentStep, setCurrentStep] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const scrollX = useSharedValue(0);
  const isLastStep = currentStep === introSteps.length - 1;
  
  // Get the tutorial context
  const { skipTutorial } = useTutorial();

  // Track scroll position for progress bar
  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  // Animated style for progress bar
  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${((scrollX.value / width) + currentStep) * (100 / introSteps.length)}%`,
    };
  });

  // Handle next step button press
  const handleNext = () => {
    if (currentStep < introSteps.length - 1) {
      setLeaving(true);
      // Wait for animation to complete before changing step
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setLeaving(false);
      }, 300);
    }
  };

  // Handle "Start Tutorial" button press
  const handleStartTutorial = () => {
    // Navigate to the first tutorial lesson
    router.push("./lesson1");
  };

  // Handle "Skip Tutorial" button press
  const handleSkipTutorial = () => {
    // Mark tutorial as skipped in context
    skipTutorial();
    // Navigate to main app
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </Pressable>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground} />
        <Animated.View style={[styles.progressFill, progressStyle]} />
      </View>

      <View style={styles.contentContainer}>
        {!leaving ? (
          <Animated.View 
            style={styles.stepContent}
            entering={FadeInDown.duration(500)}
            exiting={FadeOut.duration(300)}
          >
            <Image 
              source={introSteps[currentStep].image}
              style={styles.stepImage}
              resizeMode="contain"
            />
            
            <Text style={styles.stepTitle}>
              {introSteps[currentStep].title}
            </Text>
            
            <Text style={styles.stepDescription}>
              {introSteps[currentStep].description}
            </Text>
          </Animated.View>
        ) : null}
      </View>
      
      <View style={styles.footer}>
        {isLastStep ? (
          <Animated.View 
            style={styles.finalButtonsContainer}
            entering={FadeIn.duration(500)}
          >
            <View style={styles.stepCounter}>
              <Text style={styles.stepCounterText}>
                {currentStep + 1}/{introSteps.length}
              </Text>
            </View>
            
            <View style={styles.stepProgressContainer}>
              <View style={styles.stepProgressBackground} />
              <View 
                style={[
                  styles.stepProgressFill, 
                  { width: `${((currentStep + 1) / introSteps.length) * 100}%` }
                ]} 
              />
            </View>
            
            <Pressable
              style={styles.button}
              onPress={handleStartTutorial}
            >
              <Text style={styles.buttonText}>Start Tutorial</Text>
            </Pressable>
            
            <Pressable
              style={styles.skipButton}
              onPress={handleSkipTutorial}
            >
              <Text style={styles.skipButtonText}>Skip Tutorial</Text>
            </Pressable>
          </Animated.View>
        ) : (
          <>
            <View style={styles.stepCounter}>
              <Text style={styles.stepCounterText}>
                {currentStep + 1}/{introSteps.length}
              </Text>
            </View>
            
            <View style={styles.stepProgressContainer}>
              <View style={styles.stepProgressBackground} />
              <View 
                style={[
                  styles.stepProgressFill, 
                  { width: `${((currentStep + 1) / introSteps.length) * 100}%` }
                ]} 
              />
            </View>
            
            <Pressable
              style={styles.button}
              onPress={handleNext}
            >
              <Text style={styles.buttonText}>Next</Text>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#063B1D',
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    padding: 8,
  },
  progressContainer: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 20,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#23C552',
    borderRadius: 3,
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
    width: 200,
    height: 200,
    marginBottom: 30,
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
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  finalButtonsContainer: {
    width: '100%',
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
  skipButton: {
    marginTop: 16,
    padding: 5,
  },
  skipButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  stepCounter: {
    marginBottom: 10,
  },
  stepCounterText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
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
}); 