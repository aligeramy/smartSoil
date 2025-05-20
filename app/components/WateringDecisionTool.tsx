import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

// Define common styles for slider
const sliderStyle = {
  height: 40,
  marginVertical: 10,
  flex: 1 as const,
};

// Define a type for all slider values
type AllValues = {
  x1: number; // soilMoisture
  x2: number; // rainfallRolling
  x3: number; // tempRolling
  x4: number; // humidityRolling
  x5: number; // rainfallForecast
  x6: number; // tempForecast
  x7: number; // humidityForecast
};

// Define FactorSlider outside the main component to avoid recreation on each render
const FactorSlider = React.memo(({
  label,
  value,
  onChange,
  coefficient,
  icon,
  min = 0,
  max = 100
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  coefficient: number;
  icon: React.ReactNode;
  min?: number;
  max?: number;
}) => {
  return (
    <View style={styles.sliderContainer}>
      <View style={styles.sliderHeader}>
        {icon}
        <Text style={styles.sliderLabel}>{label}</Text>
        <Text style={styles.coefficientText}>Coefficient: {coefficient}</Text>
      </View>

      <View style={styles.sliderRow} pointerEvents="box-none">
        <Pressable
          style={styles.arrowButton}
          hitSlop={8}
          onPress={() => onChange(Math.max(min, value - 0.5))}
        >
          <Ionicons name="chevron-back" size={20} color="white" />
        </Pressable>

        <Slider
          style={sliderStyle}
          minimumValue={min}
          maximumValue={max}
          value={value}
          onValueChange={onChange}
          step={0.01}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
          thumbTintColor="#FFFFFF"
        />

        <Pressable
          style={styles.arrowButton}
          hitSlop={8}
          onPress={() => onChange(Math.min(max, value + 0.5))}
        >
          <Ionicons name="chevron-forward" size={20} color="white" />
        </Pressable>
      </View>

      <View style={styles.sliderFooter}>
        <Text style={styles.sliderMinMax}>{min.toFixed(1)}</Text>
        <Text style={styles.sliderValue}>{value.toFixed(2)}</Text>
        <Text style={styles.sliderMinMax}>{max.toFixed(1)}</Text>
      </View>
    </View>
  );
});

// Add display name to fix linter error
FactorSlider.displayName = 'FactorSlider';

