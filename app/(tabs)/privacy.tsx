import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.lastUpdated}>Last Updated: June 15, 2024</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.paragraph}>
            At SmartSoil, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
            and safeguard your information when you use our mobile application.
          </Text>
          <Text style={styles.paragraph}>
            Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, 
            please do not access the application.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Information We Collect</Text>
          
          <Text style={styles.subSectionTitle}>2.1 Sensor Data</Text>
          <Text style={styles.paragraph}>
            Our application collects data from your connected ESP8266 soil moisture sensor, including soil moisture levels, 
            temperature, and humidity. This data is stored locally on your device and is not transmitted to our servers.
          </Text>
          
          <Text style={styles.subSectionTitle}>2.2 Device Information</Text>
          <Text style={styles.paragraph}>
            When you use our mobile application, we may collect device information such as your mobile device ID, 
            model and manufacturer, operating system, and version information. This information is used solely for 
            app functionality and troubleshooting.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            The information we collect is used to:
          </Text>
          <Text style={styles.bulletPoint}>• Provide, operate, and maintain our application</Text>
          <Text style={styles.bulletPoint}>• Display sensor data within the application</Text>
          <Text style={styles.bulletPoint}>• Improve, personalize, and expand our application</Text>
          <Text style={styles.bulletPoint}>• Understand and analyze how you use our application</Text>
          <Text style={styles.bulletPoint}>• Develop new products, services, features, and functionality</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Disclosure of Your Information</Text>
          <Text style={styles.paragraph}>
            We do not sell, trade, rent, or otherwise transfer your personal information to third parties. 
            We may disclose information in the following situations:
          </Text>
          <Text style={styles.bulletPoint}>• With your consent</Text>
          <Text style={styles.bulletPoint}>• To comply with legal obligations</Text>
          <Text style={styles.bulletPoint}>• To protect and defend our rights and property</Text>
          <Text style={styles.bulletPoint}>• To prevent or investigate possible wrongdoing in connection with the application</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Data Retention</Text>
          <Text style={styles.paragraph}>
            SmartSoil will retain your data locally on your device until you choose to delete the application or clear its data. 
            Since we do not collect data on our servers, no server-side data retention policies apply.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Your Data Protection Rights</Text>
          <Text style={styles.paragraph}>
            Under the General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA), 
            you have certain data protection rights. Since all data is stored locally on your device, you have complete control
            over your data. You can:
          </Text>
          <Text style={styles.bulletPoint}>• Access your data (it is visible in the application)</Text>
          <Text style={styles.bulletPoint}>• Delete your data by clearing app data or uninstalling the application</Text>
          <Text style={styles.bulletPoint}>• Control how your data is used within the app settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
          <Text style={styles.paragraph}>
            The SmartSoil application is not intended for children under 13 years of age. We do not knowingly collect 
            personal information from children under 13. If you are a parent or guardian and you are aware that your child 
            has provided us with personal information, please contact us.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Changes to This Privacy Policy</Text>
          <Text style={styles.paragraph}>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
            Privacy Policy on this page and updating the "Last Updated" date.
          </Text>
          <Text style={styles.paragraph}>
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy 
            are effective when they are posted on this page.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about this Privacy Policy, please contact us at:
          </Text>
          <Text style={styles.contactInfo}>Email: privacy@smartsoil-app.com</Text>
          <Text style={styles.contactInfo}>Website: https://www.smartsoil-app.com/privacy</Text>
          <Text style={styles.contactInfo}>Address: 123 Green Street, Tech City, CA 94043, USA</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#063B1D',
  },
  lastUpdated: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#063B1D',
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 12,
    color: '#194838',
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    marginBottom: 8,
    marginLeft: 10,
  },
  contactInfo: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    marginBottom: 4,
    fontWeight: '500',
  },
}); 