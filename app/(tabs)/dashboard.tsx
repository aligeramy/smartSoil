import { useScreenSize } from '@/components/ui/ResponsiveLayout';
import { ResponsiveText } from '@/components/ui/ResponsiveText';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  useColorScheme
} from 'react-native';

// Import centralized ESP utility functions from lib index
import {
  fetchAllSensorData,
  getEspBaseUrl,
  moistureToAnalog,
  setEspBaseUrl
} from '@/lib';

// Constants - will be dynamically set from settings
const ESP_IP_STORAGE_KEY = 'esp_ip_address';
const UPDATE_FREQUENCY_KEY = 'update_frequency';
const DEFAULT_UPDATE_INTERVAL = 5000; // 5 seconds default
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

// Type for sensor data
type SensorData = {
  moisture: number;
  temperature: number;
  humidity: number;
  rawAnalog: number;
  resistanceTop?: number;
  resistanceBottom?: number;
  heatIndex: number;
  isConnected: boolean;
  lastUpdated: string;
};

// Dashboard for Live ESP Data
export default function ESPDashboardScreen() {
  const { isLargeScreen } = useScreenSize();
  const colorScheme = useColorScheme();
  
  // State for sensor data
  const [sensorData, setSensorData] = useState<SensorData>({
    moisture: 35,
    temperature: 25.0,
    humidity: 55,
    rawAnalog: 0,
    resistanceTop: undefined,
    resistanceBottom: undefined,
    heatIndex: 0,
    isConnected: false,
    lastUpdated: "",
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
  const [showMoistureInfo, setShowMoistureInfo] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [updateInterval, setUpdateInterval] = useState(DEFAULT_UPDATE_INTERVAL);
  // Debug logs state
  const [showLogs, setShowLogs] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  
  // Animation values
  const moistureAnim = useRef(new Animated.Value(0)).current;
  const temperatureAnim = useRef(new Animated.Value(0)).current;
  const humidityAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Keep connected state in sync with sensorData.isConnected
  useEffect(() => {
    setConnected(sensorData.isConnected);
  }, [sensorData.isConnected]);

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
  
  // Function to load settings from storage
  const loadSettings = useCallback(() => {
    // For web, use localStorage
    if (Platform.OS === 'web') {
      // Load ESP IP
      const savedIp = localStorage.getItem(ESP_IP_STORAGE_KEY);
      if (savedIp) {
        setEspBaseUrl(savedIp);
        addLog('Using ESP IP from settings: ' + getEspBaseUrl());
      }
      
      // Load update frequency
      const savedFrequency = localStorage.getItem(UPDATE_FREQUENCY_KEY);
      if (savedFrequency) {
        const frequency = parseInt(savedFrequency);
        if (frequency !== updateInterval) {
          setUpdateInterval(frequency);
          addLog(`Update frequency changed to: ${frequency}ms`);
        }
      }
    }
    // For native apps, would use AsyncStorage (not implemented here)
  }, [updateInterval]);
  
  // Load ESP IP and update frequency from storage
  useEffect(() => {
    loadSettings();
    
    // Set up a timer to check for settings changes periodically
    const settingsCheckId = setInterval(() => {
      loadSettings();
    }, 10000); // Check for setting changes every 10 seconds
    
    return () => {
      clearInterval(settingsCheckId);
    };
  }, [loadSettings]);

  // Check if trends data is empty and initialize if needed
  useEffect(() => {
    if (moistureHistory.length === 0 && temperatureHistory.length === 0 && humidityHistory.length === 0) {
      // Initialize with current data point to avoid empty charts
      setMoistureHistory([sensorData.moisture]);
      setTemperatureHistory([sensorData.temperature]);
      setHumidityHistory([sensorData.humidity]);
      
      if (demoMode) {
        // Generate a few initial data points for history
        for (let i = 0; i < DEFAULT_CHART_POINTS - 1; i++) {
          setTimeout(() => {
            if (demoMode) mockData();
          }, i * 100);
        }
      } else {
        // Trigger a data fetch
        fetchData(false);
      }
    }
  }, [demoMode]);

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

  // Fetch data function using centralized utility
  const fetchData = async (showLoadingIndicator = true): Promise<boolean> => {
    if (showLoadingIndicator) setLoading(true);
    
    try {
      // Check if we have a saved IP address
      const savedIp = await AsyncStorage.getItem('esp-ip');
      if (savedIp) {
        setEspBaseUrl(savedIp);
        addLog('Using ESP IP from settings: ' + getEspBaseUrl());
      }
      
      // Use the centralized function to fetch all sensor data
      const data = await fetchAllSensorData(addLog);
      
      if (data) {
        // Data fetched successfully, update state
        setSensorData({
          ...sensorData,
          temperature: data.temperature,
          humidity: data.humidity,
          moisture: data.moisture,
          rawAnalog: data.rawAnalog,
          resistanceTop: data.resistanceTop,
          resistanceBottom: data.resistanceBottom,
          heatIndex: data.temperature, // Use temperature as heat index for now
          lastUpdated: new Date().toLocaleTimeString(),
          isConnected: true,
        });

        // Update history arrays
        setMoistureHistory(prev => [...prev.slice(-DEFAULT_CHART_POINTS + 1), data.moisture]);
        setTemperatureHistory(prev => [...prev.slice(-DEFAULT_CHART_POINTS + 1), data.temperature]);
        setHumidityHistory(prev => [...prev.slice(-DEFAULT_CHART_POINTS + 1), data.humidity]);
        
        // Set demo mode to false when connected
        setDemoMode(false);
        
        return true;
      } else {
        // Handle connection error - show demo data
        const newMoisture = Math.max(10, Math.min(95, sensorData.moisture + (Math.random() > 0.5 ? -1 : 1) * Math.random() * 5));
        const newTemp = Math.max(15, Math.min(35, sensorData.temperature + (Math.random() > 0.5 ? -0.2 : 0.2)));
        const newHumidity = Math.max(20, Math.min(80, sensorData.humidity + (Math.random() > 0.5 ? -1 : 1) * Math.random() * 3));
        
        // Use utility function to convert moisture to analog
        const newRaw = moistureToAnalog(newMoisture);
        
        setSensorData({
          ...sensorData,
          moisture: Math.round(newMoisture),
          temperature: Number(newTemp.toFixed(1)),
          humidity: Math.round(newHumidity),
          rawAnalog: newRaw,
          heatIndex: Number(newTemp.toFixed(1)), // Use temperature as heat index
          lastUpdated: new Date().toLocaleTimeString(),
          isConnected: false,
        });
        
        // Set demo mode flag to true
        setDemoMode(true);
        
        return false;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      addLog(`Error fetching data: ${error}`);
      return false;
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Mock data for demo mode
  const mockData = () => {
    // Generate random values for demo mode
    const newMoisture = Math.max(10, Math.min(95, 50 + (Math.random() > 0.5 ? -1 : 1) * Math.random() * 30));
    const newTemp = Math.max(18, Math.min(32, 24 + (Math.random() > 0.5 ? -1 : 1) * Math.random() * 5));
    const newHumidity = Math.max(30, Math.min(90, 60 + (Math.random() > 0.5 ? -1 : 1) * Math.random() * 20));
    
    // Use utility function to convert moisture to analog
    const newRaw = moistureToAnalog(newMoisture);

    setSensorData({
      moisture: Math.round(newMoisture),
      temperature: Number(newTemp.toFixed(1)),
      humidity: Math.round(newHumidity),
      rawAnalog: newRaw,
      heatIndex: Number(newTemp.toFixed(1)), // Use temperature as heat index
      lastUpdated: new Date().toLocaleTimeString(),
      isConnected: false
    });
    
    // Update history arrays for trends just like with real data
    setMoistureHistory(prev => [...prev.slice(-DEFAULT_CHART_POINTS + 1), Math.round(newMoisture)]);
    setTemperatureHistory(prev => [...prev.slice(-DEFAULT_CHART_POINTS + 1), Number(newTemp.toFixed(1))]);
    setHumidityHistory(prev => [...prev.slice(-DEFAULT_CHART_POINTS + 1), Math.round(newHumidity)]);
    
    // Set demo mode flag to true
    setDemoMode(true);
  };

  // Set up auto-refresh interval
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    
    if (autoRefresh) {
      addLog(`Auto-refresh enabled with interval: ${updateInterval}ms`);
      intervalId = setInterval(() => {
        if (!refreshing && !loading) {
          addLog('Auto-refreshing data...');
          if (demoMode) {
            // If in demo mode, generate new mock data
            mockData();
          } else {
            // Otherwise try to fetch real data
            fetchData(false);
          }
        }
      }, updateInterval);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefresh, refreshing, loading, updateInterval, demoMode]);

  // Initial data fetch when component mounts
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    // Try to fetch data initially
    fetchData().then(success => {
      // If not successful after 5 seconds, switch to demo mode
      if (!success) {
        timeoutId = setTimeout(() => {
          if (!connected) {
            addLog('Could not connect to ESP, switching to demo mode');
            // Initialize history arrays with mock data
            const initialMockData = () => {
              mockData();
              
              // Generate a few initial data points for history
              for (let i = 0; i < DEFAULT_CHART_POINTS - 1; i++) {
                setTimeout(() => {
                  if (demoMode) mockData();
                }, i * 100);
              }
            };
            
            initialMockData();
          }
        }, 5000);
      }
    });
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Handle manual refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchData(true)
      .then(() => setRefreshing(false))
      .catch(() => setRefreshing(false));
  };
  
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
            </View>
            
            <View style={styles.connectionInfo}>
              {loading ? (
                <ActivityIndicator size={isLargeScreen ? "large" : "small"} color="#fff" />
              ) : connected ? (
                <View style={styles.connectionStatus}>
                  <Animated.View 
                    style={[
                      styles.statusDot, 
                      { backgroundColor: '#28a745' },
                      { transform: [{ scale: pulseAnim }] }
                    ]} 
                  />
                  <ResponsiveText variant="caption" style={styles.statusText}>Connected</ResponsiveText>
                </View>
              ) : demoMode ? (
                <View style={styles.connectionStatus}>
                  <View style={[styles.statusDot, { backgroundColor: '#FF9500' }]} />
                  <ResponsiveText variant="caption" style={styles.statusText}>
                    Demo Mode
                  </ResponsiveText>
                </View>
              ) : null}
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
                onRefresh={handleRefresh}
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
                    ESP IP: {getEspBaseUrl()}
                  </Text>
                  <Text style={styles.connectionInfoText}>
                    Status: {connected ? 'Connected' : demoMode ? 'Demo Mode' : ''} 
                  </Text>
                  <Text style={styles.connectionInfoText}>
                    Platform: {Platform.OS}
                  </Text>
                </View>
              </View>
            )}

            {/* Control Panel */}
            <View style={styles.controlPanel}>
              <View style={styles.controlButtons}>
                <View style={styles.toggleContainer}>
                  <Text style={styles.toggleLabel}>Auto Refresh</Text>
                  <Switch
                    value={autoRefresh}
                    onValueChange={setAutoRefresh}
                    style={styles.toggleSwitch}
                  />
                </View>
                
                <View style={styles.buttonGroup}>
                  <Pressable 
                    style={styles.smallButton} 
                    onPress={() => fetchData(true)}
                  >
                    <Ionicons name="refresh-outline" size={16} color="#fff" />
                    <Text style={styles.smallButtonText}>Refresh</Text>
                  </Pressable>
                  
                  <Pressable 
                    style={[styles.smallButton, showLogs && styles.smallButtonActive]} 
                    onPress={() => setShowLogs(!showLogs)}
                  >
                    <Ionicons name="code-outline" size={16} color="#fff" />
                    <Text style={styles.smallButtonText}>{showLogs ? "Hide" : "Logs"}</Text>
                  </Pressable>
                </View>
              </View>
              
              {/* SOFTX branding footer */}
              <View style={styles.brandingContainer}>
                <View style={styles.brandingContent}>
                  <Image 
                    source={require('@/assets/images/logo/tx.png')} 
                    style={styles.brandingLogo} 
                    resizeMode="contain"
                  />
                  <View style={styles.brandingTextContainer}>
                    <Text style={styles.brandingText}>POWERED BY</Text>
                    <Text style={styles.brandingCompany}>SOFTX INNOVATIONS INC</Text>
                    <Text style={styles.brandingContact}>support@softxinnovations.ca</Text>
                  </View>
                </View>
              </View>
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
  headerLarge: {
    paddingHorizontal: 30,
    paddingVertical: 24,
    paddingTop: Platform.OS === 'android' ? 50 : 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
    flex: 1,
    marginTop: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  connectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 44,
    justifyContent: 'flex-end',
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
  controlPanel: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 20,
    marginTop: 10,
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    color: 'white',
    fontSize: 14,
    marginRight: 10,
  },
  toggleSwitch: {
    transform: [{ scale: 0.8 }],
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  smallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginLeft: 8,
  },
  smallButtonActive: {
    backgroundColor: 'rgba(220, 53, 69, 0.3)',
  },
  smallButtonText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
  },
  brandingContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    marginBottom: 10,
  },
  brandingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandingLogo: {
    width: 35,
    height: 35,
    marginRight: 10,
  },
  brandingTextContainer: {
    flexDirection: 'column',
    marginLeft: 5,
  },
  brandingText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    letterSpacing: 1,
  },
  brandingCompany: {
    color: 'white',
    fontSize: 13,
    letterSpacing: 1.5,
    fontWeight: '500',
  },
  brandingContact: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    marginTop: 2,
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