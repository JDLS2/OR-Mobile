import React from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import Svg, {
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
  Rect,
} from 'react-native-svg';

interface NiRELogoProps {
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

const sizes = {
  small: {
    width: 56,
    height: 56,
    borderRadius: 14,
  },
  medium: {
    width: 64,
    height: 64,
    borderRadius: 16,
  },
  large: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
};

export function NiRELogo({size = 'medium', style}: NiRELogoProps) {
  const sizeConfig = sizes[size];
  const {width, height, borderRadius} = sizeConfig;

  return (
    <View
      style={[
        styles.container,
        {width, height, borderRadius},
        style,
      ]}>
      <Svg width={width * 0.9} height={height * 0.9} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="hyphenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#000000" />
            <Stop offset="100%" stopColor="#EAB308" />
          </LinearGradient>
        </Defs>
        {/* Ni text - right aligned to hyphen */}
        <SvgText
          x="42"
          y="60"
          textAnchor="end"
          fontWeight="bold"
          fontSize="32"
          fill="#000000">
          Ni
        </SvgText>
        {/* Hyphen as a rectangle with gradient */}
        <Rect
          x="43"
          y="45"
          width="14"
          height="5"
          rx="1"
          fill="url(#hyphenGradient)"
        />
        {/* RE text - left aligned from hyphen */}
        <SvgText
          x="58"
          y="60"
          textAnchor="start"
          fontWeight="bold"
          fontSize="32"
          fill="#EAB308">
          RE
        </SvgText>
      </Svg>
    </View>
  );
}

interface NiRETitleProps {
  fontSize?: number;
  style?: ViewStyle;
}

export function NiRETitle({fontSize = 28, style}: NiRETitleProps) {
  const hyphenWidth = fontSize * 0.45;
  const hyphenHeight = fontSize * 0.15;

  return (
    <View style={[styles.titleContainer, style]}>
      <Text style={[styles.titleNi, {fontSize}]}>Ni</Text>
      <Svg width={hyphenWidth} height={fontSize} viewBox="0 0 18 28">
        <Defs>
          <LinearGradient id="titleHyphenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#000000" />
            <Stop offset="100%" stopColor="#EAB308" />
          </LinearGradient>
        </Defs>
        <Rect
          x="1"
          y="11"
          width="16"
          height="5"
          rx="1"
          fill="url(#titleHyphenGradient)"
        />
      </Svg>
      <Text style={[styles.titleRE, {fontSize}]}>RE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleNi: {
    fontWeight: 'bold',
    color: '#000000',
  },
  titleRE: {
    fontWeight: 'bold',
    color: '#EAB308',
  },
});
