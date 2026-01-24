import React, {useState, useCallback} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import {api} from '../api/api';
import {MangaCard, LoadingSpinner, EmptyState, ScreenHeader} from '../components';
import {MangaWithProgress} from '../types';

type RootStackParamList = {
  MangaDetails: {mangaId: string};
};

export function DashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [recentManga, setRecentManga] = useState<MangaWithProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadRecentManga = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    }
    const {data, error} = await api.getRecentManga();

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error loading manga',
        text2: error,
      });
    } else if (data) {
      setRecentManga(data);
    }

    setIsLoading(false);
    setIsRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRecentManga();
    }, [loadRecentManga]),
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadRecentManga(false);
  };

  const handleMangaPress = (mangaId: string) => {
    navigation.navigate('MangaDetails', {mangaId});
  };

  const handleMerge = (mangaProgress: any) => {
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
            const {data, error} = await api.requestMediaMerge(mangaProgress.id);

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
                text2: data.message || 'Merge request successful',
              });
              loadRecentManga(false);
            }
          },
        },
      ],
    );
  };

  const renderItem = ({item}: {item: MangaWithProgress}) => {
    const {manga, mangaProgress} = item;
    return (
      <MangaCard
        id={manga.id}
        title={manga.title}
        coverImage={manga.coverImage || manga.imageUrl}
        chaptersRead={mangaProgress.chapterNumber}
        lastRead={mangaProgress.lastUpdatedAt}
        status={manga.status}
        type={manga.type}
        showMergeButton={true}
        onPress={() => handleMangaPress(manga.id)}
        onMerge={() => handleMerge(mangaProgress)}
      />
    );
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Recent Manga"
        subtitle="Continue where you left off"
        icon="H"
      />

      {recentManga.length === 0 ? (
        <EmptyState
          title="No recent manga"
          message="Start reading to see your recent manga here"
        />
      ) : (
        <FlatList
          data={recentManga}
          renderItem={renderItem}
          keyExtractor={item => item.manga.id}
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
});
