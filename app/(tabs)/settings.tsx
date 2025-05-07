import { useScreenSize } from '@/components/ui/ResponsiveLayout';
import { ResponsiveText } from '@/components/ui/ResponsiveText';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Storage key for ESP IP address
const ESP_IP_STORAGE_KEY = 'esp_ip_address';

const SettingItem = ({ icon, title, subtitle, onPress, value }: {
  icon: React.ComponentProps<typeof Ionicons>['name'],
  title: string,
  subtitle?: string,
  onPress?: () => void,
  value?: string
}) => {
  const { isLargeScreen } = useScreenSize();
  
  return (
    <TouchableOpacity 
      style={[
        styles.settingItem, 
        isLargeScreen && styles.settingItemLarge
      ]} 
      onPress={onPress} 
      disabled={!onPress}
    >
      <View style={styles.settingIconContainer}>
        <Ionicons name={icon} size={isLargeScreen ? 26 : 22} color="#FFFFFF" />
      </View>
      <View style={styles.settingContent}>
        <ResponsiveText variant="body" style={styles.settingTitle}>{title}</ResponsiveText>
        {subtitle && <ResponsiveText variant="caption" style={styles.settingSubtitle}>{subtitle}</ResponsiveText>}
      </View>
      {value ? (
        <ResponsiveText variant="caption" style={styles.settingValue}>{value}</ResponsiveText>
      ) : (
        <Ionicons name="chevron-forward" size={isLargeScreen ? 24 : 20} color="#888888" />
      )}
    </TouchableOpacity>
  );
};

