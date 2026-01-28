import React, {useState, useCallback} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
  TextInput,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import {api} from '../api/api';
import {MediaCard, LoadingSpinner, EmptyState, ScreenHeader} from '../components';
import {MediaWithProgressDto, MediaProgressId, MediaProgressDto} from '../types';

type RootStackParamList = {
  MediaDetails: {mediaId: string};
};

export function DashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [recentMedia, setRecentMedia] = useState<MediaWithProgressDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMedia = recentMedia.filter(item =>
    item.media?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const loadRecentMedia = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    }
    const {data, error} = await api.getRecentMedia();

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error loading media',
        text2: error,
      });
    } else if (data) {
      setRecentMedia(data);
    }

    setIsLoading(false);
    setIsRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRecentMedia();
    }, [loadRecentMedia]),
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadRecentMedia(false);
  };

  const handleMediaPress = (mediaId: string) => {
    navigation.navigate('MediaDetails', {mediaId});
  };

  const handleMerge = (mediaProgress: MediaProgressDto) => {
    Alert.alert(
      'Merge Media',
      'What this will do: detect if there\'s another media you are reading that matches this. If we detect it, we will combine those two media. All chapters will then be tracked under 1 Media.\n\nContinue?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            const mediaProgressId: MediaProgressId = {
              userId: mediaProgress.userId,
              recentChapterUrl: mediaProgress.recentChapterUrl,
            };
            const {data, error} = await api.requestMediaMerge(mediaProgressId);

            if (error) {
              Toast.show({
                type: 'error',
                text1: 'Merge Request Failed',
                text2: error,
              });
            } else if (data) {
              Toast.show({
                type: 'success',
                text1: 'Merge Request Submitted',
                text2: data.body || 'Merge request successful',
              });
              loadRecentMedia(false);
            }
          },
        },
      ],
    );
  };

  const renderItem = ({item}: {item: MediaWithProgressDto}) => {
    const {media, mediaProgress} = item;
    return (
      <MediaCard
        id={String(media?.id)}
        title={media?.title || ''}
        imageUrl={media?.imageUrl}
        chaptersRead={mediaProgress?.chapterNumber}
        lastRead={mediaProgress?.lastUpdatedAt?.toISOString?.() || (mediaProgress?.lastUpdatedAt as unknown as string)}
        status={media?.status}
        type={media?.type}
        showMergeButton={true}
        onPress={() => handleMediaPress(String(media?.id))}
        onMerge={() => handleMerge(mediaProgress)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Recent Media"
        subtitle="Continue where you left off"
        icon="H"
      />

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search media..."
          placeholderTextColor="#71717a"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <LoadingSpinner />
        </View>
      ) : recentMedia.length === 0 ? (
        <EmptyState
          title="No recent media"
          message="Start reading to see your recent media here"
        />
      ) : filteredMedia.length === 0 ? (
        <EmptyState
          title="No results found"
          message={`No media matching "${searchQuery}"`}
        />
      ) : (
        <FlatList
          data={filteredMedia}
          renderItem={renderItem}
          keyExtractor={item => String(item.media?.id)}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#7c3aed"
              colors={['#7c3aed']}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#27272a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
});
