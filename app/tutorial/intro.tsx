import { useTutorial } from '@/app/context/TutorialContext';
import { Colors as ColorPalette } from '@/constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Animated, {
    FadeIn,
    FadeInDown,
    FadeOut,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

// Tutorial introduction content
const introSteps = [
  {
    title: 'Welcome to SmartSoil',
    description: 'Learn how to build a smart plant-watering system.\nPress Next to see what we\'ll be covering.',
    image: require('@/assets/sections/intro/1.png'), // Use available image
  },
  {
    title: 'IoT (Internet of Things)',
    description: 'Discover how sensors collect data from soil and send it to your phone in real-time.',
    image: require('@/assets/sections/intro/2.png'), // Use available image
  },
  {
    title: 'App Design',
    description: 'Learn how mobile apps connect with devices and display sensor data.',
    image: require('@/assets/sections/intro/3.png'), // Use available image
  },
  {
    title: 'Machine Learning',
    description: 'You\'ll learn how models use patterns to make smart decisions.',
    image: require('@/assets/sections/intro/4.png'), // Use available image
  },
];

export default function IntroScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const isLastStep = currentStep === introSteps.length - 1;
  
  // Animated values for button feedback
  const backBtnScale = useSharedValue(1);
  const nextBtnScale = useSharedValue(1);
  const startTutorialBtnScale = useSharedValue(1);
  const skipAllBtnScale = useSharedValue(1);
  const skipLessonsBtnScale = useSharedValue(1);
  
  // Get the tutorial context
  const { skipTutorial } = useTutorial();

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
  
  const startTutorialBtnStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: startTutorialBtnScale.value }],
      backgroundColor: '#23C552',
    };
  });
  
  const skipAllBtnStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: skipAllBtnScale.value }],
    };
  });
  
  const skipLessonsBtnStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: skipLessonsBtnScale.value }],
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
    router.replace("/tutorial/lesson1");
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
                  // Go back to previous step
                  setLeaving(true);
                  setTimeout(() => {
                    setCurrentStep(currentStep - 1);
                    setLeaving(false);
                  }, 300);
                } else {
                  // On first step, go home
                  router.replace("/(tabs)");
                }
              }}
            >
              <Animated.View style={[styles.navButton, backBtnStyle]}>
                <MaterialCommunityIcons 
                  name={currentStep > 0 ? "chevron-left" : "home"} 
                  size={24} 
                  color="white" 
                />
                <Text style={styles.navButtonText}>
                  {currentStep > 0 ? "Back" : "Home"}
                </Text>
              </Animated.View>
            </Pressable>
            
            <View style={styles.lessonInfoContainer}>
              <Text style={styles.lessonTitle}>Introduction</Text>
            </View>
            
            <Pressable 
              onPressIn={() => {
                skipAllBtnScale.value = withTiming(0.95, { duration: 100 });
              }}
              onPressOut={() => {
                skipAllBtnScale.value = withTiming(1, { duration: 150 });
              }}
              onPress={handleSkipTutorial}
            >
              <Animated.View style={[styles.navButton, skipAllBtnStyle]}>
                <Text style={styles.navButtonText}>Skip All</Text>
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
                  onPressIn={() => {
                    startTutorialBtnScale.value = withTiming(0.95, { duration: 100 });
                  }}
                  onPressOut={() => {
                    startTutorialBtnScale.value = withTiming(1, { duration: 150 });
                  }}
                  onPress={handleStartTutorial}
                >
                  <Animated.View style={[styles.button, startTutorialBtnStyle]}>
                    <Text style={styles.buttonText}>Start Tutorial</Text>
                  </Animated.View>
                </Pressable>
                
                <Pressable
                  onPressIn={() => {
                    skipLessonsBtnScale.value = withTiming(0.95, { duration: 100 });
                  }}
                  onPressOut={() => {
                    skipLessonsBtnScale.value = withTiming(1, { duration: 150 });
                  }}
                  onPress={handleSkipTutorial}
                >
                  <Animated.View style={[styles.skipButton, skipLessonsBtnStyle]}>
                    <Text style={styles.skipButtonText}>Skip All Lessons</Text>
                  </Animated.View>
                </Pressable>
              </Animated.View>
            ) : (
              <>
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
                  onPressIn={() => {
                    nextBtnScale.value = withTiming(0.95, { duration: 100 });
                  }}
                  onPressOut={() => {
                    nextBtnScale.value = withTiming(1, { duration: 150 });
                  }}
                  onPress={handleNext}
                >
                  <Animated.View style={[styles.button, nextBtnStyle]}>
                    <Text style={styles.buttonText}>Next</Text>
                  </Animated.View>
                </Pressable>
              </>
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
    paddingTop: Platform.OS === 'android' ? 45 : 15,
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
  lessonTitle: {
    fontSize: 18,
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
  skipButton: {
    marginTop: 16,
    padding: 5,
  },
  skipButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
}); 