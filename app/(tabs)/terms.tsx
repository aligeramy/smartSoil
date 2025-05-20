import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TermsScreen() {
  const handleBack = () => {
    router.push('/settings');
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
            <Pressable
              onPress={handleBack}
              style={({ pressed }) => [
                styles.backButton,
                pressed && { opacity: 0.7 }
              ]}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </Pressable>
            <Text style={styles.headerTitle}>Terms of Service</Text>
          </View>

          <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
            <Text style={styles.lastUpdated}>Last Updated: June 15, 2024</Text>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. Agreement to Terms</Text>
              <Text style={styles.paragraph}>
                These Terms of Service constitute a legally binding agreement made between you and SmartSoil
                concerning your access to and use of the SmartSoil mobile application.
              </Text>
              <Text style={styles.paragraph}>
                By downloading, accessing, or using our application, you agree to be bound by these Terms.
                If you disagree with any part of these terms, you may not access the application.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. Intellectual Property Rights</Text>
              <Text style={styles.paragraph}>
                The Application, including but not limited to text, graphics, logos, icons, images, audio clips, 
                digital downloads, data compilations, and software, is the property of SmartSoil or its content suppliers
                and protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </Text>
              <Text style={styles.paragraph}>
                Our trademarks and trade dress may not be used in connection with any product or service without the prior 
                written consent of SmartSoil.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>3. User Responsibilities</Text>
              <Text style={styles.paragraph}>
                When using our Application, you agree not to:
              </Text>
              <Text style={styles.bulletPoint}>• Use the Application in any way that violates any applicable laws</Text>
              <Text style={styles.bulletPoint}>• Attempt to interfere with the proper working of the Application</Text>
              <Text style={styles.bulletPoint}>• Engage in any data mining or similar data gathering activity</Text>
              <Text style={styles.bulletPoint}>• Attempt to decipher, decompile, disassemble, or reverse engineer any of the software</Text>
              <Text style={styles.bulletPoint}>• Circumvent, disable, or interfere with security-related features of the Application</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>4. ESP8266 Hardware Usage</Text>
              <Text style={styles.paragraph}>
                The SmartSoil application is designed to work with ESP8266-based soil moisture sensors. You are responsible for:
              </Text>
              <Text style={styles.bulletPoint}>• Properly setting up and maintaining your hardware</Text>
              <Text style={styles.bulletPoint}>• Ensuring safe placement and operation of all electronic components</Text>
              <Text style={styles.bulletPoint}>• Following all safety guidelines for electronic devices</Text>
              <Text style={styles.bulletPoint}>• Any damage that may occur to plants, property, or persons from improper hardware usage</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>5. Application Updates</Text>
              <Text style={styles.paragraph}>
                SmartSoil may from time to time provide enhancements or improvements to the features/functionality of the 
                Application, which may include patches, bug fixes, updates, upgrades and other modifications.
              </Text>
              <Text style={styles.paragraph}>
                Updates may modify or delete certain features and/or functionalities of the Application. You agree that 
                SmartSoil has no obligation to provide any Updates or to continue to provide or enable any particular 
                features and/or functionalities of the Application.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>6. Data Accuracy and Plant Health</Text>
              <Text style={styles.paragraph}>
                While SmartSoil strives to provide accurate soil moisture and environmental readings, the application is 
                provided "as is" without warranties of any kind. SmartSoil is not responsible for:
              </Text>
              <Text style={styles.bulletPoint}>• Inaccurate sensor readings</Text>
              <Text style={styles.bulletPoint}>• Plant health issues that may arise despite using the application</Text>
              <Text style={styles.bulletPoint}>• Crop or plant loss due to inappropriate watering despite application recommendations</Text>
              <Text style={styles.paragraph}>
                Users should always use their best judgment when caring for plants and not rely solely on sensor data.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
              <Text style={styles.paragraph}>
                In no event shall SmartSoil, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, 
                loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </Text>
              <Text style={styles.bulletPoint}>• Your access to or use of or inability to access or use the Application</Text>
              <Text style={styles.bulletPoint}>• Any conduct or content of any third party on the Application</Text>
              <Text style={styles.bulletPoint}>• Any content obtained from the Application</Text>
              <Text style={styles.bulletPoint}>• Unauthorized access, use or alteration of your transmissions or content</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>8. Termination</Text>
              <Text style={styles.paragraph}>
                We may terminate or suspend your access to the Application immediately, without prior notice or liability, 
                for any reason whatsoever, including without limitation if you breach the Terms.
              </Text>
              <Text style={styles.paragraph}>
                All provisions of the Terms which by their nature should survive termination shall survive termination, 
                including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>9. Changes to Terms</Text>
              <Text style={styles.paragraph}>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is 
                material we will try to provide at least 30 days' notice prior to any new terms taking effect.
              </Text>
              <Text style={styles.paragraph}>
                By continuing to access or use our Application after those revisions become effective, you agree to be bound 
                by the revised terms. If you do not agree to the new terms, please stop using the Application.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>10. Governing Law</Text>
              <Text style={styles.paragraph}>
                These Terms shall be governed and construed in accordance with the laws of California, United States, 
                without regard to its conflict of law provisions.
              </Text>
              <Text style={styles.paragraph}>
                Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. 
                If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions 
                of these Terms will remain in effect.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>11. Contact Us</Text>
              <Text style={styles.paragraph}>
                If you have any questions about these Terms, please contact us at:
              </Text>
              <Text style={styles.contactInfo}>Email: terms@smartsoil-app.com</Text>
              <Text style={styles.contactInfo}>Website: https://www.smartsoil-app.com/terms</Text>
              <Text style={styles.contactInfo}>Address: 123 Green Street, Tech City, CA 94043, USA</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: Platform.OS === 'android' ? 45 : 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  lastUpdated: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#FFFFFF',
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
    marginLeft: 10,
  },
  contactInfo: {
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
    fontWeight: '500',
  },
}); 