import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// Define common styles for slider
const sliderStyle = {
  height: 40,
  marginVertical: 10,
  flex: 1 as const,
};

// Define a type for all slider values
type AllValues = {
  x1: number; // soilMoisture
  x2: number; // growthStage
  x3: number; // rainfallRolling
  x4: number; // tempRolling
  x5: number; // humidityRolling
  x6: number; // rainfallForecast
  x7: number; // tempForecast
  x8: number; // humidityForecast
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
          onPress={() => onChange(Math.max(min, value - 1))}
        >
          <Ionicons name="chevron-back" size={20} color="white" />
        </Pressable>

        <Slider
          style={sliderStyle}
          minimumValue={min}
          maximumValue={max}
          value={value}
          onValueChange={onChange}
          step={1}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
          thumbTintColor="#FFFFFF"
        />

        <Pressable
          style={styles.arrowButton}
          hitSlop={8}
          onPress={() => onChange(Math.min(max, value + 1))}
        >
          <Ionicons name="chevron-forward" size={20} color="white" />
        </Pressable>
      </View>

      <View style={styles.sliderFooter}>
        <Text style={styles.sliderMinMax}>{min}</Text>
        <Text style={styles.sliderValue}>{value.toFixed(0)}</Text>
        <Text style={styles.sliderMinMax}>{max}</Text>
      </View>
    </View>
  );
});

