import Colors, { Colors as ColorPalette } from '@/constants/Colors';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, Platform, Pressable, SafeAreaView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Ken Burns effect removed

  const handleGetStarted = () => {
    router.push("../tutorial/intro");
  };

  return (
    <View style={styles.container}>
      {!imageLoaded && (
        <View style={[styles.loadingContainer, { backgroundColor: '#063B1D' }]}>
          <ActivityIndicator size="large" color={ColorPalette.white} />
        </View>
      )}
      
      <ImageBackground 
        source={require('@/assets/sections/onboarding/background.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
        onLoadEnd={() => setImageLoaded(true)}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.contentContainer}>
            <Animated.View 
              entering={FadeIn.delay(200).springify()} 
              style={styles.logoContainer}
            >
              <Image 
                source={require('@/assets/images/logo/logo-w.png')} 
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.companyText}>BY SOFTX INNOVATIONS INC</Text>
            </Animated.View>

            <Animated.View 
              entering={FadeInDown.delay(400).springify()} 
              style={styles.textContainer}
            >
              <Text style={styles.title}>Plant Smarter</Text>
              <Text style={styles.subtitle}>
                Data-driven insights for your plants.
              </Text>
            </Animated.View>

            <Animated.View 
              entering={FadeInUp.delay(600).springify()} 
              style={styles.buttonContainer}
            >
              <Pressable 
                style={styles.button}
                android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
                onPress={handleGetStarted}
              >
                <Text style={styles.buttonText}>Get Started</Text>
              </Pressable>
              
              <Pressable 
                style={styles.loginContainer}
                onPress={() => router.push("/dashboard")}
              >
                <Text style={styles.loginText}>Skip to <Text style={styles.loginTextBold}>Dashboard</Text></Text>
              </Pressable>
            </Animated.View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#063B1D', // Same green as in app.json
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    overflow: 'hidden', // Ensures the scaled image doesn't overflow its container
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingTop: Platform.OS === 'android' ? 45 : 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    width: 280,
    height: 100,
  },
  companyText: {
    color: ColorPalette.white,
    fontSize: 12,
    letterSpacing: 2,
    marginTop: 10,
    opacity: 0.9,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: ColorPalette.white,
    textAlign: 'center',
    marginBottom: 0,

  },
  subtitle: {
    fontSize: 17,
    lineHeight: 26,
    color: ColorPalette.white,
    textAlign: 'center',
    opacity: 0.9,
    maxWidth: '90%',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 50,
  },
  button: {
    backgroundColor: 'rgba(35, 197, 82, 0.95)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 300,
  },
  buttonText: {
    color: ColorPalette.white,
    fontSize: 22,
  },
  loginContainer: {
    marginTop: 16,
    padding: 5,
  },
  loginText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  loginTextBold: {
    fontWeight: 'bold',
    color: ColorPalette.white,
  },
});
