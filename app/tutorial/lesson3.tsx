import { useTutorial } from '@/app/context/TutorialContext';
import { Colors as ColorPalette } from '@/constants/Colors';
import modelData from '@/lib/model-data';
import { FeatureItem, ModelMetrics } from '@/lib/types';
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

// Fourth component - Model Feature Game
const ModelFeatureGameComponent = () => {
  const [selectedFeatures, setSelectedFeatures] = useState<FeatureItem[]>([]);
  const [availableFeatures, setAvailableFeatures] = useState<FeatureItem[]>([
    { id: "1", name: "Soil_Moisture" },
    { id: "2", name: "Rainfall_Rolling" },
    { id: "3", name: "Temp_Rolling" },
    { id: "4", name: "Humidity_Rolling" },
    { id: "5", name: "Rainfall_Forecast" },
    { id: "6", name: "Temp_Forecast" },
    { id: "7", name: "Humidity_Forecast" },
  ]);
  const [currentMetrics, setCurrentMetrics] = useState<ModelMetrics | null>(null);
  const [showConfusionMatrix, setShowConfusionMatrix] = useState(false);

  // Process the model data and update metrics when selected features change
  useEffect(() => {
    if (selectedFeatures.length === 0) {
      setCurrentMetrics(null);
      return;
    }

    // Get feature names from selected features
    const featureNames = selectedFeatures.map((f) => f.name);
    
    // Find matching metrics in model data
    const matchingModel = modelData.find((item: any) => {
      // Check if arrays have the same length
      if (featureNames.length !== item.Features.length) return false;
      
      // Check if all selected features are in this model's features
      const allFeaturesMatch = featureNames.every((name: string) => 
        item.Features.includes(name)
      );
      
      // Check if all model features are in selected features
      const allModelFeaturesIncluded = item.Features.every((name: string) => 
        featureNames.includes(name)
      );
      
      // Both conditions must be true for an exact match
      return allFeaturesMatch && allModelFeaturesIncluded;
    });
    
    if (matchingModel) {
      // Convert to our metrics format
      setCurrentMetrics({
        features: matchingModel.Features,
        accuracy: matchingModel.Accuracy,
        specificity: matchingModel.Specificity,
        sensitivity: matchingModel.Sensitivity,
        auc: matchingModel.AUC,
        precision: matchingModel.Precision,
        f1: matchingModel.F1,
        confusionMatrix: matchingModel["Confusion Matrix"]
      });
    } else {
      // No matching model found
      setCurrentMetrics(null);
    }
  }, [selectedFeatures]);

  // Add a feature to the equation
  const handleAddFeature = (feature: FeatureItem) => {
    // Add the feature to selected features
    setSelectedFeatures((prev) => [...prev, feature]);
    
    // Remove the feature from available features
    setAvailableFeatures((prev) => prev.filter((f) => f.id !== feature.id));
  };

  // Remove a feature from the equation
  const handleRemoveFeature = (featureId: string) => {
    // Find the feature to remove
    const featureToRemove = selectedFeatures.find((f) => f.id === featureId);
    
    // Remove the feature from selected features
    setSelectedFeatures((prev) => prev.filter((f) => f.id !== featureId));
    
    // Add the feature back to available features
    if (featureToRemove) {
      setAvailableFeatures((prev) => [...prev, featureToRemove]);
    }
  };

  // Reset the game
  const handleReset = () => {
    setSelectedFeatures([]);
    setAvailableFeatures([
      { id: "1", name: "Soil_Moisture" },
      { id: "2", name: "Rainfall_Rolling" },
      { id: "3", name: "Temp_Rolling" },
      { id: "4", name: "Humidity_Rolling" },
      { id: "5", name: "Rainfall_Forecast" },
      { id: "6", name: "Temp_Forecast" },
      { id: "7", name: "Humidity_Forecast" },
    ]);
    setCurrentMetrics(null);
    setShowConfusionMatrix(false);
  };

  return (
    <View style={styles.featureGameContainer}>
      {/* Scrollable Content */}
      <View style={styles.scrollableContent}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Equation Builder */}
          <View style={styles.equationContainer}>
            <Text style={styles.equationTitle}>Time to Water =</Text>
            
            <View style={styles.equationContent}>
              {selectedFeatures.length === 0 ? (
                <Text style={styles.equationPlaceholder}>Tap features below to add them</Text>
              ) : (
                <View style={styles.selectedFeaturesContainer}>
                  {selectedFeatures.map((feature, index) => (
                    <View key={feature.id} style={styles.featureRowContainer}>
                      <View style={styles.selectedFeature}>
                        <Text style={styles.selectedFeatureText}>
                          {feature.name.replace(/_/g, " ")}
                        </Text>
                        <Pressable
                          onPress={() => handleRemoveFeature(feature.id)}
                          style={styles.removeFeatureButton}
                        >
                          <Ionicons name="close-circle" size={18} color="#FF3B30" />
                        </Pressable>
                      </View>
                      {index < selectedFeatures.length - 1 && (
                        <Text style={styles.featureOperator}>+</Text>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
          
          {/* Available Features */}
          <View style={styles.availableFeaturesContainer}>
            <Text style={styles.featuresTitle}>Available Features</Text>
            
            <View style={styles.featuresGrid}>
              {availableFeatures.map((feature) => (
                <Pressable
                  key={feature.id}
                  style={styles.featurePill}
                  onPress={() => handleAddFeature(feature)}
                >
                  <Text style={styles.featurePillText}>
                    {feature.name.replace(/_/g, " ")}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          
          {/* Bottom padding to ensure content above fixed card is visible */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>
      
      {/* Fixed Model Performance Card at bottom */}
      <View style={styles.fixedBottomCard}>
        <View style={styles.performanceWrapper}>
          <View style={styles.metricsHeader}>
            <Text style={styles.metricsTitle}>Model Performance</Text>
            <Pressable
              onPress={handleReset}
              style={[styles.resetButton, selectedFeatures.length === 0 && styles.resetButtonDisabled]}
              disabled={selectedFeatures.length === 0}
            >
              <Text style={styles.resetButtonText}>
                Reset
              </Text>
            </Pressable>
          </View>
          
          {!currentMetrics ? (
            <Text style={styles.metricsPlaceholder}>
              Add features above to see model performance metrics
            </Text>
          ) : (
            <>
              <View style={styles.metricsGrid}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Accuracy</Text>
                  <Text style={[styles.metricValue, { color: '#23C552' }]}>
                    {currentMetrics.accuracy.toFixed(2)}
                  </Text>
                </View>
                
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Specificity</Text>
                  <Text style={[styles.metricValue, { color: '#23C552' }]}>
                    {currentMetrics.specificity.toFixed(2)}
                  </Text>
                </View>
                
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Sensitivity</Text>
                  <Text style={[styles.metricValue, { color: '#FF9500' }]}>
                    {currentMetrics.sensitivity.toFixed(2)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.metricsGrid}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>AUC</Text>
                  <Text style={[styles.metricValue, { color: '#FF3B30' }]}>
                    {typeof currentMetrics.auc === 'number' 
                      ? currentMetrics.auc.toFixed(2) 
                      : currentMetrics.auc}
                  </Text>
                </View>
                
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Precision</Text>
                  <Text style={[styles.metricValue, { color: '#23C552' }]}>
                    {typeof currentMetrics.precision === 'number' 
                      ? currentMetrics.precision.toFixed(2) 
                      : currentMetrics.precision}
                  </Text>
                </View>
                
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>F1</Text>
                  <Text style={[styles.metricValue, { color: '#23C552' }]}>
                    {typeof currentMetrics.f1 === 'number' 
                      ? currentMetrics.f1.toFixed(2) 
                      : currentMetrics.f1}
                  </Text>
                </View>
              </View>
              
              <Pressable
                style={styles.matrixButton}
                onPress={() => setShowConfusionMatrix(!showConfusionMatrix)}
              >
                <Text style={styles.matrixButtonText}>
                  {showConfusionMatrix ? 'Hide' : 'Show'} Confusion Matrix
                </Text>
              </Pressable>
              
              {/* Confusion Matrix - Only shown when toggled */}
              {showConfusionMatrix && (
                <View style={styles.confusionMatrix}>
                  <View style={styles.matrixHeader}>
                    <Text style={styles.matrixTitle}>Confusion Matrix</Text>
                    <Text style={styles.matrixSubtitle}>Actual vs Predicted</Text>
                  </View>
                  
                  <View style={styles.matrixGrid}>
                    {/* True Positive */}
                    <View style={[styles.matrixCell, styles.tpCell]}>
                      <Text style={styles.matrixValue}>
                        {Math.round((currentMetrics.confusionMatrix["True Positive"] / 
                          (currentMetrics.confusionMatrix["True Positive"] + 
                           currentMetrics.confusionMatrix["False Negative"] + 
                           currentMetrics.confusionMatrix["False Positive"] + 
                           currentMetrics.confusionMatrix["True Negative"])) * 100)}%
                      </Text>
                      <Text style={styles.matrixLabel}>True Positive</Text>
                    </View>
                    
                    {/* False Negative */}
                    <View style={[styles.matrixCell, styles.fnCell]}>
                      <Text style={styles.matrixValue}>
                        {Math.round((currentMetrics.confusionMatrix["False Negative"] / 
                          (currentMetrics.confusionMatrix["True Positive"] + 
                           currentMetrics.confusionMatrix["False Negative"] + 
                           currentMetrics.confusionMatrix["False Positive"] + 
                           currentMetrics.confusionMatrix["True Negative"])) * 100)}%
                      </Text>
                      <Text style={styles.matrixLabel}>False Negative</Text>
                    </View>
                    
                    {/* False Positive */}
                    <View style={[styles.matrixCell, styles.fpCell]}>
                      <Text style={styles.matrixValue}>
                        {Math.round((currentMetrics.confusionMatrix["False Positive"] / 
                          (currentMetrics.confusionMatrix["True Positive"] + 
                           currentMetrics.confusionMatrix["False Negative"] + 
                           currentMetrics.confusionMatrix["False Positive"] + 
                           currentMetrics.confusionMatrix["True Negative"])) * 100)}%
                      </Text>
                      <Text style={styles.matrixLabel}>False Positive</Text>
                    </View>
                    
                    {/* True Negative */}
                    <View style={[styles.matrixCell, styles.tnCell]}>
                      <Text style={styles.matrixValue}>
                        {Math.round((currentMetrics.confusionMatrix["True Negative"] / 
                          (currentMetrics.confusionMatrix["True Positive"] + 
                           currentMetrics.confusionMatrix["False Negative"] + 
                           currentMetrics.confusionMatrix["False Positive"] + 
                           currentMetrics.confusionMatrix["True Negative"])) * 100)}%
                      </Text>
                      <Text style={styles.matrixLabel}>True Negative</Text>
                    </View>
                  </View>
                </View>
              )}
            </>
          )}
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
            <ModelFeatureGameComponent />
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
                {currentStep === 3 ? (
                  // Direct rendering for watering decision tool - no ScrollView wrapping
                  renderStepContent()
                ) : (
                  // Normal ScrollView wrapping for other steps
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
  // Model Feature Game Styles
  equationContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '100%',
    minWidth: 350,
  },
  equationTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  equationContent: {

    borderRadius: 6,
    padding: 6,
    minHeight: 60,
    justifyContent: 'center',
    width: '100%',
  },
  equationPlaceholder: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    textAlign: 'center',
  },
  selectedFeaturesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingVertical: 4,
  },
  featureRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
    marginBottom: 6,
  },
  featureOperator: {
    color: 'white',
    fontSize: 15,
    marginHorizontal: 4,
  },
  selectedFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 7,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
  },
  selectedFeatureText: {
    color: 'white',
    fontSize: 12,
    marginRight: 3,
  },
  removeFeatureButton: {
    padding: 2,
  },
  availableFeaturesContainer: {
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    minWidth: 350,
  },
  featuresHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  featuresTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  resetButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  resetButtonDisabled: {
    opacity: 0.5,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  featurePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 7,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 4,
  },
  featurePillText: {
    color: 'white',
    fontSize: 14,
  },
  metricsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '100%',
    minWidth: 350,
  },
  metricsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricsTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  metricsPlaceholder: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
    padding: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metricItem: {
    alignItems: 'center',
    width: '32%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 10,
  },
  metricLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  matrixButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  matrixButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  confusionMatrix: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  matrixHeader: {
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 0,
  },
  bottomPadding: {
    height: 120, // Increased to ensure enough space
  },
  featureGameContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
    alignSelf: 'stretch',
    height: '100%',
    marginTop: 10,
  },
  scrollableContent: {
    flex: 1,
    width: '100%',
    position: 'relative',
    alignSelf: 'stretch',
    height: '100%',
  },
  scrollView: {
    flex: 1,
    width: '100%',
    position: 'relative',
    alignSelf: 'stretch',
    height: '100%',
  },
  scrollViewContent: {
    padding: 15,
    paddingBottom: 120, // Increased to allow space for fixed bottom card
    width: '100%',
  },
  fixedBottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    padding: 10,
    backgroundColor: 'rgba(18, 53, 36, 0.95)',
    borderRadius: 10,
    zIndex: 999,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
  },
  performanceWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 0,
  },
  matrixHeader: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 8,
    marginBottom: 8,
  },
  matrixTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  matrixSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  matrixGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  matrixCell: {
    alignItems: 'center',
    width: '48%',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  tpCell: {
    backgroundColor: 'rgba(35, 197, 82, 0.3)',
  },
  fnCell: {
    backgroundColor: 'rgba(255, 59, 48, 0.3)',
  },
  fpCell: {
    backgroundColor: 'rgba(255, 149, 0, 0.3)',
  },
  tnCell: {
    backgroundColor: 'rgba(0, 122, 255, 0.3)',
  },
  matrixValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  matrixLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 4,
  },
  bottomPadding: {
    height: 120, // Increased to ensure enough space
  },
}); 