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
import ModelFeatureGame from '../components/ModelFeatureGame';
import WateringDecisionTool from '../components/WateringDecisionTool';

// Lesson 3 steps
const lesson3Steps = [
  {
    title: 'Introduction to Smart Prediction',
    description: 'Discover how machine learning can help predict watering needs for your plants.',
    customComponent: true
  },
  {
    title: 'ML Model Training',
    description: 'Understand how machine learning models are trained using sensor data.',
    customComponent: true
  },
  {
    title: 'Feature Selection',
    description: 'Experiment with different features to see how they affect model performance.',
    customComponent: true
  },
  {
    title: 'Watering Decision',
    description: 'Try an interactive ML model that recommends when to water your plants based on the weather and soil conditions.',
    customComponent: true
  },
  {
    title: 'Lesson Complete!',
    description: 'You\'ve completed the machine learning journey for smart plant care.',
    customComponent: true
  }
];

// Lesson ID for tracking progress
const LESSON_ID = 'lesson3';

// First component - Introduction to ML in SmartSoil
const MLIntroduction = () => {
  return (
    <View style={styles.lessonContent}>
      <View style={styles.contentCard}>
        <Text style={styles.cardSectionTitle}>Beyond Basic Readings</Text>
        <Text style={styles.contentText}>
          We've learned how to collect sensor data and visualize soil moisture, temperature, and humidity. 
          But what if there was a way to combine all these factors to make smarter decisions using machine learning?
        </Text>
        
        <View style={styles.comparisonContainer}>
          <View style={styles.comparisonColumn}>
            <View style={styles.comparisonHeader}>
              <Ionicons name="water-outline" size={20} color="#007AFF" />
              <Text style={styles.comparisonTitle}>Basic Decision</Text>
            </View>
            <View style={styles.comparisonContent}>
              <Text style={styles.comparisonText}>
                "Soil moisture is 30% - plants need water soon."
              </Text>
            </View>
          </View>
          
          <View style={styles.comparisonColumn}>
            <View style={styles.comparisonHeader}>
              <Ionicons name="flash" size={20} color="#FF9500" />
              <Text style={styles.comparisonTitle}>ML-Powered</Text>
            </View>
            <View style={styles.comparisonContent}>
              <Text style={styles.comparisonText}>
                "Even at 30% moisture, ML could predict rain tomorrow and recommend waiting to avoid overwatering."
              </Text>
            </View>
          </View>
        </View>
      </View>
      
   
    </View>
  );
};

// Third component - ML Model Training
const MLModelTrainingComponent = () => {
  return (
    <View style={styles.lessonContent}>
      <View style={styles.contentCard}>
        <Text style={styles.cardSectionTitle}>How ML Models Learn</Text>
        <Text style={styles.contentText}>
          Machine learning models analyze patterns in data to make predictions. Here's how a soil moisture prediction model could be trained:
        </Text>
        
        <View style={styles.trainingSteps}>
          <View style={styles.trainingStep}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <View style={styles.trainingStepContent}>
              <Text style={styles.trainingStepTitle}>Data Collection</Text>
              <Text style={styles.trainingStepDescription}>
                Gather soil moisture, temperature, humidity and weather data daily for 6+ months.
              </Text>
            </View>
          </View>
          
          <View style={styles.trainingStep}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <View style={styles.trainingStepContent}>
              <Text style={styles.trainingStepTitle}>Feature Engineering</Text>
              <Text style={styles.trainingStepDescription}>
                Transform raw data into meaningful inputs the model can learn from.
              </Text>
            </View>
          </View>
          
          <View style={styles.trainingStep}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <View style={styles.trainingStepContent}>
              <Text style={styles.trainingStepTitle}>Pattern Recognition</Text>
              <Text style={styles.trainingStepDescription}>
                The model identifies correlations between conditions and optimal watering times.
              </Text>
            </View>
          </View>
          
          <View style={styles.trainingStep}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>4</Text>
            </View>
            <View style={styles.trainingStepContent}>
              <Text style={styles.trainingStepTitle}>Validation</Text>
              <Text style={styles.trainingStepDescription}>
                Test predictions against known outcomes to improve accuracy.
              </Text>
            </View>
          </View>
        </View>
      </View>
      
    
    </View>
  );
};

// Fifth component - Watering Decision Tool
const WateringDecisionToolComponent = () => {
  // This component needs to take the full available space
  return (
    <View style={{
      flex: 1,
      width: '100%',
      alignSelf: 'stretch',
      height: '100%',
      marginTop: 0,
    }}>
      <WateringDecisionTool />
    </View>
  );
};