const WateringDecisionTool = () => {
  // Initial values within the specified ranges
  // Combined state for all values
  const [allValues, setAllValues] = useState<AllValues>({
    x1: 30, // soilMoisture
    x2: 1,  // growthStage
    x3: 50, // rainfallRolling
    x4: 28, // tempRolling
    x5: 65, // humidityRolling
    x6: 15, // rainfallForecast
    x7: 28, // tempForecast
    x8: 65, // humidityForecast
  });
  
  const [decision, setDecision] = useState("");
  const [decisionValue, setDecisionValue] = useState(0);
  
  // Function to compute the decision based on all values
  const computeDecision = useCallback((values: AllValues) => {
    // Decision boundary formula:
    // f(x) = -0.0418 * x1 + -0.6112 * x2 + -0.0195 * x3 + -0.1025 * x4 + -0.0280 * x5 + -0.0995 * x6 + -0.0875 * x7 + 0.0186 * x8 + 10.2879
    const result =
      -0.0418 * values.x1 +
      -0.6112 * values.x2 +
      -0.0195 * values.x3 +
      -0.1025 * values.x4 +
      -0.028 * values.x5 +
      -0.0995 * values.x6 +
      -0.0875 * values.x7 +
      0.0186 * values.x8 +
      10.2879;

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
    <View style={styles.container}>
      {/* Decision Card */}
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
      
      {/* Sliders Grid */}
      <View style={styles.factorsGrid}>
        <View style={styles.factorItem}>
          <FactorSlider
            icon={<Ionicons name="water-outline" size={18} color="#007AFF" />}
            label="Soil Moisture (x1)"
            value={allValues.x1}
            onChange={onSliderChange('x1')}
            coefficient={-0.0418}
            min={5}
            max={50}
          />
        </View>
        
        <View style={styles.factorItem}>
          <View style={styles.growthStageContainer}>
            <View style={styles.sliderHeader}>
              <Ionicons name="leaf-outline" size={18} color="#4CD964" />
              <Text style={styles.sliderLabel}>Growth Stage (x2)</Text>
              <Text style={styles.coefficientText}>Coefficient: -0.6112</Text>
            </View>
            
            <View style={styles.growthStageSelector}>
              <Pressable
                style={[styles.stageButton, allValues.x2 === 1 && styles.stageButtonActive]}
                onPress={() => onSliderChange('x2')(1)}
              >
                <Text style={[styles.stageButtonText, allValues.x2 === 1 && styles.stageButtonTextActive]}>
                  Early (1)
                </Text>
              </Pressable>
              
              <Pressable
                style={[styles.stageButton, allValues.x2 === 2 && styles.stageButtonActive]}
                onPress={() => onSliderChange('x2')(2)}
              >
                <Text style={[styles.stageButtonText, allValues.x2 === 2 && styles.stageButtonTextActive]}>
                  Vegetative (2)
                </Text>
              </Pressable>
              
              <Pressable
                style={[styles.stageButton, allValues.x2 === 3 && styles.stageButtonActive]}
                onPress={() => onSliderChange('x2')(3)}
              >
                <Text style={[styles.stageButtonText, allValues.x2 === 3 && styles.stageButtonTextActive]}>
                  Reproductive (3)
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
        
        <View style={styles.factorItem}>
          <FactorSlider
            icon={<Ionicons name="rainy-outline" size={18} color="#007AFF" />}
            label="Rainfall Rolling (x3)"
            value={allValues.x3}
            onChange={onSliderChange('x3')}
            coefficient={-0.0195}
            min={0}
            max={100}
          />
        </View>
        
        <View style={styles.factorItem}>
          <FactorSlider
            icon={<Ionicons name="thermometer-outline" size={18} color="#FF3B30" />}
            label="Temp Rolling (x4)"
            value={allValues.x4}
            onChange={onSliderChange('x4')}
            coefficient={-0.1025}
            min={15}
            max={40}
          />
        </View>
        
        <View style={styles.factorItem}>
          <FactorSlider
            icon={<Ionicons name="cloud-outline" size={18} color="#8E8E93" />}
            label="Humidity Rolling (x5)"
            value={allValues.x5}
            onChange={onSliderChange('x5')}
            coefficient={-0.028}
            min={35}
            max={100}
          />
        </View>
        
        <View style={styles.factorItem}>
          <FactorSlider
            icon={<Ionicons name="rainy-outline" size={18} color="#007AFF" />}
            label="Rainfall Forecast (x6)"
            value={allValues.x6}
            onChange={onSliderChange('x6')}
            coefficient={-0.0995}
            min={0}
            max={35}
          />
        </View>
        
        <View style={styles.factorItem}>
          <FactorSlider
            icon={<Ionicons name="thermometer-outline" size={18} color="#FF3B30" />}
            label="Temp Forecast (x7)"
            value={allValues.x7}
            onChange={onSliderChange('x7')}
            coefficient={-0.0875}
            min={15}
            max={40}
          />
        </View>
        
        <View style={styles.factorItem}>
          <FactorSlider
            icon={<Ionicons name="cloud-outline" size={18} color="#8E8E93" />}
            label="Humidity Forecast (x8)"
            value={allValues.x8}
            onChange={onSliderChange('x8')}
            coefficient={0.0186}
            min={35}
            max={100}
          />
        </View>
      </View>
      
      {/* Formula Card */}
      <View style={styles.formulaCard}>
        <Text style={styles.formulaTitle}>Decision Boundary Formula:</Text>
        <Text style={styles.formulaText}>
          f(x) = -0.0418 * x1 + -0.6112 * x2 + -0.0195 * x3 + -0.1025 * x4 + -0.0280 * x5 + -0.0995 * x6 + -0.0875 * x7 + 0.0186 * x8 + 10.2879
        </Text>
        <Text style={styles.formulaDescription}>
          Where: x1 = Soil_Moisture, x2 = Growth_Stage, x3 = Rainfall_Rolling, x4 = Temp_Rolling, x5 = Humidity_Rolling,
          x6 = Rainfall_Forecast, x7 = Temp_Forecast, x8 = Humidity_Forecast
        </Text>
        <View style={styles.formulaResult}>
          <Text style={styles.formulaResultText}>If f(x) &lt; 0 then </Text>
          <Text style={styles.noWaterText}>DO NOT WATER</Text>
          <Text style={styles.formulaResultText}>, if f(x) &gt; 0 then </Text>
          <Text style={styles.waterText}>WATER</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  contentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    marginBottom: 15,
    alignSelf: 'center',
    minWidth: 350,
  },
  decisionCard: {
    marginBottom: 12,
  },
  decisionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  decisionLabel: {
    fontSize: 16,
    color: 'white',
  },
  decisionValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  waterDecision: {
    color: '#007AFF',
  },
  noWaterDecision: {
    color: '#FF3B30',
  },
  decisionDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  factorsGrid: {
    marginBottom: 16,
    width: '100%',
    minWidth: 350,
  },
  factorItem: {
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 10,
  },
  sliderContainer: {
    paddingVertical: 4,
  },
  sliderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 14,
    color: 'white',
    marginLeft: 8,
    marginRight: 4,
  },
  coefficientText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  sliderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  growthStageContainer: {
    paddingVertical: 4,
  },
  growthStageSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  stageButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 4,
    marginHorizontal: 2,
    alignItems: 'center',
  },
  stageButtonActive: {
    backgroundColor: 'rgba(76, 217, 100, 0.3)',
  },
  stageButtonText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  stageButtonTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  formulaCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    width: '100%',
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
    color: '#007AFF',
  },
  noWaterText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowButton: {
    padding: 8,
  },
});

export default WateringDecisionTool; 