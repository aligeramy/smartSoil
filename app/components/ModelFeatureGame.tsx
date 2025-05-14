import modelData from '@/lib/model-data-new';
import { FeatureItem, ModelMetrics } from '@/lib/types';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withTiming
} from 'react-native-reanimated';

// Define feature groups with their properties
const featureGroups = [
  {
    name: "Soil Data",
    color: "#4CD964", // Green
    backgroundColor: "rgba(76, 217, 100, 0.15)",
    features: [
      { 
        id: "1", 
        name: "Soil_Moisture", 
        renderIcon: () => <Ionicons name="water-outline" size={16} color="#4CD964" /> 
      }
    ]
  },
  {
    name: "Current Weather",
    color: "#007AFF", // Blue
    backgroundColor: "rgba(0, 122, 255, 0.15)",
    features: [
      { 
        id: "2", 
        name: "Rainfall_Rolling", 
        renderIcon: () => <Ionicons name="rainy-outline" size={16} color="#007AFF" /> 
      },
      { 
        id: "3", 
        name: "Temp_Rolling", 
        renderIcon: () => <MaterialCommunityIcons name="thermometer" size={16} color="#FF9500" /> 
      },
      { 
        id: "4", 
        name: "Humidity_Rolling", 
        renderIcon: () => <MaterialCommunityIcons name="water-percent" size={16} color="#5AC8FA" /> 
      }
    ]
  },
  {
    name: "Weather Forecast",
    color: "#FF2D55", // Pink
    backgroundColor: "rgba(255, 45, 85, 0.15)",
    features: [
      { 
        id: "5", 
        name: "Rainfall_Forecast", 
        renderIcon: () => <FontAwesome5 name="cloud-rain" size={14} color="#007AFF" /> 
      },
      { 
        id: "6", 
        name: "Temp_Forecast", 
        renderIcon: () => <MaterialCommunityIcons name="thermometer-lines" size={16} color="#FF9500" /> 
      },
      { 
        id: "7", 
        name: "Humidity_Forecast", 
        renderIcon: () => <Ionicons name="water" size={16} color="#5AC8FA" /> 
      }
    ]
  }
];

// Define the enhanced feature type with proper icon typing
type EnhancedFeatureItem = FeatureItem & { 
  renderIcon: () => React.ReactNode;
  groupColor?: string;
  groupBackgroundColor?: string;
  groupName?: string;
};

// Define props for AnimatedFeaturePill
interface AnimatedFeaturePillProps {
  feature: EnhancedFeatureItem;
  onPress: (feature: EnhancedFeatureItem) => void;
  groupColor: string;
  groupBackgroundColor: string;
}

// Animated feature pill component
const AnimatedFeaturePill: React.FC<AnimatedFeaturePillProps> = ({
  feature,
  onPress,
  groupColor,
  groupBackgroundColor
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value
    };
  });
  
  const handlePress = () => {
    scale.value = withSequence(
      withTiming(1.1, { duration: 100 }),
      withTiming(0, { 
        duration: 300,
        easing: Easing.inOut(Easing.ease)
      }, () => {
        runOnJS(onPress)(feature);
      })
    );
    opacity.value = withTiming(0, { duration: 300 });
  };
  
  return (
    <Animated.View style={[animatedStyle, { margin: 4 }]}>
      <Pressable
        style={[
          styles.featurePill,
          { backgroundColor: groupBackgroundColor, borderColor: groupColor }
        ]}
        onPress={handlePress}
      >
        <View style={styles.featurePillContent}>
          <View style={styles.featureIcon}>{feature.renderIcon()}</View>
          <Text style={[styles.featurePillText, { color: groupColor }]}>
            {feature.name.replace(/_/g, " ")}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

// Define props for AnimatedSelectedFeature
interface AnimatedSelectedFeatureProps {
  feature: EnhancedFeatureItem;
  onRemove: (id: string) => void;
  index: number;
  groupColor: string;
}

// Animated selected feature component
const AnimatedSelectedFeature: React.FC<AnimatedSelectedFeatureProps> = ({
  feature,
  onRemove,
  index,
  groupColor
}) => {
  const scale = useSharedValue(0);
  const translateY = useSharedValue(-20);
  
  useEffect(() => {
    // Cascade animation with delay based on index
    scale.value = withDelay(
      index * 150, 
      withTiming(1, { 
        duration: 300,
        easing: Easing.elastic(1)
      })
    );
    translateY.value = withDelay(
      index * 150,
      withTiming(0, { 
        duration: 300,
        easing: Easing.out(Easing.back())
      })
    );
  }, [index]);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value }
      ]
    };
  });
  
  const handleRemove = () => {
    scale.value = withTiming(0, { duration: 200 });
    translateY.value = withTiming(-20, { duration: 200 }, () => {
      runOnJS(onRemove)(feature.id);
    });
  };
  
  return (
    <Animated.View style={[animatedStyle, styles.featureRowContainer]}>
      <View style={[styles.selectedFeature, { borderColor: groupColor }]}>
        <View style={styles.featureIcon}>{feature.renderIcon()}</View>
        <Text style={[styles.selectedFeatureText, { color: 'white' }]}>
          {feature.name.replace(/_/g, " ")}
        </Text>
        <Pressable
          onPress={handleRemove}
          style={styles.removeFeatureButton}
        >
          <Ionicons name="close-circle" size={18} color="#FF3B30" />
        </Pressable>
      </View>
    </Animated.View>
  );
};

