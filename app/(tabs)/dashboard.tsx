import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

// Constants
const ESP_BASE = "http://192.168.4.1";
const AUTO_REFRESH_INTERVAL = 5000; // 5 seconds
const DEFAULT_CHART_POINTS = 20;

// Helper function to map values
const mapValue = (value: number, fromLow: number, fromHigh: number, toLow: number, toHigh: number) => {
  return toLow + (toHigh - toLow) * ((value - fromLow) / (fromHigh - fromLow));
};

// Interpreted moisture level based on percentage
const getMoistureLevel = (percentage: number) => {
  if (percentage < 20) return { level: 'Very Dry', color: '#FF3B30', icon: 'alert-circle' };
  if (percentage < 40) return { level: 'Dry', color: '#FF9500', icon: 'water-outline' };
  if (percentage < 60) return { level: 'Moderate', color: '#34C759', icon: 'water' };
  if (percentage < 80) return { level: 'Moist', color: '#30B0C7', icon: 'water' };
  return { level: 'Wet', color: '#007AFF', icon: 'water' };
};

// Dashboard for Live ESP Data
export default function ESPDashboardScreen() {
  // State for sensor data
  const [sensorData, setSensorData] = useState({
    moisture: 0,
    temperature: 0,
    humidity: 0,
    rawAnalog: 0,
    heatIndex: 0,
  });

  // History data for charts
  const [moistureHistory, setMoistureHistory] = useState<number[]>([]);
  const [temperatureHistory, setTemperatureHistory] = useState<number[]>([]);
  const [humidityHistory, setHumidityHistory] = useState<number[]>([]);
  
  // UI state
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showMoistureInfo, setShowMoistureInfo] = useState(false);
  
  // Animation values
  const moistureAnim = useRef(new Animated.Value(0)).current;
  const temperatureAnim = useRef(new Animated.Value(0)).current;
  const humidityAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Navigation handler
  const handleBack = useCallback(() => {
    router.back();
  }, []);

  // Start pulse animation for the "Live" indicator
  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        })
      ]).start(() => pulse());
    };
    
    pulse();
  }, []);

  // Simulate data for demo mode
  const simulateData = () => {
    const moistureVar = Math.floor(Math.random() * 10) - 5;
    const tempVar = (Math.random() * 2 - 1).toFixed(1);
    const humVar = (Math.random() * 4 - 2).toFixed(1);
    
    // Use previous value and add some variation
    setSensorData(prev => {
      const newMoisture = Math.max(5, Math.min(95, prev.moisture + moistureVar));
      const newTemp = Math.max(18, Math.min(32, prev.temperature + parseFloat(tempVar)));
      const newHum = Math.max(30, Math.min(90, prev.humidity + parseFloat(humVar)));
      const newRaw = Math.round(mapValue(newMoisture, 0, 100, 1023, 300));
      
      return {
        moisture: newMoisture,
        temperature: newTemp,
        humidity: newHum,
        rawAnalog: newRaw,
        heatIndex: newTemp + (newHum > 40 ? (0.05 * newHum) : 0),
      };
    });
    
    setLastUpdated(new Date().toLocaleTimeString());
  };

  // Fetch real data from ESP8266
  const fetchESPData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    
    if (demoMode) {
      simulateData();
      setLoading(false);
      setRefreshing(false);
      return;
    }
    
    try {
      // Try to fetch DHT11 data
      const dhtRes = await fetch(`${ESP_BASE}/raw_dht11`, { 
        headers: { 'Cache-Control': 'no-cache' }
      });
      const rawDHT = await dhtRes.text();
      const [humidityStr, temperatureStr] = rawDHT.trim().split(" ");
      
      // Try to fetch analog data
      const analogRes = await fetch(`${ESP_BASE}/raw_a`, { 
        headers: { 'Cache-Control': 'no-cache' }
      });
      const rawAnalogText = await analogRes.text();
      const rawAnalogValue = parseInt(rawAnalogText.trim());
      
      // If we got valid data, update the state
      if (!isNaN(rawAnalogValue) && humidityStr && temperatureStr) {
        const tempValue = parseFloat(temperatureStr);
        const humValue = parseFloat(humidityStr);
        
        // Calculate heat index if we have valid temperature and humidity
        let heatIndex = tempValue;
        if (!isNaN(tempValue) && !isNaN(humValue)) {
          // Simple heat index calculation
          if (tempValue > 20 && humValue > 40) {
            // This is a simplified version - real heat index is more complex
            heatIndex = tempValue + (0.05 * humValue);
          }
        }
        
        // Calculate moisture percentage from raw analog
        const moisturePercentage = Math.round(mapValue(rawAnalogValue, 1023, 300, 0, 100));
        
        // Update the data with smooth animation
        Animated.parallel([
          Animated.timing(moistureAnim, {
            toValue: moisturePercentage,
            duration: 500,
            useNativeDriver: false
          }),
          Animated.timing(temperatureAnim, {
            toValue: tempValue,
            duration: 500,
            useNativeDriver: false
          }),
          Animated.timing(humidityAnim, {
            toValue: humValue,
            duration: 500,
            useNativeDriver: false
          })
        ]).start();
        
        setSensorData({
          moisture: moisturePercentage,
          temperature: tempValue,
          humidity: humValue,
          heatIndex: heatIndex,
          rawAnalog: rawAnalogValue
        });
        
        // Update history arrays
        setMoistureHistory(prev => [...prev.slice(-DEFAULT_CHART_POINTS + 1), moisturePercentage]);
        setTemperatureHistory(prev => [...prev.slice(-DEFAULT_CHART_POINTS + 1), tempValue]);
        setHumidityHistory(prev => [...prev.slice(-DEFAULT_CHART_POINTS + 1), humValue]);
        
        setConnected(true);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (error) {
      // Just log the error instead of showing it
      console.log("ESP connection not available, using demo mode");
      if (!connected && !demoMode) {
        // If first attempt fails, switch to demo mode
        setDemoMode(true);
        simulateData();
        
        // Populate history with initial demo data
        if (moistureHistory.length === 0) {
          const initialMoisture = Array(DEFAULT_CHART_POINTS).fill(0).map(() => Math.floor(Math.random() * 40) + 30);
          const initialTemp = Array(DEFAULT_CHART_POINTS).fill(0).map(() => Math.floor(Math.random() * 5) + 23);
          const initialHumidity = Array(DEFAULT_CHART_POINTS).fill(0).map(() => Math.floor(Math.random() * 20) + 50);
          
          setMoistureHistory(initialMoisture);
          setTemperatureHistory(initialTemp);
          setHumidityHistory(initialHumidity);
        }
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Set up auto-refresh interval
  useEffect(() => {
    if (autoRefresh) {
      fetchESPData(); // Initial fetch
      
      const interval = setInterval(() => {
        fetchESPData();
      }, AUTO_REFRESH_INTERVAL);
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);
  
  // Get moisture level info
  const moistureInfo = getMoistureLevel(sensorData.moisture);
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#194838', '#123524']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.contentContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Pressable
                onPress={handleBack}
                style={({ pressed }) => [
                  styles.backButton,
                  pressed && { opacity: 0.7 }
                ]}
              >
                <Ionicons name="chevron-back" size={24} color="white" />
              </Pressable>
              <Text style={styles.headerTitle}>ESP Dashboard</Text>
              {connected && !demoMode && (
                <View style={styles.liveIndicator}>
                  <Animated.View 
                    style={[
                      styles.liveDot, 
                      { transform: [{ scale: pulseAnim }] }
                    ]} 
                  />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              )}
              {demoMode && (
                <View style={styles.demoIndicator}>
                  <Text style={styles.demoText}>DEMO</Text>
                </View>
              )}
            </View>
            
            <View style={styles.connectionInfo}>
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : connected ? (
                <View style={styles.connectionStatus}>
                  <View style={[styles.statusDot, { backgroundColor: '#28a745' }]} />
                  <Text style={styles.statusText}>Connected</Text>
                </View>
              ) : (
                <View style={styles.connectionStatus}>
                  <View style={[styles.statusDot, { backgroundColor: '#dc3545' }]} />
                  <Text style={styles.statusText}>
                    Disconnected
                  </Text>
                </View>
              )}
            </View>
          </View>
          
          {/* Main Content */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => fetchESPData(true)}
                tintColor="#fff"
              />
            }
          >
            {/* Main Sensor Cards */}
            <View style={styles.mainCardContainer}>
              {/* Soil Moisture Card */}
              <Pressable
                style={[styles.mainCard, { borderColor: moistureInfo.color }]}
                onPress={() => setShowMoistureInfo(!showMoistureInfo)}
              >
                <View style={styles.cardHeader}>
                  <Ionicons name={moistureInfo.icon as any} size={28} color={moistureInfo.color} />
                  <Text style={styles.cardTitle}>Soil Moisture</Text>
                </View>
                
                <View style={styles.cardContent}>
                  <Text style={[styles.mainValue, { color: moistureInfo.color }]}>
                    {sensorData.moisture}<Text style={styles.unit}>%</Text>
                  </Text>
                </View>
                
                <View style={styles.cardFooter}>
                  <Text style={[styles.levelText, { color: moistureInfo.color }]}>
                    {moistureInfo.level}
                  </Text>
                  <Text style={styles.rawText}>Raw: {sensorData.rawAnalog}</Text>
                </View>
                
                {showMoistureInfo && (
                  <View style={styles.infoOverlay}>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoTitle}>Soil Moisture Guide</Text>
                      <View style={styles.infoRow}>
                        <View style={[styles.infoColor, { backgroundColor: '#FF3B30' }]} />
                        <Text style={styles.infoText}>0-20%: Very Dry - Water immediately!</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <View style={[styles.infoColor, { backgroundColor: '#FF9500' }]} />
                        <Text style={styles.infoText}>20-40%: Dry - Water soon</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <View style={[styles.infoColor, { backgroundColor: '#34C759' }]} />
                        <Text style={styles.infoText}>40-60%: Moderate - Ideal for many plants</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <View style={[styles.infoColor, { backgroundColor: '#30B0C7' }]} />
                        <Text style={styles.infoText}>60-80%: Moist - Good for tropical plants</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <View style={[styles.infoColor, { backgroundColor: '#007AFF' }]} />
                        <Text style={styles.infoText}>80-100%: Wet - Risk of overwatering</Text>
                      </View>
                    </View>
                  </View>
                )}
              </Pressable>
              
              {/* Temperature Card */}
              <View style={styles.secondaryCardsContainer}>
                <View style={styles.secondaryCard}>
                  <View style={styles.cardHeader}>
                    <Ionicons name="thermometer-outline" size={22} color="#FF9500" />
                    <Text style={styles.cardTitleSmall}>Temperature</Text>
                  </View>
                  
                  <View style={styles.cardContent}>
                    <Text style={[styles.secondaryValue, { color: '#FF9500' }]}>
                      {sensorData.temperature.toFixed(1)}<Text style={styles.unit}>°C</Text>
                    </Text>
                  </View>
                  
                  <View style={styles.cardFooter}>
                    <Text style={styles.smallText}>
                      Heat Index: {sensorData.heatIndex.toFixed(1)}°C
                    </Text>
                  </View>
                </View>
                
                {/* Humidity Card */}
                <View style={styles.secondaryCard}>
                  <View style={styles.cardHeader}>
                    <Ionicons name="water-outline" size={22} color="#007AFF" />
                    <Text style={styles.cardTitleSmall}>Humidity</Text>
                  </View>
                  
                  <View style={styles.cardContent}>
                    <Text style={[styles.secondaryValue, { color: '#007AFF' }]}>
                      {sensorData.humidity.toFixed(1)}<Text style={styles.unit}>%</Text>
                    </Text>
                  </View>
                  
                  <View style={styles.cardFooter}>
                    <Text style={styles.smallText}>
                      Air Moisture
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            
            {/* Chart Section */}
            <View style={styles.chartContainer}>
              <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>Recent Trends</Text>
                <Text style={styles.chartSubtitle}>Last {DEFAULT_CHART_POINTS} readings</Text>
              </View>
              
              {/* Simplified Chart - Lines representing data trends */}
              <View style={styles.chartContent}>
                {/* Moisture trend line */}
                <View style={styles.chartRow}>
                  <View style={styles.chartLabelContainer}>
                    <Ionicons name="water" size={16} color="#007AFF" />
                    <Text style={styles.chartLabel}>Moisture</Text>
                  </View>
                  
                  <View style={styles.chartLineContainer}>
                    {moistureHistory.map((value, index) => (
                      <View 
                        key={`moisture-${index}`} 
                        style={[
                          styles.chartBar,
                          { 
                            height: `${Math.max(5, value)}%`,
                            backgroundColor: getMoistureLevel(value).color,
                            opacity: (index / moistureHistory.length) * 0.5 + 0.5
                          }
                        ]} 
                      />
                    ))}
                  </View>
                </View>
                
                {/* Temperature trend line */}
                <View style={styles.chartRow}>
                  <View style={styles.chartLabelContainer}>
                    <Ionicons name="thermometer-outline" size={16} color="#FF9500" />
                    <Text style={styles.chartLabel}>Temperature</Text>
                  </View>
                  
                  <View style={styles.chartLineContainer}>
                    {temperatureHistory.map((value, index) => (
                      <View 
                        key={`temp-${index}`} 
                        style={[
                          styles.chartBar,
                          { 
                            height: `${Math.max(5, mapValue(value, 15, 35, 0, 100))}%`,
                            backgroundColor: '#FF9500',
                            opacity: (index / temperatureHistory.length) * 0.5 + 0.5
                          }
                        ]} 
                      />
                    ))}
                  </View>
                </View>
                
                {/* Humidity trend line */}
                <View style={styles.chartRow}>
                  <View style={styles.chartLabelContainer}>
                    <Ionicons name="water-outline" size={16} color="#30B0C7" />
                    <Text style={styles.chartLabel}>Humidity</Text>
                  </View>
                  
                  <View style={styles.chartLineContainer}>
                    {humidityHistory.map((value, index) => (
                      <View 
                        key={`humidity-${index}`} 
                        style={[
                          styles.chartBar,
                          { 
                            height: `${Math.max(5, value)}%`,
                            backgroundColor: '#30B0C7',
                            opacity: (index / humidityHistory.length) * 0.5 + 0.5
                          }
                        ]} 
                      />
                    ))}
                  </View>
                </View>
              </View>
            </View>
            
            {/* Controls and Info */}
            <View style={styles.controlsContainer}>
              <Pressable 
                style={[styles.controlButton, !autoRefresh && styles.controlButtonActive]} 
                onPress={() => setAutoRefresh(!autoRefresh)}
              >
                <Ionicons 
                  name={autoRefresh ? "pause-circle-outline" : "play-circle-outline"} 
                  size={20} 
                  color="#fff" 
                />
                <Text style={styles.controlText}>
                  {autoRefresh ? "Pause Auto-Refresh" : "Resume Auto-Refresh"}
                </Text>
              </Pressable>
              
              <Pressable 
                style={styles.controlButton} 
                onPress={() => fetchESPData(true)}
              >
                <Ionicons name="refresh-outline" size={20} color="#fff" />
                <Text style={styles.controlText}>Refresh Now</Text>
              </Pressable>
              
              <Text style={styles.lastUpdatedText}>
                Last updated: {lastUpdated || 'Never'}
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#063B1D',
  },
  gradient: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: Platform.OS === 'android' ? 45 : 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(40, 167, 69, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#28a745',
    marginRight: 6,
  },
  liveText: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: 'bold',
  },
  connectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  mainCardContainer: {
    marginBottom: 20,
  },
  mainCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  cardTitleSmall: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  mainValue: {
    fontSize: 60,
    fontWeight: 'bold',
  },
  secondaryValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  unit: {
    fontSize: 20,
    fontWeight: 'normal',
    opacity: 0.8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rawText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  smallText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  secondaryCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(18, 53, 36, 0.95)',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    zIndex: 10,
  },
  infoContent: {
    alignItems: 'flex-start',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#fff',
    flexShrink: 1,
  },
  chartContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  chartHeader: {
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  chartSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  chartContent: {
    marginTop: 8,
  },
  chartRow: {
    flexDirection: 'row',
    marginBottom: 16,
    height: 60,
    alignItems: 'center',
  },
  chartLabelContainer: {
    width: 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartLabel: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 8,
  },
  chartLineContainer: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  chartBar: {
    width: 6,
    borderRadius: 3,
    marginHorizontal: 1,
  },
  controlsContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    marginBottom: 12,
  },
  controlButtonActive: {
    backgroundColor: 'rgba(220, 53, 69, 0.3)',
  },
  controlText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 8,
  },
  lastUpdatedText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 4,
  },
  demoIndicator: {
    backgroundColor: 'rgba(255, 149, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  demoText: {
    fontSize: 12,
    color: '#FF9500',
    fontWeight: 'bold',
  },
}); 