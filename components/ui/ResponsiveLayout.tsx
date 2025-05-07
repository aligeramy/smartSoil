import React, { useEffect, useState } from 'react';
import { Dimensions, ScaledSize, StyleSheet, View } from 'react-native';

// Define breakpoints for different screen sizes
export const BREAKPOINTS = {
  phone: 0,
  tablet: 768,
  desktop: 1024,
};

type ScreenSize = 'phone' | 'tablet' | 'desktop';

// Create a context to share screen size information throughout the app
export const ScreenSizeContext = React.createContext<{
  screenSize: ScreenSize;
  width: number;
  height: number;
  isLargeScreen: boolean;
}>({
  screenSize: 'phone',
  width: 0,
  height: 0,
  isLargeScreen: false,
});

// Custom hook to access screen size information
export const useScreenSize = () => React.useContext(ScreenSizeContext);

// Determine the current screen size based on width
const getScreenSize = (width: number): ScreenSize => {
  if (width >= BREAKPOINTS.desktop) return 'desktop';
  if (width >= BREAKPOINTS.tablet) return 'tablet';
  return 'phone';
};

// Provider component that tracks screen dimensions
export const ResponsiveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dimensions, setDimensions] = useState<{
    window: ScaledSize;
    screen: ScaledSize;
  }>({
    window: Dimensions.get('window'),
    screen: Dimensions.get('screen'),
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window, screen }) => {
      setDimensions({ window, screen });
    });

    return () => {
      // Clean up subscription
      if (subscription?.remove) {
        subscription.remove();
      }
    };
  }, []);

  const { width, height } = dimensions.window;
  const screenSize = getScreenSize(width);
  const isLargeScreen = screenSize !== 'phone';

  return (
    <ScreenSizeContext.Provider
      value={{
        screenSize,
        width,
        height,
        isLargeScreen,
      }}
    >
      {children}
    </ScreenSizeContext.Provider>
  );
};

// Component that applies different layouts based on screen size
interface ResponsiveLayoutProps {
  children: React.ReactNode;
  mobileStyle?: any;
  tabletStyle?: any;
  desktopStyle?: any;
  style?: any;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  mobileStyle,
  tabletStyle,
  desktopStyle,
  style,
}) => {
  const { screenSize } = useScreenSize();

  let responsiveStyle = mobileStyle;
  if (screenSize === 'tablet' && tabletStyle) {
    responsiveStyle = tabletStyle;
  } else if (screenSize === 'desktop' && desktopStyle) {
    responsiveStyle = desktopStyle;
  }

  return (
    <View style={[styles.container, style, responsiveStyle]}>
      {children}
    </View>
  );
};

// Grid layout component for responsive designs
interface GridContainerProps {
  children: React.ReactNode;
  spacing?: number;
  style?: any;
}

export const GridContainer: React.FC<GridContainerProps> = ({
  children,
  spacing = 16,
  style,
}) => {
  const { screenSize } = useScreenSize();
  const isLargeScreen = screenSize !== 'phone';

  return (
    <View
      style={[
        styles.gridContainer,
        {
          marginHorizontal: -spacing / 2,
          flexDirection: isLargeScreen ? 'row' : 'column',
        },
        style,
      ]}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;
        return React.cloneElement(child as React.ReactElement<any>, {
          style: [
            { margin: spacing / 2 },
            (child as React.ReactElement<any>).props.style,
          ],
        });
      })}
    </View>
  );
};

// Grid item component
interface GridItemProps {
  children: React.ReactNode;
  xs?: number; // 1-12 for phone
  sm?: number; // 1-12 for tablet
  md?: number; // 1-12 for desktop
  style?: any;
}

export const GridItem: React.FC<GridItemProps> = ({
  children,
  xs = 12,
  sm,
  md,
  style,
}) => {
  const { screenSize } = useScreenSize();
  
  let size = xs;
  if (screenSize === 'tablet' && sm !== undefined) {
    size = sm;
  } else if (screenSize === 'desktop' && md !== undefined) {
    size = md;
  }

  // For mobile, always take full width
  const width = screenSize === 'phone' ? '100%' : `${(size / 12) * 100}%`;

  return (
    <View
      style={[
        {
          width,
          maxWidth: '100%',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  gridContainer: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    width: '100%',
  },
});

// Scale fonts based on screen size
export const scaleFontSize = (size: number): number => {
  const { screenSize } = useScreenSize();
  
  // Scale up font size on larger screens
  if (screenSize === 'desktop') {
    return size * 1.15;
  } else if (screenSize === 'tablet') {
    return size * 1.1;
  }
  
  return size;
}; 