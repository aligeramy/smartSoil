import { useTutorial } from '@/app/context/TutorialContext';
import { Colors as ColorPalette } from '@/constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Image,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeOut
} from 'react-native-reanimated';

// Lesson 2 steps
const lesson2Steps = [
  {
    title: 'Water Pump Setup',
    description: 'Connect the water pump to your microcontroller for automated watering.',
    image: require('@/assets/sections/onboarding/background.jpg'), // Replace with actual lesson image
  },
  {
    title: 'Power Requirements',
    description: 'Learn about power sources and requirements for your system.',
    image: require('@/assets/sections/onboarding/background.jpg'), // Replace with actual lesson image
  },
  {
    title: 'Water Delivery',
    description: 'Set up your pipes and configure water flow to your plants.',
    image: require('@/assets/sections/onboarding/background.jpg'), // Replace with actual lesson image
  },
];

// Lesson ID for the context
const LESSON_ID = 'lesson2';

export default function Lesson2Screen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const isLastStep = currentStep === lesson2Steps.length - 1;
  
  // Get the tutorial context
  const { startLesson, updateLessonStep, completeLesson } = useTutorial();
  
  // Initialize lesson when component mounts
  useEffect(() => {
    startLesson(LESSON_ID, lesson2Steps.length);
  }, []);
  
  // Update lesson progress when step changes
  useEffect(() => {
    updateLessonStep(LESSON_ID, currentStep);
  }, [currentStep]);

  // Handle next step button press
  const handleNext = () => {
    if (currentStep < lesson2Steps.length - 1) {
      setLeaving(true);
      // Wait for animation to complete before changing step
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setLeaving(false);
      }, 300);
    } else {
      // Mark this lesson as complete
      completeLesson(LESSON_ID);
      // Return to home page for now (we'll add more lessons later)
      router.push('/(tabs)');
    }
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
        
        <View style={styles.lessonInfoContainer}>
          <Text style={styles.lessonLabel}>LESSON 2</Text>
          <Text style={styles.lessonTitle}>Water Pump Basics</Text>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground} />
        <View 
          style={[
            styles.progressFill, 
            { width: `${((currentStep + 1) / lesson2Steps.length) * 100}%` }
          ]} 
        />
      </View>

      <View style={styles.contentContainer}>
        {!leaving ? (
          <Animated.View 
            style={styles.stepContent}
            entering={FadeInDown.duration(500)}
            exiting={FadeOut.duration(300)}
          >
            <Image 
              source={lesson2Steps[currentStep].image}
              style={styles.stepImage}
              resizeMode="contain"
            />
            
            <Text style={styles.stepTitle}>
              {lesson2Steps[currentStep].title}
            </Text>
            
            <Text style={styles.stepDescription}>
              {lesson2Steps[currentStep].description}
            </Text>
          </Animated.View>
        ) : null}
      </View>
      
      <View style={styles.footer}>
        <View style={styles.stepCounter}>
          <Text style={styles.stepCounterText}>
            {currentStep + 1}/{lesson2Steps.length}
          </Text>
        </View>
        
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
          style={styles.button}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>
            {isLastStep ? 'Complete Lesson' : 'Next'}
          </Text>
        </Pressable>
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
    paddingVertical: 15,
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  lessonInfoContainer: {
    marginLeft: 20,
  },
  lessonLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 1,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ColorPalette.white,
  },
  progressContainer: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 20,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 20,
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
    width: 220,
    height: 220,
    marginBottom: 30,
  },
  stepTitle: {
    fontSize: 28,
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