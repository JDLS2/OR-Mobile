import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  RefreshControl,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {api} from '../api/api';
import {Badge, LoadingSpinner, EmptyState, ScreenHeader} from '../components';
import {useAuth} from '../contexts/AuthContext';
import type {UserNotificationDto} from '../../generated-types/models/UserNotificationDto';
import {
  UserNotificationDtoStatusEnum,
  UserNotificationDtoResultEnum,
  UserNotificationDtoTypeEnum,
} from '../../generated-types/models/UserNotificationDto';

const NotificationTypeLabels: Record<string, string> = {
  [UserNotificationDtoTypeEnum.ProgressUploadSuccess]: 'Progress Upload Success',
  [UserNotificationDtoTypeEnum.ProgressUploadFailure]: 'Progress Upload Failure',
};

export function NotificationsScreen() {
  const [notifications, setNotifications] = useState<UserNotificationDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {markNotificationAsRead} = useAuth();

  const loadNotifications = useCallback(
    async (showLoading = true) => {
      if (showLoading) {
        setIsLoading(true);
      }
      const {data, error} = await api.getNotifications();

      if (error) {
        Toast.show({
          type: 'error',
          text1: 'Error loading notifications',
          text2: error,
        });
      } else if (data?.notifications) {
        const items = data.notifications;
        setNotifications(items);

        // Mark all UNREAD notifications as READ via WebSocket
        items.forEach(n => {
          if (
            n.status === UserNotificationDtoStatusEnum.Unread &&
            n.id != null
          ) {
            markNotificationAsRead(n.id);
          }
        });

        // Update local state so they appear under "Seen Notifications"
        setNotifications(
          items.map(n =>
            n.status === UserNotificationDtoStatusEnum.Unread
              ? {...n, status: UserNotificationDtoStatusEnum.Read}
              : n,
          ),
        );
      }

      setIsLoading(false);
      setIsRefreshing(false);
    },
    [markNotificationAsRead],
  );

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [loadNotifications]),
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadNotifications(false);
  };

  const getResultVariant = (result?: string) => {
    switch (result) {
      case UserNotificationDtoResultEnum.Success:
        return 'success';
      case UserNotificationDtoResultEnum.Failure:
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const unread = notifications.filter(
    n => n.status === UserNotificationDtoStatusEnum.Unread,
  );
  const read = notifications.filter(
    n => n.status === UserNotificationDtoStatusEnum.Read,
  );

  const sections = [
    ...(unread.length > 0
      ? [{title: 'New Notifications', data: unread}]
      : []),
    ...(read.length > 0
      ? [{title: 'Seen Notifications', data: read}]
      : []),
  ];

  const renderNotificationItem = ({item}: {item: UserNotificationDto}) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationMessage}>
          {item.message || 'Notification'}
        </Text>
        <View style={styles.notificationMeta}>
          {item.type && (
            <Badge variant="info">
              {NotificationTypeLabels[item.type] ?? item.type}
            </Badge>
          )}
          {item.result && (
            <Badge variant={getResultVariant(item.result)}>
              {item.result}
            </Badge>
          )}
        </View>
        {item.createdAt && (
          <Text style={styles.notificationDate}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        )}
      </View>
    </View>
  );

  const renderSectionHeader = ({
    section,
  }: {
    section: {title: string};
  }) => <Text style={styles.sectionHeader}>{section.title}</Text>;

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Notifications"
        subtitle="View your notifications"
        icon="N"
      />

      <View style={styles.card}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <LoadingSpinner />
          </View>
        ) : notifications.length === 0 ? (
          <EmptyState
            title="No Notifications"
            message="You don't have any notifications yet."
          />
        ) : (
          <SectionList
            sections={sections}
            renderItem={renderNotificationItem}
            renderSectionHeader={renderSectionHeader}
            keyExtractor={(item, index) =>
              item.id?.toString() || index.toString()
            }
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
            stickySectionHeadersEnabled={false}
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
  card: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 100,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#a1a1aa',
    marginBottom: 12,
    marginTop: 8,
  },
  notificationItem: {
    padding: 12,
    backgroundColor: '#27272a',
    borderRadius: 8,
  },
  notificationContent: {
    gap: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
  },
  notificationMeta: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  notificationDate: {
    fontSize: 12,
    color: '#71717a',
  },
  separator: {
    height: 8,
  },
});
