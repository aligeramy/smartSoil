import { useScreenSize } from '@/components/ui/ResponsiveLayout';
import { ResponsiveText } from '@/components/ui/ResponsiveText';
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

// Constants - will be dynamically set from settings
let ESP_BASE = "http://192.168.4.1";
const ESP_IP_STORAGE_KEY = 'esp_ip_address';
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
  const { isLargeScreen } = useScreenSize();
  
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
  // Debug logs state
  const [showLogs, setShowLogs] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  
  // Animation values
  const moistureAnim = useRef(new Animated.Value(0)).current;
  const temperatureAnim = useRef(new Animated.Value(0)).current;
  const humidityAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Add log function
  const addLog = (message: string) => {
    console.log(message);
    setDebugLogs(prev => {
      const newLogs = [...prev, `${new Date().toLocaleTimeString()}: ${message}`];
      // Keep only the last 50 logs
      return newLogs.slice(-50);
    });
  };

  // Navigation handler
  const handleBack = useCallback(() => {
    router.back();
  }, []);
  
  // Load ESP IP from storage
  useEffect(() => {
    // For web, use localStorage
    if (Platform.OS === 'web') {
      const savedIp = localStorage.getItem(ESP_IP_STORAGE_KEY);
      if (savedIp) {
        ESP_BASE = `http://${savedIp}`;
        addLog('Using ESP IP from settings: ' + ESP_BASE);
      }
    }
    // For native apps, would use AsyncStorage (not implemented here)
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
      const newHeatIndex = newTemp + (newHum > 40 ? 2 : 0); // Simple demo heat index
      
      return {
        moisture: newMoisture,
        temperature: newTemp,
        humidity: newHum,
        rawAnalog: newRaw,
        heatIndex: newHeatIndex,
      };
    });
    
    // Update history after a delay
    setTimeout(() => {
      setMoistureHistory(prev => [...prev.slice(-DEFAULT_CHART_POINTS + 1), sensorData.moisture]);
      setTemperatureHistory(prev => [...prev.slice(-DEFAULT_CHART_POINTS + 1), sensorData.temperature]);
      setHumidityHistory(prev => [...prev.slice(-DEFAULT_CHART_POINTS + 1), sensorData.humidity]);
    }, 100);
    
    setLastUpdated(new Date().toLocaleTimeString());
    addLog('Updated demo data');
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
      // Check for updated ESP IP from settings
      if (Platform.OS === 'web') {
        const savedIp = localStorage.getItem(ESP_IP_STORAGE_KEY);
        if (savedIp) {
          ESP_BASE = `http://${savedIp}`;
        }
      }
      
      addLog(`Attempting to connect to ESP at: ${ESP_BASE}`);
      
      try {
        // Create an AbortController with timeout for compatibility
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const dhtRes = await fetch(`${ESP_BASE}/raw_dht11`, { 
          headers: { 'Cache-Control': 'no-cache' },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        const rawDHT = await dhtRes.text();
        addLog(`DHT11 data received: ${rawDHT}`);
        
        // Parse 3 values from sensor: humidity, temperature, heat index
        const dhtValues = rawDHT.trim().split(" ");
        const humidityStr = dhtValues[0];
        const temperatureStr = dhtValues[1];
        const heatIndexStr = dhtValues.length > 2 ? dhtValues[2] : null;
        
        // Create a new controller for the second fetch
        const controller2 = new AbortController();
        const timeoutId2 = setTimeout(() => controller2.abort(), 5000);
        
        // Try to fetch analog data
        const analogRes = await fetch(`${ESP_BASE}/raw_a`, { 
          headers: { 'Cache-Control': 'no-cache' },
          signal: controller2.signal
        });
        
        clearTimeout(timeoutId2);
        
        const rawAnalogText = await analogRes.text();
        addLog(`Analog data received: ${rawAnalogText}`);
        const rawAnalogValue = parseInt(rawAnalogText.trim());
        
        // If we got valid data, update the state
        if (!isNaN(rawAnalogValue) && humidityStr && temperatureStr) {
          const tempValue = parseFloat(temperatureStr);
          const humValue = parseFloat(humidityStr);
          
          // Use heat index directly from sensor if available, otherwise use temperature
          let heatIndex = tempValue;
          if (heatIndexStr && !isNaN(parseFloat(heatIndexStr))) {
            heatIndex = parseFloat(heatIndexStr);
            addLog(`Using heat index from sensor: ${heatIndex}`);
          } else {
            addLog('Heat index not provided by sensor, using temperature');
          }
          
          // Calculate moisture percentage from raw analog
          const moisturePercentage = Math.round(mapValue(rawAnalogValue, 1023, 300, 0, 100));
          addLog(`Calculated moisture: ${moisturePercentage}%`);
          
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
          addLog('Successfully updated sensor data');
        }
      } catch (fetchError: any) {
        addLog(`Fetch error: ${fetchError.message || fetchError}`);
        throw new Error(`Fetch failed: ${fetchError.message || "Unknown fetch error"}`);
      }
    } catch (error: any) {
      // Log more detailed error information for diagnosis
      addLog(`ESP connection error: ${error.message || "Unknown error"}`);
      addLog(`Error type: ${error.name || "No error name"}`);
      addLog(`Platform: ${Platform.OS}`);
      addLog(`Network URL attempted: ${ESP_BASE}`);
      
      if (!connected && !demoMode) {
        // If first attempt fails, switch to demo mode
        addLog("Switching to demo mode");
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
          <View style={[styles.header, isLargeScreen && styles.headerLarge]}>
            <View style={styles.headerLeft}>
              <Pressable
                onPress={handleBack}
                style={({ pressed }) => [
                  styles.backButton,
                  pressed && { opacity: 0.7 }
                ]}
              >
                <Ionicons name="chevron-back" size={isLargeScreen ? 28 : 24} color="white" />
              </Pressable>
              <ResponsiveText variant="heading2" style={styles.headerTitle}>ESP Dashboard</ResponsiveText>
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
                <ActivityIndicator size={isLargeScreen ? "large" : "small"} color="#fff" />
              ) : connected ? (
                <View style={styles.connectionStatus}>
                  <View style={[styles.statusDot, { backgroundColor: '#28a745' }]} />
                  <ResponsiveText variant="caption" style={styles.statusText}>Connected</ResponsiveText>
                </View>
              ) : (
                <View style={styles.connectionStatus}>
                  <View style={[styles.statusDot, { backgroundColor: '#dc3545' }]} />
                  <ResponsiveText variant="caption" style={styles.statusText}>
                    Disconnected
                  </ResponsiveText>
                </View>
              )}
            </View>
          </View>
          
          {/* Main Content */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              isLargeScreen && styles.scrollContentLarge
            ]}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => fetchESPData(true)}
                tintColor="#fff"
              />
            }
          >
            {/* Main Cards Container - changes layout based on screen size */}
            <View style={[
              styles.mainCardContainer, 
              isLargeScreen && styles.mainCardContainerLarge
            ]}>
              {/* Soil Moisture Card */}
              <Pressable
                style={[
                  styles.mainCard, 
                  { borderColor: moistureInfo.color },
                  isLargeScreen && styles.mainCardLarge
                ]}
                onPress={() => setShowMoistureInfo(!showMoistureInfo)}
              >
                <View style={styles.cardHeader}>
                  <Ionicons 
                    name={moistureInfo.icon as any} 
                    size={isLargeScreen ? 32 : 28} 
                    color={moistureInfo.color} 
                  />
                  <ResponsiveText variant="body" style={styles.cardTitle}>Soil Moisture</ResponsiveText>
                </View>
                
                <View style={styles.cardContent}>
                  <ResponsiveText style={[
                    styles.mainValue, 
                    { color: moistureInfo.color },
                    isLargeScreen && styles.mainValueLarge
                  ]}>
                    {sensorData.moisture}<Text style={styles.unit}>%</Text>
                  </ResponsiveText>
                </View>
                
                <View style={styles.cardFooter}>
                  <ResponsiveText style={[styles.levelText, { color: moistureInfo.color }]}>
                    {moistureInfo.level}
                  </ResponsiveText>
                  <ResponsiveText variant="caption" style={styles.rawText}>Raw: {sensorData.rawAnalog}</ResponsiveText>
                </View>
                
                {showMoistureInfo && (
                  <View style={styles.infoOverlay}>
                    <View style={styles.infoContent}>
                      <ResponsiveText variant="heading3" style={styles.infoTitle}>Soil Moisture Guide</ResponsiveText>
                      <View style={styles.infoRow}>
                        <View style={[styles.infoColor, { backgroundColor: '#FF3B30' }]} />
                        <ResponsiveText variant="caption" style={styles.infoText}>0-20%: Very Dry - Water immediately!</ResponsiveText>
                      </View>
                      <View style={styles.infoRow}>
                        <View style={[styles.infoColor, { backgroundColor: '#FF9500' }]} />
                        <ResponsiveText variant="caption" style={styles.infoText}>20-40%: Dry - Water soon</ResponsiveText>
                      </View>
                      <View style={styles.infoRow}>
                        <View style={[styles.infoColor, { backgroundColor: '#34C759' }]} />
                        <ResponsiveText variant="caption" style={styles.infoText}>40-60%: Moderate - Ideal for many plants</ResponsiveText>
                      </View>
                      <View style={styles.infoRow}>
                        <View style={[styles.infoColor, { backgroundColor: '#30B0C7' }]} />
                        <ResponsiveText variant="caption" style={styles.infoText}>60-80%: Moist - Good for tropical plants</ResponsiveText>
                      </View>
                      <View style={styles.infoRow}>
                        <View style={[styles.infoColor, { backgroundColor: '#007AFF' }]} />
                        <ResponsiveText variant="caption" style={styles.infoText}>80-100%: Wet - Risk of overwatering</ResponsiveText>
                      </View>
                    </View>
                  </View>
                )}
              </Pressable>
              
              {/* Secondary Cards Container */}
              <View style={[
                styles.secondaryCardsContainer,
                isLargeScreen && styles.secondaryCardsContainerLarge
              ]}>
                {/* Temperature Card */}
                <View style={[
                  styles.secondaryCard,
                  isLargeScreen && styles.secondaryCardLarge
                ]}>
                  <View style={styles.cardHeader}>
                    <Ionicons 
                      name="thermometer-outline" 
                      size={isLargeScreen ? 26 : 22} 
                      color="#FF9500" 
                    />
                    <ResponsiveText variant="body" style={styles.cardTitleSmall}>Temperature</ResponsiveText>
                  </View>
                  
                  <View style={styles.cardContent}>
                    <ResponsiveText style={[
                      styles.secondaryValue, 
                      { color: '#FF9500' },
                      isLargeScreen && styles.secondaryValueLarge
                    ]}>
                      {sensorData.temperature.toFixed(1)}<Text style={styles.unit}>°C</Text>
                    </ResponsiveText>
                  </View>
                  
                  <View style={styles.cardFooter}>
                    <ResponsiveText variant="caption" style={styles.smallText}>
                      Heat Index: {sensorData.heatIndex.toFixed(1)}°C
                    </ResponsiveText>
                  </View>
                </View>
                
                {/* Humidity Card */}
                <View style={[
                  styles.secondaryCard,
                  isLargeScreen && styles.secondaryCardLarge
                ]}>
                  <View style={styles.cardHeader}>
                    <Ionicons 
                      name="water-outline" 
                      size={isLargeScreen ? 26 : 22} 
                      color="#007AFF" 
                    />
                    <ResponsiveText variant="body" style={styles.cardTitleSmall}>Humidity</ResponsiveText>
                  </View>
                  
                  <View style={styles.cardContent}>
                    <ResponsiveText style={[
                      styles.secondaryValue, 
                      { color: '#007AFF' },
                      isLargeScreen && styles.secondaryValueLarge
                    ]}>
                      {sensorData.humidity.toFixed(1)}<Text style={styles.unit}>%</Text>
                    </ResponsiveText>
                  </View>
                  
                  <View style={styles.cardFooter}>
                    <ResponsiveText variant="caption" style={styles.smallText}>
                      Air Moisture
                    </ResponsiveText>
                  </View>
                </View>
              </View>
            </View>
            
            {/* Chart Section */}
            <View style={[
              styles.chartContainer,
              isLargeScreen && styles.chartContainerLarge
            ]}>
              <View style={styles.chartHeader}>
                <ResponsiveText variant="heading3" style={styles.chartTitle}>Recent Trends</ResponsiveText>
                <ResponsiveText variant="caption" style={styles.chartSubtitle}>Last {DEFAULT_CHART_POINTS} readings</ResponsiveText>
              </View>
              
              {/* Simplified Chart - Lines representing data trends */}
              <View style={styles.chartContent}>
                {/* Moisture trend line */}
                <View style={styles.chartRow}>
                  <View style={styles.chartLabelContainer}>
                    <Ionicons name="water" size={isLargeScreen ? 20 : 16} color="#007AFF" />
                    <ResponsiveText variant="caption" style={styles.chartLabel}>Moisture</ResponsiveText>
                  </View>
                  
                  <View style={styles.chartLineContainer}>
                    {moistureHistory.map((value, index) => (
                      <View 
                        key={`moisture-${index}`} 
                        style={[
                          styles.chartBar,
                          isLargeScreen && styles.chartBarLarge,
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
                    <Ionicons name="thermometer-outline" size={isLargeScreen ? 20 : 16} color="#FF9500" />
                    <ResponsiveText variant="caption" style={styles.chartLabel}>Temperature</ResponsiveText>
                  </View>
                  
                  <View style={styles.chartLineContainer}>
                    {temperatureHistory.map((value, index) => (
                      <View 
                        key={`temp-${index}`} 
                        style={[
                          styles.chartBar,
                          isLargeScreen && styles.chartBarLarge,
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
                    <Ionicons name="water-outline" size={isLargeScreen ? 20 : 16} color="#30B0C7" />
                    <ResponsiveText variant="caption" style={styles.chartLabel}>Humidity</ResponsiveText>
                  </View>
                  
                  <View style={styles.chartLineContainer}>
                    {humidityHistory.map((value, index) => (
                      <View 
                        key={`humidity-${index}`} 
                        style={[
                          styles.chartBar,
                          isLargeScreen && styles.chartBarLarge,
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
            <View style={[
              styles.controlsContainer,
              isLargeScreen && styles.controlsContainerLarge
            ]}>
              <Pressable 
                style={[
                  styles.controlButton, 
                  !autoRefresh && styles.controlButtonActive,
                  isLargeScreen && styles.controlButtonLarge
                ]} 
                onPress={() => setAutoRefresh(!autoRefresh)}
              >
                <Ionicons 
                  name={autoRefresh ? "pause-circle-outline" : "play-circle-outline"} 
                  size={isLargeScreen ? 24 : 20} 
                  color="#fff" 
                />
                <ResponsiveText variant="caption" style={styles.controlText}>
                  {autoRefresh ? "Pause Auto-Refresh" : "Resume Auto-Refresh"}
                </ResponsiveText>
              </Pressable>
              
              <Pressable 
                style={[
                  styles.controlButton,
                  isLargeScreen && styles.controlButtonLarge
                ]} 
                onPress={() => fetchESPData(true)}
              >
                <Ionicons name="refresh-outline" size={isLargeScreen ? 24 : 20} color="#fff" />
                <ResponsiveText variant="caption" style={styles.controlText}>Refresh Now</ResponsiveText>
              </Pressable>
              
              <Pressable 
                style={[
                  styles.controlButton,
                  showLogs && styles.controlButtonActive,
                  isLargeScreen && styles.controlButtonLarge
                ]} 
                onPress={() => setShowLogs(!showLogs)}
              >
                <Ionicons name="code-outline" size={isLargeScreen ? 24 : 20} color="#fff" />
                <ResponsiveText variant="caption" style={styles.controlText}>
                  {showLogs ? "Hide Logs" : "Show Logs"}
                </ResponsiveText>
              </Pressable>
              
              <ResponsiveText variant="caption" style={styles.lastUpdatedText}>
                Last updated: {lastUpdated || 'Never'}
              </ResponsiveText>
              
              {isLargeScreen && (
                <View style={styles.espInfoContainer}>
                  <ResponsiveText variant="caption" style={styles.espInfoText}>
                    Connected to ESP8266 at: {ESP_BASE}
                  </ResponsiveText>
                  <ResponsiveText variant="caption" style={styles.espInfoText}>
                    To change the IP address, please visit the Settings page.
                  </ResponsiveText>
                </View>
              )}
            </View>
            
            {/* Debug Logs Section */}
            {showLogs && (
              <View style={styles.logsContainer}>
                <View style={styles.logsHeader}>
                  <Text style={styles.logsTitle}>Connection Logs</Text>
                  <Pressable 
                    style={styles.clearLogsButton}
                    onPress={() => setDebugLogs([])}
                  >
                    <Text style={styles.clearLogsText}>Clear</Text>
                  </Pressable>
                </View>
                
                <ScrollView style={styles.logsScrollView}>
                  {debugLogs.length === 0 ? (
                    <Text style={styles.noLogsText}>No logs yet.</Text>
                  ) : (
                    debugLogs.map((log, index) => (
                      <Text key={index} style={styles.logEntry}>{log}</Text>
                    ))
                  )}
                </ScrollView>
                
                <View style={styles.connectionInfo}>
                  <Text style={styles.connectionInfoText}>
                    ESP IP: {ESP_BASE}
                  </Text>
                  <Text style={styles.connectionInfoText}>
                    Status: {connected ? 'Connected' : 'Disconnected'} 
                    {demoMode ? ' (Demo Mode)' : ''}
                  </Text>
                  <Text style={styles.connectionInfoText}>
                    Platform: {Platform.OS}
                  </Text>
                </View>
              </View>
            )}
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
  headerLarge: {
    paddingHorizontal: 30,
    paddingVertical: 24,
    paddingTop: Platform.OS === 'android' ? 50 : 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
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
    color: 'rgba(255, 255, 255, 0.7)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  scrollContentLarge: {
    padding: 30,
    paddingBottom: 60,
    maxWidth: 1100,
    alignSelf: 'center',
    width: '100%',
  },
  mainCardContainer: {
    marginBottom: 20,
  },
  mainCardContainerLarge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  mainCardLarge: {
    flex: 1,
    marginRight: 20,
    marginBottom: 0,
    padding: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  cardTitleSmall: {
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
  mainValueLarge: {
    fontSize: 72,
  },
  secondaryValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  secondaryValueLarge: {
    fontSize: 48,
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
    color: 'rgba(255, 255, 255, 0.6)',
  },
  smallText: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  secondaryCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryCardsContainerLarge: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
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
  secondaryCardLarge: {
    width: '100%',
    marginBottom: 16,
    padding: 20,
    flex: 1,
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
    color: '#fff',
    flexShrink: 1,
  },
  chartContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  chartContainerLarge: {
    padding: 24,
  },
  chartHeader: {
    marginBottom: 16,
  },
  chartTitle: {
    fontWeight: 'bold',
    color: '#fff',
  },
  chartSubtitle: {
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
  chartBarLarge: {
    width: 10,
    borderRadius: 5,
    marginHorizontal: 2,
  },
  controlsContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  controlsContainerLarge: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
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
  controlButtonLarge: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 8,
  },
  controlButtonActive: {
    backgroundColor: 'rgba(220, 53, 69, 0.3)',
  },
  controlText: {
    color: '#fff',
    marginLeft: 8,
  },
  lastUpdatedText: {
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
  espInfoContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  espInfoText: {
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  logsContainer: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
  },
  logsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 8,
  },
  logsTitle: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 18,
  },
  clearLogsButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  clearLogsText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  logsScrollView: {
    maxHeight: 200,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 10,
  },
  noLogsText: {
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    padding: 10,
  },
  logEntry: {
    color: '#fff',
    marginBottom: 4,
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  connectionInfoText: {
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
    fontSize: 12,
    marginTop: 10,
  },
}); 