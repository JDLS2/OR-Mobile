import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation, DrawerActions} from '@react-navigation/native';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  icon: string;
}

export function ScreenHeader({title, subtitle, icon}: ScreenHeaderProps) {
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.menuButton} onPress={openDrawer}>
        <View style={styles.menuLine} />
        <View style={styles.menuLine} />
        <View style={styles.menuLine} />
      </TouchableOpacity>

      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
    gap: 12,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#27272a',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  menuLine: {
    width: 18,
    height: 2,
    backgroundColor: '#ffffff',
    borderRadius: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 14,
    color: '#71717a',
  },
});