const WateringDecisionTool = () => {
  // Initial values within the specified ranges
  // Combined state for all values
  const [allValues, setAllValues] = useState<AllValues>({
    x1: 30, // soilMoisture
    x2: 50, // rainfallRolling
    x3: 28, // tempRolling
    x4: 65, // humidityRolling
    x5: 15, // rainfallForecast
    x6: 28, // tempForecast
    x7: 65, // humidityForecast
  });
  
  const [decision, setDecision] = useState("");
  const [decisionValue, setDecisionValue] = useState(0);
  
  // Function to compute the decision based on all values
  const computeDecision = useCallback((values: AllValues) => {
    // New Decision Boundary Formula:
    // -0.1338 * x1 + -0.0161 * x2 + 0.0997 * x3 + -0.0065 * x4 + -0.1156 * x5 + 0.0598 * x6 + 0.0004 * x7 + 1.5264
    const result =
      -0.1338 * values.x1 +
      -0.0161 * values.x2 +
      0.0997 * values.x3 +
      -0.0065 * values.x4 +
      -0.1156 * values.x5 +
      0.0598 * values.x6 +
      0.0004 * values.x7 +
      1.5264;

    setDecisionValue(result);
    setDecision(result < 0 ? "DO NOT WATER" : "WATER");
  }, []);

  // Create a debounced version of computeDecision (120ms delay)
  const debouncedDecision = useRef((values: AllValues) => {
    // This will be replaced with the debounced function
    computeDecision(values);
  });

  // Set up the debounced function
  useEffect(() => {
    // Simple debounce implementation
    let timeoutId: ReturnType<typeof setTimeout>;
    
    debouncedDecision.current = (values: AllValues) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        computeDecision(values);
      }, 120); // 120ms delay
    };
    
    // Initial computation
    computeDecision(allValues);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [computeDecision]);

  // Create callback handlers for each slider
  const onSliderChange = useCallback((key: keyof AllValues) => (val: number) => {
    setAllValues(prev => {
      const next = { ...prev, [key]: val };
      debouncedDecision.current(next);
      return next;
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Main Content Area with Scrollable Sliders */}
      <View style={styles.scrollableContent}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Sliders Grid */}
          <View style={styles.factorsGrid}>
            <View style={styles.factorItem}>
              <FactorSlider
                icon={<Ionicons name="water-outline" size={18} color="#007AFF" />}
                label="Soil Moisture (x1)"
                value={allValues.x1}
                onChange={onSliderChange('x1')}
                coefficient={-0.1338}
                min={5}
                max={50}
              />
            </View>
            
            <View style={styles.factorItem}>
              <FactorSlider
                icon={<Ionicons name="rainy-outline" size={18} color="#007AFF" />}
                label="Rainfall Rolling (x2)"
                value={allValues.x2}
                onChange={onSliderChange('x2')}
                coefficient={-0.0161}
                min={0}
                max={100}
              />
            </View>
            
            <View style={styles.factorItem}>
              <FactorSlider
                icon={<Ionicons name="thermometer-outline" size={18} color="#FF3B30" />}
                label="Temp Rolling (x3)"
                value={allValues.x3}
                onChange={onSliderChange('x3')}
                coefficient={0.0997}
                min={15}
                max={40}
              />
            </View>
            
            <View style={styles.factorItem}>
              <FactorSlider
                icon={<Ionicons name="cloud-outline" size={18} color="#8E8E93" />}
                label="Humidity Rolling (x4)"
                value={allValues.x4}
                onChange={onSliderChange('x4')}
                coefficient={-0.0065}
                min={35}
                max={100}
              />
            </View>
            
            <View style={styles.factorItem}>
              <FactorSlider
                icon={<Ionicons name="rainy-outline" size={18} color="#FF9500" />}
                label="Rainfall Forecast (x5)"
                value={allValues.x5}
                onChange={onSliderChange('x5')}
                coefficient={-0.1156}
                min={0}
                max={35}
              />
            </View>
            
            <View style={styles.factorItem}>
              <FactorSlider
                icon={<Ionicons name="thermometer-outline" size={18} color="#FF9500" />}
                label="Temp Forecast (x6)"
                value={allValues.x6}
                onChange={onSliderChange('x6')}
                coefficient={0.0598}
                min={15}
                max={40}
              />
            </View>
            
            <View style={styles.factorItem}>
              <FactorSlider
                icon={<Ionicons name="cloud-outline" size={18} color="#FF9500" />}
                label="Humidity Forecast (x7)"
                value={allValues.x7}
                onChange={onSliderChange('x7')}
                coefficient={0.0004}
                min={35}
                max={100}
              />
            </View>
          </View>
          
          {/* Formula Card */}
          <View style={styles.formulaCard}>
            <Text style={styles.formulaTitle}>Decision Boundary Formula:</Text>
            <Text style={styles.formulaText}>
              f(x) = -0.1338 * x1 + -0.0161 * x2 + 0.0997 * x3 + -0.0065 * x4 + -0.1156 * x5 + 0.0598 * x6 + 0.0004 * x7 + 1.5264
            </Text>
            <Text style={styles.formulaDescription}>
              Where: x1 = Soil_Moisture, x2 = Rainfall_Rolling, x3 = Temp_Rolling, x4 = Humidity_Rolling,
              x5 = Rainfall_Forecast, x6 = Temp_Forecast, x7 = Humidity_Forecast
            </Text>
            <View style={styles.formulaResult}>
              <Text style={styles.formulaResultText}>If f(x) &lt; 0 then </Text>
              <Text style={styles.noWaterText}>DO NOT WATER</Text>
              <Text style={styles.formulaResultText}>, if f(x) &gt; 0 then </Text>
              <Text style={styles.waterText}>WATER</Text>
            </View>
          </View>
          
          {/* Empty space at the bottom to ensure content above fixed card is visible when scrolled to bottom */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>
      
      {/* Fixed Decision Card at bottom */}
      <View style={styles.fixedBottomCard}>
        <View style={[styles.contentCard, styles.decisionCard]}>
          <View style={styles.decisionHeader}>
            <Text style={styles.decisionLabel}>Current Decision:</Text>
            <Text style={[
              styles.decisionValue, 
              decision === "WATER" ? styles.waterDecision : styles.noWaterDecision
            ]}>
              {decision}
            </Text>
          </View>
          
          <Text style={styles.decisionDescription}>
            Decision value: {decisionValue.toFixed(4)} {decisionValue < 0 ? "< 0 (Do not water)" : "> 0 (Water)"}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%', 
    flex: 1,
    alignSelf: 'stretch',
    position: 'relative',
  },
  scrollableContent: {
    width: '100%',
    flex: 1,
  },
  scrollView: {
    width: '100%',
  },
  scrollViewContent: {
    paddingTop: 5,
    paddingBottom: 120, // Space for the fixed card
    paddingHorizontal: 10,
  },
  contentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    marginBottom: 15,
  },
  decisionCard: {
    marginBottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  decisionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  decisionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  decisionValue: {
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.5,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  waterDecision: {
    color: '#23C552',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  noWaterDecision: {
    color: '#FF3B30',
    backgroundColor: 'rgba(255, 155, 155, 0.2)',
  },
  decisionDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  factorsGrid: {
    width: '100%',
  },
  factorItem: {
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 10,
    width: '100%',
  },
  sliderContainer: {
    paddingVertical: 4,
    width: '100%',
  },
  sliderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  sliderLabel: {
    fontSize: 14,
    color: 'white',
    marginLeft: 8,
    marginRight: 4,
    flexShrink: 1,
  },
  coefficientText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginLeft: 'auto', // Push to the right
  },
  sliderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  sliderMinMax: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  sliderValue: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  formulaCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 12,
    marginBottom: -40,
    width: '100%',
    marginTop: 10,
  },
  formulaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  formulaText: {
    fontSize: 12,
    color: 'white',
    fontFamily: 'monospace',
    lineHeight: 18,
    marginBottom: 8,
  },
  formulaDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  formulaResult: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  formulaResultText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  waterText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#23C552',
  },
  noWaterText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  arrowButton: {
    padding: 8,
  },
  fixedBottomCard: {
    position: 'absolute',
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
    height: 120, // Increased to ensure enough space
  },
});

export default WateringDecisionTool; 