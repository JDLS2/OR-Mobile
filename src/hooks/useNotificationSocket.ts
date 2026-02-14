import {useEffect, useRef, useCallback} from 'react';
import {Platform} from 'react-native';
import Toast from 'react-native-toast-message';
import {storage} from '../utils/storage';
import {UserNotificationDtoResultEnum} from '../../generated-types/models/UserNotificationDto';
import type {UserNotificationDto} from '../../generated-types/models/UserNotificationDto';
import {
  WebSocketResponseFromJSON,
  WebSocketResponseResponseTypeEnum,
} from '../../generated-types/models/WebSocketResponse';
import {
  WebSocketRequestToJSON,
  WebSocketRequestRequestTypeEnum,
} from '../../generated-types/models/WebSocketRequest';
import {NotificationPayloadNotificationStatusEnum} from '../../generated-types/models/NotificationPayload';
import {UserNotificationDtoTypeEnum} from '../../generated-types/models/UserNotificationDto';

const NotificationTypeLabels: Record<string, string> = {
  [UserNotificationDtoTypeEnum.ProgressUploadSuccess]: 'Progress Upload Success',
  [UserNotificationDtoTypeEnum.ProgressUploadFailure]: 'Progress Upload Failure',
};

const getWsBaseUrl = () => {
  if (__DEV__) {
    return Platform.OS === 'android'
      ? 'ws://192.168.1.247:8080'
      : 'ws://192.168.1.247:8080';
  }
  return 'ws://192.168.1.247:8080';
};

const WS_BASE_URL = getWsBaseUrl();

export function useNotificationSocket(isAuthenticated: boolean) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const baseReconnectDelay = 1000;

  const markAsRead = useCallback((notificationId: number) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      storage.getToken().then(token => {
        const updatePayload = JSON.stringify(
          WebSocketRequestToJSON({
            requestType: WebSocketRequestRequestTypeEnum.Update,
            token: token || undefined,
            payload: {
              userNotificationID: notificationId,
              notificationStatus:
                NotificationPayloadNotificationStatusEnum.Read,
            },
          }),
        );
        console.log('[WS] Sending UPDATE (READ ack):', updatePayload);
        wsRef.current?.send(updatePayload);
      });
    } else {
      console.warn(
        '[WS] Cannot send READ ack — WebSocket not open, readyState:',
        wsRef.current?.readyState,
      );
    }
  }, []);

  const handleNotification = useCallback(
    (notification: UserNotificationDto) => {
      const message = notification.message || 'Notification';
      const header = notification.type
        ? NotificationTypeLabels[notification.type] ?? 'Notification'
        : 'Notification';

      if (notification.result === UserNotificationDtoResultEnum.Success) {
        Toast.show({
          type: 'notificationSuccess',
          text1: header,
          text2: message,
          autoHide: true,
          visibilityTime: 6000,
        });
      } else {
        Toast.show({
          type: 'notificationError',
          text1: header,
          text2: message,
          autoHide: true,
          visibilityTime: 6000,
        });
      }

      // Send acknowledgement back with status set to READ
      if (notification.id != null) {
        markAsRead(notification.id);
      }
    },
    [markAsRead],
  );

  const connect = useCallback(() => {
    if (!isAuthenticated) {
      return;
    }

    storage.getToken().then(token => {
      if (!token) {
        return;
      }

      // Close existing connection if any
      if (wsRef.current) {
        wsRef.current.close();
      }

      // Create WebSocket connection
      const wsUrl = `${WS_BASE_URL}/ws/notifications`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('Notification WebSocket connected');
        reconnectAttemptsRef.current = 0;

        // Register with the server by sending the auth token
        const registerPayload = JSON.stringify(
          WebSocketRequestToJSON({
            requestType: WebSocketRequestRequestTypeEnum.Register,
            token,
          }),
        );
        console.log('[WS] Sending REGISTER:', registerPayload);
        ws.send(registerPayload);
      };

      ws.onmessage = (event: WebSocketMessageEvent) => {
        console.log('[WS] Received message:', event.data);
        try {
          const data = JSON.parse(event.data);
          const response = WebSocketResponseFromJSON(data);

          if (
            response.responseType ===
              WebSocketResponseResponseTypeEnum.Notification &&
            response.payload
          ) {
            handleNotification(response.payload);
          }
        } catch {
          // If it's not valid JSON, show as a plain info toast
          Toast.show({
            type: 'info',
            text1: 'Notification',
            text2: String(event.data),
          });
        }
      };

      ws.onerror = (error: Event) => {
        console.warn('Notification WebSocket error:', error);
      };

      ws.onclose = (event: WebSocketCloseEvent) => {
        console.log(
          'Notification WebSocket closed:',
          event.code,
          event.reason,
        );
        wsRef.current = null;

        // Attempt to reconnect if still authenticated and not a normal closure
        if (
          isAuthenticated &&
          event.code !== 1000 &&
          reconnectAttemptsRef.current < maxReconnectAttempts
        ) {
          const delay =
            baseReconnectDelay *
            Math.pow(2, reconnectAttemptsRef.current);
          reconnectAttemptsRef.current++;

          console.log(
            `Attempting to reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`,
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        }
      };

      wsRef.current = ws;
    });
  }, [isAuthenticated, handleNotification]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, 'User logged out');
      wsRef.current = null;
    }

    reconnectAttemptsRef.current = 0;
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isAuthenticated, connect, disconnect]);

  return {
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
    markAsRead,
  };
}
