import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  Linking,
  ActionSheetIOS,
  Platform,
} from 'react-native';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {api} from '../api/api';
import {Badge, LoadingSpinner, EmptyState} from '../components';
import {MangaDetails, MangaProgress} from '../types';

type RouteParams = {
  MangaDetails: {mangaId: string};
};

export function MangaDetailsScreen() {
  const route = useRoute<RouteProp<RouteParams, 'MangaDetails'>>();
  const navigation = useNavigation();
  const {mangaId} = route.params;

  const [mangaDetails, setMangaDetails] = useState<MangaDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadMangaDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mangaId]);

  const loadMangaDetails = async () => {
    setIsLoading(true);
    const {data, error} = await api.getMangaChapters(mangaId);

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error loading manga',
        text2: error,
      });
      navigation.goBack();
    } else if (data) {
      setMangaDetails(data);
    }

    setIsLoading(false);
  };

  const handleOpenSourceWebsite = () => {
    if (!mangaDetails?.mediaSitesWithUrls?.length) return;

    const sites = mangaDetails.mediaSitesWithUrls;

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', ...sites.map(s => s.mediaSite.siteName)],
          cancelButtonIndex: 0,
        },
        buttonIndex => {
          if (buttonIndex > 0) {
            Linking.openURL(sites[buttonIndex - 1].baseUrl);
          }
        },
      );
    } else {
      Alert.alert(
        'Open Source Website',
        'Choose a website to open',
        [
          ...sites.map(site => ({
            text: site.mediaSite.siteName,
            onPress: () => Linking.openURL(site.baseUrl),
          })),
          {text: 'Cancel', style: 'cancel'},
        ],
      );
    }
  };

  const handleDeleteTracking = () => {
    Alert.alert(
      'Stop Tracking This Media',
      'By continuing, you will permanently remove all of your progress tied to this media. Do you want to continue?',
      [
        {
          text: 'No, keep tracking',
          style: 'cancel',
        },
        {
          text: 'Yes, delete my tracking',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            const {data, error, statusCode} = await api.deleteTrackedMedia(mangaId);

            if (error || !statusCode || statusCode < 200 || statusCode >= 300) {
              Toast.show({
                type: 'error',
                text1: 'Deletion Failed',
                text2: error || 'Failed to delete tracking',
              });
            } else {
              Toast.show({
                type: 'success',
                text1: 'Tracking Deleted',
                text2: data?.message || 'Successfully removed all progress tracking',
              });
              navigation.goBack();
            }

            setIsDeleting(false);
          },
        },
      ],
    );
  };

  const handleOpenChapter = (url: string) => {
    Linking.openURL(url);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'READ':
        return 'success';
      case 'RE_READ':
        return 'secondary';
      case 'IN_PROGRESS':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const renderChapterItem = ({item}: {item: MangaProgress}) => (
    <TouchableOpacity
      style={styles.chapterItem}
      onPress={() => item.recentChapterUrl && handleOpenChapter(item.recentChapterUrl)}
      disabled={!item.recentChapterUrl}>
      <View style={styles.chapterInfo}>
        <Text style={[styles.chapterNumber, item.recentChapterUrl && styles.chapterLink]}>
          Chapter {item.chapterNumber}
          {item.recentChapterUrl && ' '}
        </Text>
        {item.lastUpdatedAt && (
          <Text style={styles.chapterDate}>
            Last updated: {new Date(item.lastUpdatedAt).toLocaleDateString()}
          </Text>
        )}
      </View>
      <View style={styles.chapterActions}>
        <Badge variant={getStatusBadgeVariant(item.status || 'READ')}>
          {item.status || 'Read'}
        </Badge>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!mangaDetails) {
    return null;
  }

  const {manga, mangaProgresses, mediaSitesWithUrls} = mangaDetails;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {manga.title}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.mangaInfoCard}>
          <View style={styles.coverContainer}>
            {manga.coverImage || manga.imageUrl ? (
              <Image
                source={{uri: manga.coverImage || manga.imageUrl}}
                style={styles.coverImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderCover}>
                <Text style={styles.placeholderText}>No Image</Text>
              </View>
            )}
          </View>

          <View style={styles.mangaInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.mangaTitle}>{manga.title}</Text>
              {manga.type && (
                <Badge variant="outline">{manga.type}</Badge>
              )}
            </View>

            {manga.description && (
              <View style={styles.descriptionSection}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{manga.description}</Text>
              </View>
            )}

            {mediaSitesWithUrls && mediaSitesWithUrls.length > 0 && (
              <TouchableOpacity
                style={styles.sourceButton}
                onPress={handleOpenSourceWebsite}>
                <Text style={styles.sourceButtonText}>
                  View on Source Website
                </Text>
              </TouchableOpacity>
            )}

            {manga.genres && manga.genres.length > 0 && (
              <View style={styles.genresContainer}>
                {manga.genres.map((genre: string) => (
                  <Badge key={genre} variant="outline" style={styles.genreBadge}>
                    {genre}
                  </Badge>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.chaptersCard}>
          <View style={styles.chaptersHeader}>
            <Text style={styles.chaptersTitle}>Chapters Read</Text>
            <TouchableOpacity
              style={[styles.deleteButton, isDeleting && styles.buttonDisabled]}
              onPress={handleDeleteTracking}
              disabled={isDeleting}>
              <Text style={styles.deleteButtonText}>
                {isDeleting ? 'Deleting...' : 'Stop Tracking'}
              </Text>
            </TouchableOpacity>
          </View>

          {!mangaProgresses || mangaProgresses.length === 0 ? (
            <EmptyState
              title="No Chapters Read"
              message="You haven't tracked any chapters for this manga yet."
            />
          ) : (
            <FlatList
              data={mangaProgresses}
              renderItem={renderChapterItem}
              keyExtractor={(item, index) => item.id || index.toString()}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#27272a',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  content: {
    padding: 16,
  },
  mangaInfoCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  coverContainer: {
    aspectRatio: 3 / 4,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#27272a',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  placeholderCover: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#71717a',
  },
  mangaInfo: {},
  titleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  mangaTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },
  descriptionSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#71717a',
    lineHeight: 20,
  },
  sourceButton: {
    backgroundColor: '#27272a',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  sourceButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreBadge: {
    marginBottom: 4,
  },
  chaptersCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 100,
  },
  chaptersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chaptersTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  deleteButton: {
    backgroundColor: '#7f1d1d',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  deleteButtonText: {
    color: '#fecaca',
    fontSize: 12,
    fontWeight: '500',
  },
  chapterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#27272a',
    borderRadius: 8,
  },
  chapterInfo: {
    flex: 1,
  },
  chapterNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  chapterLink: {
    color: '#7c3aed',
  },
  chapterDate: {
    fontSize: 12,
    color: '#71717a',
    marginTop: 4,
  },
  chapterActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  separator: {
    height: 8,
  },
});