const ModelFeatureGame = () => {
  const [selectedFeatures, setSelectedFeatures] = useState<EnhancedFeatureItem[]>([]);
  const [availableFeatures, setAvailableFeatures] = useState<EnhancedFeatureItem[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<ModelMetrics | null>(null);
  const [showConfusionMatrix, setShowConfusionMatrix] = useState(false);

  // Initialize available features with icons and group colors
  useEffect(() => {
    const initialFeatures: EnhancedFeatureItem[] = [];
    
    featureGroups.forEach(group => {
      group.features.forEach(feature => {
        initialFeatures.push({
          ...feature,
          groupColor: group.color,
          groupBackgroundColor: group.backgroundColor,
          groupName: group.name
        });
      });
    });
    
    setAvailableFeatures(initialFeatures);
  }, []);

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
  const handleAddFeature = (feature: EnhancedFeatureItem) => {
    // Find the group this feature belongs to
    const selectedGroupName = feature.groupName;
    
    // Find all features from the same group that are still available
    const groupFeaturesToAdd = availableFeatures.filter(f => f.groupName === selectedGroupName);
    
    // Add all features from the group to selected features
    setSelectedFeatures(prev => [...prev, ...groupFeaturesToAdd]);
    
    // Remove all features from the group from available features
    setAvailableFeatures(prev => prev.filter(f => f.groupName !== selectedGroupName));
  };

  // Remove a feature from the equation
  const handleRemoveFeature = (featureId: string) => {
    // Find the feature to remove
    const featureToRemove = selectedFeatures.find(f => f.id === featureId);
    
    if (featureToRemove) {
      const groupName = featureToRemove.groupName;
      
      // Find all features from the same group
      const groupFeatures = selectedFeatures.filter(f => f.groupName === groupName);
      
      // Remove all features from this group
      setSelectedFeatures(prev => prev.filter(f => f.groupName !== groupName));
      
      // Add all features from this group back to available features
      setAvailableFeatures(prev => [...prev, ...groupFeatures]);
    }
  };

  // Reset the game
  const handleReset = () => {
    setSelectedFeatures([]);
    
    // Reinitialize available features with icons and group colors
    const initialFeatures: EnhancedFeatureItem[] = [];
    
    featureGroups.forEach(group => {
      group.features.forEach(feature => {
        initialFeatures.push({
          ...feature,
          groupColor: group.color,
          groupBackgroundColor: group.backgroundColor,
          groupName: group.name
        });
      });
    });
    
    setAvailableFeatures(initialFeatures);
    setCurrentMetrics(null);
    setShowConfusionMatrix(false);
  };

  return (
    <View style={styles.featureGameContainer}>
      {/* Scrollable main content */}
      <ScrollView 
        style={styles.featureGameScrollView} 
        contentContainerStyle={styles.featureGameScrollContent}
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
                  <React.Fragment key={feature.id}>
                    <AnimatedSelectedFeature
                      feature={feature}
                      onRemove={handleRemoveFeature}
                      index={index}
                      groupColor={feature.groupColor || 'white'}
                    />
                    {index < selectedFeatures.length - 1 && (
                      <Text style={styles.featureOperator}>+</Text>
                    )}
                  </React.Fragment>
                ))}
              </View>
            )}
          </View>
        </View>
        
        {/* Available Features */}
        {featureGroups.map((group) => {
          // Check if any features from this group are available
          const hasAvailableFeatures = availableFeatures.some(
            feature => feature.groupName === group.name
          );
          
          // Only render the group if it has available features
          return hasAvailableFeatures ? (
            <View 
              key={group.name} 
              style={[
                styles.availableFeaturesContainer,
                { backgroundColor: group.backgroundColor }
              ]}
            >
              <View style={styles.groupHeader}>
                <View style={[styles.groupIndicator, { backgroundColor: group.color }]} />
                <Text style={[styles.featuresTitle, { color: group.color }]}>
                  {group.name}
                </Text>
              </View>
              
              <View style={styles.featuresGrid}>
                {availableFeatures
                  .filter(feature => feature.groupName === group.name)
                  .map((feature) => (
                    <AnimatedFeaturePill
                      key={feature.id}
                      feature={feature}
                      onPress={handleAddFeature}
                      groupColor={group.color}
                      groupBackgroundColor={group.backgroundColor}
                    />
                  ))
                }
              </View>
            </View>
          ) : null;
        })}
      </ScrollView>
      
      {/* Performance Metrics/Matrix Card (fixed at bottom) */}
      <View style={styles.fixedMetricsCard}>
        <View style={styles.metricCardContent}>
          <View style={styles.metricsHeader}>
            <Text style={styles.metricsTitle}>
              {showConfusionMatrix ? 'Confusion Matrix' : 'Model Performance'}
            </Text>
            <View style={styles.metricsActions}>
              {currentMetrics && (
                <Pressable
                  style={styles.matrixToggleButton}
                  onPress={() => setShowConfusionMatrix(!showConfusionMatrix)}
                >
                  <Text style={styles.matrixToggleText}>
                    {showConfusionMatrix ? 'Show Metrics' : 'Show Matrix'}
                  </Text>
                </Pressable>
              )}
              <Pressable
                onPress={handleReset}
                style={[styles.resetButton, selectedFeatures.length === 0 && styles.resetButtonDisabled]}
                disabled={selectedFeatures.length === 0}
              >
                <Text style={styles.resetButtonText}>Reset</Text>
              </Pressable>
            </View>
          </View>
          
          {!currentMetrics ? (
            <Text style={styles.metricsPlaceholder}>
              Add features above to see model performance metrics
            </Text>
          ) : showConfusionMatrix ? (
            // Show Confusion Matrix
            <View style={styles.matrixContainer}>
              <Text style={styles.matrixSubtitle}>Actual vs Predicted</Text>
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
          ) : (
            // Show only AUC, Recall (Sensitivity), and Precision metrics
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
                <Text style={styles.metricLabel}>Recall</Text>
                <Text style={[styles.metricValue, { color: '#FF9500' }]}>
                  {currentMetrics.sensitivity.toFixed(2)}
                </Text>
                <Text style={styles.metricSubLabel}>(Sensitivity)</Text>
              </View>
              
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Precision</Text>
                <Text style={[styles.metricValue, { color: '#23C552' }]}>
                  {typeof currentMetrics.precision === 'number' 
                    ? currentMetrics.precision.toFixed(2) 
                    : currentMetrics.precision}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  featureGameContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
    alignSelf: 'stretch',
  },
  featureGameScrollView: {
    flex: 1,
  },
  featureGameScrollContent: {
    padding: 15,
    paddingBottom: 120, // Space for the fixed metrics card
  },
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    gap: 5,
  },
  featureIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedFeatureText: {
    color: 'white',
    fontSize: 12,
  },
  removeFeatureButton: {
    padding: 2,
  },
  availableFeaturesContainer: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    minWidth: 350,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupIndicator: {
    width: 4,
    height: 16,
    borderRadius: 2,
    marginRight: 8,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  featurePill: {
    borderRadius: 7,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  featurePillContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featurePillText: {
    fontSize: 14,
  },
  fixedMetricsCard: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    padding: 10,
    backgroundColor: 'rgba(18, 53, 36, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 999,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
  },
  bottomPadding: {
    height: 120, // Match WateringDecisionTool's padding
  },
  metricCardContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
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
  metricsActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matrixToggleButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.3)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginRight: 8,
  },
  matrixToggleText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
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
  metricsPlaceholder: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    textAlign: 'center',
    padding: 16,
    display: 'none',
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
  metricSubLabel: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 10,
    marginTop: 2,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  matrixContainer: {
    marginTop: 12,
  },
  matrixSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 15,
    marginTop: -10,
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
});

export default ModelFeatureGame; 