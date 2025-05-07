import React from 'react';
import { StyleProp, StyleSheet, Text, TextProps, TextStyle } from 'react-native';
import { useScreenSize } from './ResponsiveLayout';

interface ResponsiveTextProps extends TextProps {
  style?: StyleProp<TextStyle>;
  variant?: 'heading1' | 'heading2' | 'heading3' | 'body' | 'caption' | 'label';
  children?: React.ReactNode;
}

// Responsible for scaling text based on screen size
export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  style,
  variant = 'body',
  children,
  ...props
}) => {
  const { screenSize } = useScreenSize();
  
  // Scale factor for different screen sizes
  const getScaleFactor = () => {
    switch (screenSize) {
      case 'desktop': return 1.2;
      case 'tablet': return 1.1;
      case 'phone': default: return 1;
    }
  };
  
  const scaleFactor = getScaleFactor();
  
  // Get the base style for the variant
  const getVariantStyle = (): StyleProp<TextStyle> => {
    const baseSize = styles[variant]?.fontSize || styles.body.fontSize;
    const scaledSize = baseSize * scaleFactor;
    
    return {
      ...styles[variant],
      fontSize: scaledSize,
    };
  };
  
  return (
    <Text style={[getVariantStyle(), style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  heading1: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  heading2: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  heading3: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  body: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  caption: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  label: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
}); 