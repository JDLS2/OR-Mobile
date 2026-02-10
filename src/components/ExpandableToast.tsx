import React, {useState} from 'react';
import {Text, TouchableOpacity, StyleSheet, View} from 'react-native';
import type {BaseToastProps} from 'react-native-toast-message';

interface ExpandableToastProps extends BaseToastProps {
  accentColor: string;
}

function ExpandableToastInner({text1, text2, accentColor}: ExpandableToastProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => setExpanded(prev => !prev)}
      style={[styles.container, {borderLeftColor: accentColor}]}>
      {text1 ? <Text style={styles.title}>{text1}</Text> : null}
      {text2 ? (
        <Text
          style={styles.message}
          numberOfLines={expanded ? undefined : 2}>
          {text2}
        </Text>
      ) : null}
      {text2 && !expanded ? (
        <View style={styles.hintRow}>
          <Text style={styles.hint}>Tap to expand</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

export function NotificationSuccessToast(props: BaseToastProps) {
  return <ExpandableToastInner {...props} accentColor="#22c55e" />;
}

export function NotificationErrorToast(props: BaseToastProps) {
  return <ExpandableToastInner {...props} accentColor="#ef4444" />;
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderLeftWidth: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  message: {
    color: '#a1a1aa',
    fontSize: 13,
    lineHeight: 18,
  },
  hintRow: {
    marginTop: 4,
  },
  hint: {
    color: '#71717a',
    fontSize: 11,
  },
});
