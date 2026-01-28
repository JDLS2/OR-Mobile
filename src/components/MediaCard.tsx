import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Badge} from './Badge';

const {width} = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding
const CARD_IMAGE_HEIGHT = (CARD_WIDTH * 4) / 3; // 3:4 aspect ratio

interface MediaCardProps {
  id: string;
  title: string;
  imageUrl?: string;
  chaptersRead?: string | number;
  lastRead?: string;
  status?: string;
  type?: string;
  onPress: () => void;
  onMerge?: () => void;
  showMergeButton?: boolean;
}

export function MediaCard({
  title,
  imageUrl,
  chaptersRead,
  lastRead,
  status = 'Reading',
  type,
  onPress,
  onMerge,
  showMergeButton = false,
}: MediaCardProps) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return '';
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image
            source={{uri: imageUrl}}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>
              {type?.toUpperCase() || 'MEDIA'}
            </Text>
          </View>
        )}
        <View style={styles.badgeContainer}>
          <Badge variant="secondary">{status}</Badge>
          {showMergeButton && (
            <TouchableOpacity
              onPress={e => {
                e.stopPropagation?.();
                onMerge?.();
              }}
              style={styles.mergeButton}>
              <Badge variant="info">MERGE</Badge>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.chapterText}>
          {chaptersRead != null
            ? `Latest: Ch. ${chaptersRead}`
            : 'No chapters read'}
        </Text>
        {lastRead && (
          <Text style={styles.dateText}>{formatDate(lastRead)}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  imageContainer: {
    width: '100%',
    height: CARD_IMAGE_HEIGHT,
    backgroundColor: '#27272a',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  placeholderText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 4,
  },
  mergeButton: {
    marginLeft: 4,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chapterText: {
    fontSize: 12,
    color: '#71717a',
    flex: 1,
  },
  dateText: {
    fontSize: 10,
    color: '#71717a',
  },
});
