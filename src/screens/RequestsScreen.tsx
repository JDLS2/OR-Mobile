import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Linking,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {api} from '../api/api';
import {Badge, LoadingSpinner, EmptyState} from '../components';
import {MediaProgressRequest} from '../types';

enum RequestViewType {
  Overview = 'Overview',
  Completed = 'Completed',
  Failed = 'Failed',
  FailedUnsupported = 'Failed - UNSUPPORTED',
}

const VIEW_TYPES = [
  RequestViewType.Overview,
  RequestViewType.Completed,
  RequestViewType.Failed,
  RequestViewType.FailedUnsupported,
];

export function RequestsScreen() {
  const [requests, setRequests] = useState<MediaProgressRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [viewType, setViewType] = useState<RequestViewType>(RequestViewType.Overview);

  const loadRequests = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    }
    const {data, error} = await api.getMediaProgressUserRequests();

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error loading requests',
        text2: error,
      });
    } else if (data) {
      setRequests(data);
    }

    setIsLoading(false);
    setIsRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRequests();
    }, [loadRequests]),
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadRequests(false);
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'success';
      case 'pending':
        return 'secondary';
      case 'failed':
      case 'error':
      case 'failed_ineligible':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getFilteredRequests = () => {
    switch (viewType) {
      case RequestViewType.Completed:
        return requests.filter(req => req.status.toUpperCase() === 'COMPLETED');
      case RequestViewType.Failed:
        return requests.filter(req => req.status.toUpperCase() === 'FAILED');
      case RequestViewType.FailedUnsupported:
        return requests.filter(req => req.status.toUpperCase() === 'FAILED_INELIGIBLE');
      case RequestViewType.Overview:
      default:
        return requests;
    }
  };

  const getStatusCounts = () => {
    const counts: Record<string, number> = {};
    requests.forEach(req => {
      const status = req.status.toUpperCase();
      counts[status] = (counts[status] || 0) + 1;
    });
    return Object.entries(counts).map(([status, count]) => ({status, count}));
  };

  const hasFailedRequests = () => {
    return requests.some(req => req.status.toUpperCase() === 'FAILED');
  };

  const handleRetryFailedRequests = async () => {
    setIsRetrying(true);
    const {error} = await api.retryProgressRequests();

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Retry Request Failed',
        text2: error,
      });
    } else {
      Toast.show({
        type: 'success',
        text1: 'Retry Request Submitted!',
      });
      loadRequests(false);
    }

    setIsRetrying(false);
  };

  const renderOverview = () => (
    <View style={styles.overviewContainer}>
      {getStatusCounts().map(({status, count}) => (
        <View key={status} style={styles.statusRow}>
          <Badge variant={getStatusVariant(status)}>{status}</Badge>
          <Text style={styles.countText}>{count}</Text>
        </View>
      ))}
    </View>
  );

  const renderRequestItem = ({item}: {item: MediaProgressRequest}) => (
    <TouchableOpacity
      style={styles.requestItem}
      onPress={() => item.url && Linking.openURL(item.url)}>
      <View style={styles.requestContent}>
        <Text style={styles.requestUrl} numberOfLines={1}>
          {item.url}
        </Text>
        <Text style={styles.requestDate}>
          Submitted: {new Date(item.createdAt).toLocaleString()}
          {item.requestSource && ` | Source: ${item.requestSource}`}
        </Text>
      </View>
      <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
    </TouchableOpacity>
  );

  const filteredRequests = getFilteredRequests();
  const shouldShowRetryButton =
    (viewType === RequestViewType.Overview || viewType === RequestViewType.Failed) &&
    hasFailedRequests();

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>R</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>Media Progress Requests</Text>
          <Text style={styles.subtitle}>Track your submitted URL requests</Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <FlatList
          data={VIEW_TYPES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item}
          contentContainerStyle={styles.filterList}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                viewType === item && styles.filterButtonActive,
              ]}
              onPress={() => setViewType(item)}>
              <Text
                style={[
                  styles.filterButtonText,
                  viewType === item && styles.filterButtonTextActive,
                ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {shouldShowRetryButton && (
        <View style={styles.retryContainer}>
          <TouchableOpacity
            style={[styles.retryButton, isRetrying && styles.buttonDisabled]}
            onPress={handleRetryFailedRequests}
            disabled={isRetrying}>
            <Text style={styles.retryButtonText}>
              {isRetrying ? 'Retrying...' : 'Retry Failed Requests'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Request History</Text>

        {requests.length === 0 ? (
          <EmptyState
            title="No Requests Found"
            message="You haven't submitted any URLs yet."
          />
        ) : viewType === RequestViewType.Overview ? (
          renderOverview()
        ) : filteredRequests.length === 0 ? (
          <EmptyState
            title={`No ${viewType} Requests`}
            message={`No requests with ${viewType.toLowerCase()} status found.`}
          />
        ) : (
          <FlatList
            data={filteredRequests}
            renderItem={renderRequestItem}
            keyExtractor={(item, index) => item.id || index.toString()}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor="#7c3aed"
                colors={['#7c3aed']}
              />
            }
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </View>
    </View>
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
  headerText: {
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
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  filterList: {
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#27272a',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#7c3aed',
  },
  filterButtonText: {
    color: '#71717a',
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  retryContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#27272a',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  card: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  overviewContainer: {
    gap: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#27272a',
    borderRadius: 8,
  },
  countText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  listContent: {
    paddingBottom: 100,
  },
  requestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#27272a',
    borderRadius: 8,
  },
  requestContent: {
    flex: 1,
    marginRight: 12,
  },
  requestUrl: {
    fontSize: 14,
    color: '#7c3aed',
    marginBottom: 4,
  },
  requestDate: {
    fontSize: 12,
    color: '#71717a',
  },
  separator: {
    height: 8,
  },
});
