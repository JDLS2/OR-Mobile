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
  Modal,
} from 'react-native';
import {useRoute, useNavigation, RouteProp, CommonActions} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {api} from '../api/api';
import {Badge, LoadingSpinner, EmptyState} from '../components';
import {MediaWithProgressesAndSitesDto, MediaProgressDto, MediaSiteWithMediaUrlDto} from '../types';

type RouteParams = {
  MediaDetails: {mediaId: string};
};

type NavigationProp = {
  dispatch: (action: any) => void;
  goBack: () => void;
};

export function MediaDetailsScreen() {
  const route = useRoute<RouteProp<RouteParams, 'MediaDetails'>>();
  const navigation = useNavigation<NavigationProp>();
  const {mediaId} = route.params;

  const [mediaDetails, setMediaDetails] = useState<MediaWithProgressesAndSitesDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showOpenUrlModal, setShowOpenUrlModal] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  useEffect(() => {
    loadMediaDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaId]);

  const loadMediaDetails = async () => {
    setIsLoading(true);
    const {data, error} = await api.getMediaDetails(mediaId);

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error loading media',
        text2: error,
      });
      navigation.goBack();
    } else if (data) {
      setMediaDetails(data);
    }

    setIsLoading(false);
  };

  const handleOpenSourceWebsite = () => {
    if (!mediaDetails?.mediaSitesWithUrls?.length) return;
    setShowSourceModal(true);
  };

  const handleSiteSelect = (site: MediaSiteWithMediaUrlDto) => {
    if (site.baseUrl) {
      setPendingUrl(site.baseUrl);
      setShowSourceModal(false);
      setShowOpenUrlModal(true);
    }
  };

  const handleUrlSelect = (url: string) => {
    setPendingUrl(url);
    setShowOpenUrlModal(true);
  };

  const handleOpenInBrowser = () => {
    if (pendingUrl) {
      Linking.openURL(pendingUrl);
    }
    setShowOpenUrlModal(false);
    setPendingUrl(null);
  };

  const handleOpenInApp = () => {
    if (pendingUrl) {
      // Navigate to ReadInApp screen with the URL
      navigation.dispatch(
        CommonActions.navigate({
          name: 'Main',
          params: {
            screen: 'ReadInApp',
            params: {url: pendingUrl},
          },
        })
      );
    }
    setShowOpenUrlModal(false);
    setPendingUrl(null);
  };

  const handleCancelOpenUrl = () => {
    setShowOpenUrlModal(false);
    setPendingUrl(null);
  };

  const handleCloseSourceModal = () => {
    setShowSourceModal(false);
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
            const {data, error, statusCode} = await api.deleteTrackedMedia(mediaId);

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
    handleUrlSelect(url);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'READ':
        return 'success';
      case 'RE_READ':
      case 'RE-READ':
        return 'secondary';
      case 'IN_PROGRESS':
      case 'IN PROGRESS':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const renderChapterItem = ({item}: {item: MediaProgressDto}) => (
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

  const media = mediaDetails?.media;
  const mediaProgresses = mediaDetails?.mediaProgresses;
  const mediaSitesWithUrls = mediaDetails?.mediaSitesWithUrls;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {media?.title || 'Loading...'}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <LoadingSpinner />
        </View>
      ) : !mediaDetails ? (
        <View style={styles.loadingContainer}>
          <EmptyState
            title="Media Not Found"
            message="Unable to load media details."
          />
        </View>
      ) : (
        <View style={styles.content}>
        <View style={styles.mediaInfoCard}>
          <View style={styles.coverContainer}>
            {media?.imageUrl ? (
              <Image
                source={{uri: media.imageUrl}}
                style={styles.coverImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderCover}>
                <Text style={styles.placeholderText}>No Image</Text>
              </View>
            )}
          </View>

          <View style={styles.mediaInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.mediaTitle}>{media?.title}</Text>
              {media?.type && (
                <Badge variant="outline">{media.type}</Badge>
              )}
            </View>

            {media?.description && (
              <View style={styles.descriptionSection}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{media.description}</Text>
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

          {!mediaProgresses || mediaProgresses.length === 0 ? (
            <EmptyState
              title="No Chapters Read"
              message="You haven't tracked any chapters for this media yet."
            />
          ) : (
            <FlatList
              data={mediaProgresses}
              renderItem={renderChapterItem}
              keyExtractor={(item, index) => `${item.mediaId}-${item.chapterNumber}-${index}`}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}
        </View>
      </View>
      )}

      <Modal
        visible={showSourceModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseSourceModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>View on Source Website</Text>
            <Text style={styles.modalSubtitle}>Select a website to open</Text>
            <View style={styles.dropdownContainer}>
              {mediaSitesWithUrls?.map((site, index) => (
                <TouchableOpacity
                  key={site.mediaSite?.id || index}
                  style={styles.dropdownItem}
                  onPress={() => handleSiteSelect(site)}>
                  <Text style={styles.dropdownItemText}>
                    {site.mediaSite?.siteName}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={handleCloseSourceModal}>
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showOpenUrlModal}
        transparent
        animationType="fade"
        onRequestClose={handleCancelOpenUrl}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Open URL</Text>
            <Text style={styles.modalMessage}>
              Open this in-app, or in browser?
            </Text>
            <View style={styles.openUrlButtonsContainer}>
              <TouchableOpacity
                style={styles.openUrlButton}
                onPress={handleOpenInApp}>
                <Text style={styles.openUrlButtonText}>Open In-App</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.openUrlButton}
                onPress={handleOpenInBrowser}>
                <Text style={styles.openUrlButtonText}>Open In Browser</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelUrlButton}
                onPress={handleCancelOpenUrl}>
                <Text style={styles.cancelUrlButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  loadingContainer: {
    flex: 1,
    paddingVertical: 100,
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  mediaInfoCard: {
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
  mediaInfo: {},
  titleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  mediaTitle: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#71717a',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalMessage: {
    fontSize: 14,
    color: '#a1a1aa',
    textAlign: 'center',
    marginBottom: 20,
  },
  dropdownContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  dropdownItem: {
    backgroundColor: '#27272a',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3f3f46',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#ffffff',
  },
  modalCancelButton: {
    backgroundColor: '#27272a',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#a1a1aa',
  },
  openUrlButtonsContainer: {
    gap: 10,
  },
  openUrlButton: {
    backgroundColor: '#7c3aed',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  openUrlButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  cancelUrlButton: {
    backgroundColor: '#27272a',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelUrlButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#a1a1aa',
  },
});
