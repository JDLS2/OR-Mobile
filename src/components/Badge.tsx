import React from 'react';
import {View, Text, StyleSheet, ViewStyle, TextStyle} from 'react-native';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Badge({
  children,
  variant = 'default',
  style,
  textStyle,
}: BadgeProps) {
  const variantStyles = getVariantStyles(variant);

  return (
    <View style={[styles.badge, variantStyles.container, style]}>
      <Text style={[styles.text, variantStyles.text, textStyle]}>
        {children}
      </Text>
    </View>
  );
}

const getVariantStyles = (variant: BadgeVariant) => {
  switch (variant) {
    case 'secondary':
      return {
        container: {backgroundColor: '#27272a'},
        text: {color: '#a1a1aa'},
      };
    case 'destructive':
      return {
        container: {backgroundColor: '#7f1d1d'},
        text: {color: '#fecaca'},
      };
    case 'outline':
      return {
        container: {backgroundColor: 'transparent', borderWidth: 1, borderColor: '#3f3f46'},
        text: {color: '#a1a1aa'},
      };
    case 'success':
      return {
        container: {backgroundColor: '#14532d'},
        text: {color: '#86efac'},
      };
    case 'info':
      return {
        container: {backgroundColor: '#1e3a8a'},
        text: {color: '#93c5fd'},
      };
    case 'default':
    default:
      return {
        container: {backgroundColor: '#7c3aed'},
        text: {color: '#ffffff'},
      };
  }
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
});