// Sixth component - Lesson Completion
const LessonCompletionComponent = () => {
  return (
    <View style={styles.completionContainer}>
      <View style={styles.completionHeader}>
        <LinearGradient
          colors={['rgba(35, 197, 82, 0.3)', 'rgba(35, 197, 82, 0.1)']}
          style={styles.completionGradient}
        >
          <View style={styles.completionIconContainer}>
            <Ionicons name="checkmark-circle" size={80} color="#23C552" />
          </View>
        </LinearGradient>
        
       </View>
      
      <View style={styles.completionCard}>
        <Text style={styles.summaryTitle}>What You've Learned:</Text>
        
        <View style={styles.summaryItem}>
          <View style={styles.summaryBullet}>
            <Ionicons name="analytics-outline" size={20} color="white" />
          </View>
          <Text style={styles.summaryText}>
            How machine learning models can predict optimal watering times
          </Text>
        </View>
        
        <View style={styles.summaryItem}>
          <View style={styles.summaryBullet}>
            <Ionicons name="flask-outline" size={20} color="white" />
          </View>
          <Text style={styles.summaryText}>
            The importance of data collection and feature selection in ML
          </Text>
        </View>
        
        <View style={styles.summaryItem}>
          <View style={styles.summaryBullet}>
            <Ionicons name="leaf-outline" size={20} color="white" />
          </View>
          <Text style={styles.summaryText}>
            How environmental factors combine to influence plant care decisions
          </Text>
        </View>
        
        <View style={styles.summaryItem}>
          <View style={styles.summaryBullet}>
            <Ionicons name="bulb-outline" size={20} color="white" />
          </View>
          <Text style={styles.summaryText}>
            How to build intuition around ML model performance metrics
          </Text>
        </View>
      </View>
      
      <View style={styles.completionFooter}>
        <Image 
          source={require('@/assets/images/logo/tx.png')} 
          style={styles.appIcon}
          resizeMode="contain"
        />
        <Text style={styles.appCredits}>
          SmartSoil app by {"\n"}
          <Text style={styles.companyName}>SofTx Innovations Inc</Text>
        </Text>
      </View>
     
    </View>
  );
};

