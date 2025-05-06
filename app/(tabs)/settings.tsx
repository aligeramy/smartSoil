import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React from 'react';
import {
    Alert,
    Linking,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const SettingItem = ({ icon, title, subtitle, onPress, value }: {
  icon: React.ComponentProps<typeof Ionicons>['name'],
  title: string,
  subtitle?: string,
  onPress?: () => void,
  value?: string
}) => {
  return (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={!onPress}>
      <View style={styles.settingIconContainer}>
        <Ionicons name={icon} size={22} color="#FFFFFF" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {value ? (
        <Text style={styles.settingValue}>{value}</Text>
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#888888" />
      )}
    </TouchableOpacity>
  );
};

export default function SettingsScreen() {
  const appVersion = "1.0.0"; // Replace with dynamic version from your app config
  
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
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Settings</Text>
          </View>
          
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>App Settings</Text>
              
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
              <Text style={styles.sectionTitle}>Sensor Configuration</Text>
              
              <SettingItem
                icon="wifi-outline"
                title="ESP8266 Connection"
                subtitle="Configure your soil sensor device"
                onPress={() => Alert.alert("Please connect to your ESP8266 from the Dashboard")}
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
              <Text style={styles.sectionTitle}>Legal & About</Text>
              
              <Link href="/privacy" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <View style={[styles.settingItem, pressed && styles.pressed]}>
                      <View style={styles.settingIconContainer}>
                        <Ionicons name="shield-checkmark-outline" size={22} color="#FFFFFF" />
                      </View>
                      <View style={styles.settingContent}>
                        <Text style={styles.settingTitle}>Privacy Policy</Text>
                        <Text style={styles.settingSubtitle}>How we protect your data</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color="#888888" />
                    </View>
                  )}
                </Pressable>
              </Link>
              
              <Link href="/terms" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <View style={[styles.settingItem, pressed && styles.pressed]}>
                      <View style={styles.settingIconContainer}>
                        <Ionicons name="document-text-outline" size={22} color="#FFFFFF" />
                      </View>
                      <View style={styles.settingContent}>
                        <Text style={styles.settingTitle}>Terms of Service</Text>
                        <Text style={styles.settingSubtitle}>Legal terms for using SmartSoil</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color="#888888" />
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
  headerTitle: {
    fontSize: 22,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
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
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  settingSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  settingValue: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginRight: 4,
  },
}); 