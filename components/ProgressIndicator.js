// components/ProgressIndicator.js
import React from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const ProgressIndicator = ({ currentPage, totalPages, scrollX }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalPages }).map((_, index) => {
        const inputRange = [
          (index - 1) * screenWidth,
          index * screenWidth,
          (index + 1) * screenWidth,
        ];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 24, 8],
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                width: dotWidth,
                opacity,
              },
              index === currentPage && styles.activeDot,
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: 'white',
    gap: 8,
  },
  dot: {
    height: 8,
    backgroundColor: '#cbd5e1',
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: '#667eea',
  },
});

export default ProgressIndicator;