export default function SettingsScreen() {
  const appVersion = "1.0.0";
  const { screenSize, isLargeScreen } = useScreenSize();
  
  // State for ESP IP address and modal visibility
  const [espIpAddress, setEspIpAddress] = useState('192.168.4.1');
  const [espModalVisible, setEspModalVisible] = useState(false);
  const [ipAddressInput, setIpAddressInput] = useState('');
  
  // Load saved ESP IP address on mount
  useEffect(() => {
    const loadStoredIpAddress = async () => {
      try {
        // For web, use localStorage
        if (Platform.OS === 'web') {
          const savedIp = localStorage.getItem(ESP_IP_STORAGE_KEY);
          if (savedIp) {
            setEspIpAddress(savedIp);
            setIpAddressInput(savedIp);
          }
        }
        // For native, would use AsyncStorage (not implemented here)
      } catch (error) {
        console.error('Failed to load IP address:', error);
      }
    };
    
    loadStoredIpAddress();
  }, []);
  
  // Save ESP IP address
  const saveEspIpAddress = (ip: string) => {
    setEspIpAddress(ip);
    
    // For web, use localStorage
    if (Platform.OS === 'web') {
      localStorage.setItem(ESP_IP_STORAGE_KEY, ip);
    }
    // For native, would use AsyncStorage (not implemented here)
    
    setEspModalVisible(false);
  };
  
  // Validate IP address format
  const isValidIpAddress = (ip: string) => {
    const ipRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
  };
  
  const openUrl = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Cannot open URL: ${url}`);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#194838', '#123524']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={[styles.header, isLargeScreen && styles.headerLarge]}>
            <ResponsiveText variant="heading2" style={styles.headerTitle}>Settings</ResponsiveText>
          </View>
          
          <ScrollView style={styles.scrollView} contentContainerStyle={[
            styles.scrollContent, 
            isLargeScreen && styles.scrollContentLarge
          ]}>
            <View style={styles.section}>
              <ResponsiveText variant="heading3" style={styles.sectionTitle}>App Settings</ResponsiveText>
              
              <SettingItem
                icon="notifications-outline"
                title="Notifications"
                subtitle="Configure push notifications"
                onPress={() => Alert.alert("Notifications settings not available in this version")}
              />
              
              <SettingItem
                icon="color-palette-outline"
                title="Appearance"
                subtitle="Dark mode and themes"
                onPress={() => Alert.alert("Appearance settings not available in this version")}
              />
              
              <SettingItem
                icon="language-outline"
                title="Language"
                subtitle="Choose your preferred language"
                value="English"
                onPress={() => Alert.alert("Language settings not available in this version")}
              />
            </View>
            
            <View style={styles.section}>
              <ResponsiveText variant="heading3" style={styles.sectionTitle}>Sensor Configuration</ResponsiveText>
              
              <SettingItem
                icon="wifi-outline"
                title="ESP8266 Connection"
                subtitle="Configure your soil sensor device IP address"
                value={espIpAddress}
                onPress={() => {
                  setIpAddressInput(espIpAddress);
                  setEspModalVisible(true);
                }}
              />
              
              <SettingItem
                icon="refresh-outline"
                title="Update Frequency"
                subtitle="How often to fetch sensor data"
                value="5 seconds"
                onPress={() => Alert.alert("Update frequency settings not available in this version")}
              />
              
              <SettingItem
                icon="analytics-outline"
                title="Data History"
                subtitle="Configure data retention period"
                value="7 days"
                onPress={() => Alert.alert("Data history settings not available in this version")}
              />
            </View>
            
            <View style={styles.section}>
              <ResponsiveText variant="heading3" style={styles.sectionTitle}>Legal & About</ResponsiveText>
              
              <Link href="/privacy" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <View style={[
                      styles.settingItem, 
                      isLargeScreen && styles.settingItemLarge,
                      pressed && styles.pressed
                    ]}>
                      <View style={styles.settingIconContainer}>
                        <Ionicons name="shield-checkmark-outline" size={isLargeScreen ? 26 : 22} color="#FFFFFF" />
                      </View>
                      <View style={styles.settingContent}>
                        <ResponsiveText variant="body" style={styles.settingTitle}>Privacy Policy</ResponsiveText>
                        <ResponsiveText variant="caption" style={styles.settingSubtitle}>How we protect your data</ResponsiveText>
                      </View>
                      <Ionicons name="chevron-forward" size={isLargeScreen ? 24 : 20} color="#888888" />
                    </View>
                  )}
                </Pressable>
              </Link>
              
              <Link href="/terms" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <View style={[
                      styles.settingItem, 
                      isLargeScreen && styles.settingItemLarge,
                      pressed && styles.pressed
                    ]}>
                      <View style={styles.settingIconContainer}>
                        <Ionicons name="document-text-outline" size={isLargeScreen ? 26 : 22} color="#FFFFFF" />
                      </View>
                      <View style={styles.settingContent}>
                        <ResponsiveText variant="body" style={styles.settingTitle}>Terms of Service</ResponsiveText>
                        <ResponsiveText variant="caption" style={styles.settingSubtitle}>Legal terms for using SmartSoil</ResponsiveText>
                      </View>
                      <Ionicons name="chevron-forward" size={isLargeScreen ? 24 : 20} color="#888888" />
                    </View>
                  )}
                </Pressable>
              </Link>
              
              <SettingItem
                icon="help-circle-outline"
                title="Help & Support"
                subtitle="Get assistance with the app"
                onPress={() => openUrl("https://www.smartsoil-app.com/support")}
              />
              
              <SettingItem
                icon="information-circle-outline"
                title="About SmartSoil"
                subtitle={`Version ${appVersion}`}
                onPress={() => Alert.alert("SmartSoil", "Developed by SoftX Innovations\n\nMonitor your plants' soil moisture, temperature, and humidity with ESP8266 sensors.")}
              />
            </View>
            
            {/* For larger screens, add additional information section */}
            {isLargeScreen && (
              <View style={styles.section}>
                <ResponsiveText variant="heading3" style={styles.sectionTitle}>Technical Information</ResponsiveText>
                
                <View style={[styles.infoPanel, styles.largePanels]}>
                  <ResponsiveText variant="body" style={styles.infoPanelTitle}>Using ESP8266 with SmartSoil</ResponsiveText>
                  <ResponsiveText variant="caption" style={styles.infoPanelText}>
                    SmartSoil connects to ESP8266 microcontrollers that act as web servers, providing
                    soil moisture, temperature, and humidity data. For best results, use the DHT11 sensor for
                    temperature and humidity, and a capacitive soil moisture sensor.
                  </ResponsiveText>
                  
                  <ResponsiveText variant="heading3" style={styles.subInfoTitle}>Connection Instructions</ResponsiveText>
                  <View style={styles.instructionsList}>
                    <View style={styles.instructionItem}>
                      <View style={styles.instructionNumber}><Text style={styles.numberText}>1</Text></View>
                      <ResponsiveText variant="caption" style={styles.instructionText}>
                        Make sure your ESP8266 is powered on and running the SmartSoil firmware
                      </ResponsiveText>
                    </View>
                    
                    <View style={styles.instructionItem}>
                      <View style={styles.instructionNumber}><Text style={styles.numberText}>2</Text></View>
                      <ResponsiveText variant="caption" style={styles.instructionText}>
                        Connect to the ESP8266's WiFi network (usually named "SmartSoil-Sensor")
                      </ResponsiveText>
                    </View>
                    
                    <View style={styles.instructionItem}>
                      <View style={styles.instructionNumber}><Text style={styles.numberText}>3</Text></View>
                      <ResponsiveText variant="caption" style={styles.instructionText}>
                        Enter the IP address of your ESP8266 (default is 192.168.4.1)
                      </ResponsiveText>
                    </View>
                    
                    <View style={styles.instructionItem}>
                      <View style={styles.instructionNumber}><Text style={styles.numberText}>4</Text></View>
                      <ResponsiveText variant="caption" style={styles.instructionText}>
                        Go to the Dashboard to view your sensor data
                      </ResponsiveText>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
      
      {/* ESP8266 IP Configuration Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={espModalVisible}
        onRequestClose={() => setEspModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, isLargeScreen && styles.modalContainerLarge]}>
            <View style={styles.modalHeader}>
              <ResponsiveText variant="heading3" style={styles.modalTitle}>ESP8266 IP Configuration</ResponsiveText>
              <TouchableOpacity onPress={() => setEspModalVisible(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <ResponsiveText variant="body" style={styles.modalText}>
                Enter the IP address of your ESP8266 device. The default is usually 192.168.4.1 when
                connecting directly to the ESP8266's WiFi network.
              </ResponsiveText>
              
              <View style={styles.inputContainer}>
                <ResponsiveText variant="body" style={styles.inputLabel}>IP Address:</ResponsiveText>
                <TextInput
                  style={[styles.textInput, isLargeScreen && styles.textInputLarge]}
                  value={ipAddressInput}
                  onChangeText={setIpAddressInput}
                  placeholder="e.g., 192.168.4.1"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  keyboardType="default"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              
              <View style={styles.errorContainer}>
                {ipAddressInput && !isValidIpAddress(ipAddressInput) && (
                  <ResponsiveText variant="caption" style={styles.errorText}>
                    Please enter a valid IP address (e.g., 192.168.4.1)
                  </ResponsiveText>
                )}
              </View>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]} 
                  onPress={() => setEspModalVisible(false)}
                >
                  <ResponsiveText variant="body" style={styles.buttonText}>Cancel</ResponsiveText>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.button, 
                    styles.saveButton,
                    (!ipAddressInput || !isValidIpAddress(ipAddressInput)) && styles.disabledButton
                  ]} 
                  onPress={() => saveEspIpAddress(ipAddressInput)}
                  disabled={!ipAddressInput || !isValidIpAddress(ipAddressInput)}
                >
                  <ResponsiveText variant="body" style={styles.buttonText}>Save</ResponsiveText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
  safeArea: {
    flex: 1,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 50 : 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerLarge: {
    paddingVertical: 24,
    paddingHorizontal: 30,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  scrollContentLarge: {
    padding: 30,
    paddingBottom: 60,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    opacity: 0.9,
    paddingHorizontal: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    marginBottom: 8,
  },
  settingItemLarge: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontWeight: '500',
    color: '#FFFFFF',
  },
  settingSubtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  settingValue: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginRight: 4,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#194838',
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContainerLarge: {
    maxWidth: 500,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  modalTitle: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    padding: 20,
  },
  modalText: {
    color: '#FFFFFF',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    color: '#FFFFFF',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 16,
  },
  textInputLarge: {
    paddingVertical: 12,
    fontSize: 18,
  },
  errorContainer: {
    minHeight: 20,
    marginBottom: 15,
  },
  errorText: {
    color: '#FF5252',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  saveButton: {
    backgroundColor: '#34C759',
  },
  disabledButton: {
    backgroundColor: 'rgba(52, 199, 89, 0.4)',
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  // Additional panels for large screens
  infoPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
  },
  largePanels: {
    padding: 24,
    borderRadius: 12,
  },
  infoPanelTitle: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  infoPanelText: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
    lineHeight: 20,
  },
  subInfoTitle: {
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    fontSize: 16,
  },
  instructionsList: {
    marginTop: 8,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  numberText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  instructionText: {
    color: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
  },
}); 