export default function Lesson3Screen() {
  const { updateLessonStep, completeLesson } = useTutorial();
  const [currentStep, setCurrentStep] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const isLastStep = currentStep === lesson3Steps.length - 1;
  
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
      // If this is the last step, mark the lesson as complete and return to main app
      completeLesson(LESSON_ID);
      router.replace("/dashboard");
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
    const currentStepData = lesson3Steps[currentStep];
    
    // Always show title and description
    const headerContent = (
      <View style={[styles.headerContentContainer, currentStep === 3 && styles.wateringToolHeader]}>
        <Text style={styles.stepTitle}>
          {currentStepData.title}
        </Text>
        <Text style={styles.stepDescription}>
          {currentStepData.description}
        </Text>
      </View>
    );
    
    // Render the appropriate content for each step
    let stepContent;
    switch (currentStep) {
      case 0:
        stepContent = (
          <>
            {headerContent}
            <MLIntroduction />
          </>
        );
        break;
      case 1:
        stepContent = (
          <>
            {headerContent}
            <MLModelTrainingComponent />
          </>
        );
        break;
      case 2:
        stepContent = (
          <>
            {headerContent}
            <View style={{
              flex: 1,
              width: '100%',
              alignSelf: 'stretch',
              height: '100%',
              marginTop: 0,
            }}>
              <ModelFeatureGame />
            </View>
          </>
        );
        break;
      case 3:
        // For the watering decision tool, we'll return just the component without wrapping
        // This will be handled differently in the main render method
        return (
          <>
            {headerContent}
            <WateringDecisionToolComponent />
          </>
        );
      case 4:
        stepContent = (
          <>
            {headerContent}
            <LessonCompletionComponent />
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
                  // If on first step, go back to lesson 2
                  router.push("/tutorial/lesson2");
                }
              }}
            >
              <Animated.View style={[styles.navButton, backBtnStyle]}>
                <MaterialCommunityIcons name="chevron-left" size={24} color="white" />
                <Text style={styles.navButtonText}>Back</Text>
              </Animated.View>
            </Pressable>
            
            <View style={styles.lessonInfoContainer}>
              <Text style={styles.lessonLabel}>LESSON 3</Text>
              <Text style={styles.lessonTitle}>Machine Learning</Text>
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
                router.replace("/dashboard");
              }}
            >
              <Animated.View style={[styles.navButton, skipBtnStyle]}>
                <Text style={styles.navButtonText}>Skip</Text>
                <MaterialCommunityIcons name="chevron-right" size={24} color="white" />
              </Animated.View>
            </Pressable>
          </View>

          <View style={[styles.contentContainer, currentStep === 3 && styles.wateringToolContainer]}>
            {!leaving ? (
              <Animated.View 
                style={[styles.stepContent, currentStep === 3 && styles.wateringToolContent]}
                entering={FadeInDown.duration(500)}
                exiting={FadeOut.duration(300)}
                key={`step-${currentStep}`}
              >
                {(currentStep === 2 || currentStep === 3) ? (
                  // Direct rendering for full-screen interactive tools - no outer ScrollView wrapping
                  renderStepContent()
                ) : (
                  // Normal ScrollView wrapping for other lesson steps
                  <ScrollView 
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                  >
                    {renderStepContent()}
                  </ScrollView>
                )}
              </Animated.View>
            ) : null}
          </View>
          
          <View style={styles.footer}>
            <View style={styles.stepProgressContainer}>
              <View style={styles.stepProgressBackground} />
              <View 
                style={[
                  styles.stepProgressFill, 
                  { width: `${((currentStep + 1) / lesson3Steps.length) * 100}%` }
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
                  {isLastStep ? 'Finish Lesson' : 'Next'}
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
    width: '100%',
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepContent: {
    width: '100%',
    flex: 1,
    alignSelf: 'stretch',
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
    paddingHorizontal: 5,
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
  scrollContainer: {
    padding: 15,
    width: '100%',
  },
  
  // Lesson content styles
  lessonContent: {
    width: '100%',
    maxWidth: 350,
    alignItems: Platform.OS === 'web' ? 'center' : 'flex-start',
    alignSelf: 'center',
  },
  contentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 15,
    alignSelf: Platform.OS === 'web' ? 'center' : 'auto',
  },
  cardSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
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
  comparisonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  comparisonColumn: {
    width: '48%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  comparisonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 8,
  },
  comparisonTitle: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  comparisonContent: {
    padding: 10,
  },
  comparisonText: {
    color: 'white',
    fontSize: 12,
    lineHeight: 16,
  },
  
  // Historical data component styles
  dataCollection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dataItem: {
    alignItems: 'center',
    width: '30%',
  },
  dataIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 123, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  dataLabel: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  forecastContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 12,
    width: '100%',
  },
  forecastHeader: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 8,
    marginBottom: 12,
  },
  forecastTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forecastDate: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 2,
  },
  sensorReadings: {
    marginBottom: 12,
  },
  readingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  readingLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginLeft: 6,
    width: 90,
  },
  readingValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  weatherForecast: {
    marginBottom: 15,
  },
  forecastLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginBottom: 8,
  },
  weatherDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weatherDay: {
    alignItems: 'center',
    width: '30%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 8,
  },
  weatherDayName: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginBottom: 4,
  },
  weatherTemp: {
    color: 'white',
    fontSize: 14,
    marginTop: 4,
  },
  recommendationBox: {
    backgroundColor: 'rgba(35, 197, 82, 0.3)',
    borderRadius: 8,
    padding: 12,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  recommendationText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
  },
  trainingSteps: {
    marginBottom: 15,
  },
  trainingStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumberContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  stepNumber: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dataTypesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dataTypeItem: {
    alignItems: 'center',
    width: '30%',
  },
  dataTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 123, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  dataTypeTitle: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dataTypeDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    textAlign: 'center',
  },
  accuracyChart: {
    marginBottom: 15,
  },
  accuracyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  accuracyHeaderText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  accuracyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  accuracyBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accuracyBar: {
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    marginRight: 8,
  },
  accuracyValue: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  accuracyTimeframe: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  advantagesList: {
    marginBottom: 15,
  },
  advantageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  advantageIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(35, 197, 82, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  advantageContent: {
    flex: 1,
  },
  advantageTitle: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  advantageDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  // Training step styles
  trainingStepContent: {
    flex: 1,
  },
  trainingStepTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  trainingStepDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    lineHeight: 16,
  },
  
  // Completion styles
  completionContainer: {
    width: '100%',
    alignItems: 'center',
  },
  completionHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  completionGradient: {
    borderRadius: 60,
    padding: 10,
    marginBottom: 16,
  },
  completionIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  completionSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  completionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 20,
    minWidth: 300,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    marginTop: 5,
    marginHorizontal: 6
  },
  summaryBullet: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(35, 197, 82, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  summaryText: {
    fontSize: 12,
    color: 'white',
    flex: 1,
  },
  completionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  appIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  appCredits: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'left',
    marginTop: -5,
  },
  companyName: {
    color: 'white',
    fontWeight: 'bold',
  },
  sensorMockup: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
  },
  mockupHeader: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 12,
  },
  mockupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  mockupContent: {
    padding: 16,
  },
  mockupReadings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  mockupReading: {
    alignItems: 'center',
  },
  mockupLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  mockupValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  mockupPrediction: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 12,
  },
  predictionLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  predictionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#23C552',
    marginVertical: 4,
  },
  predictionBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    marginVertical: 8,
    overflow: 'hidden',
  },
  predictionFill: {
    width: '65%',
    height: '100%',
    backgroundColor: '#23C552',
    borderRadius: 4,
  },
  predictionDetails: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  watertoolWrapper: {
    flex: 1,
    width: '100%',
    position: 'relative',
    alignSelf: 'stretch',
    height: '100%',
    marginTop: 10,
  },
  headerContentContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  wateringToolHeader: {
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  wateringToolContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  wateringToolContent: {
    paddingHorizontal: 0,
  },
}); 