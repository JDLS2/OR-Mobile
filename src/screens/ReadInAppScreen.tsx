import React, {useState, useRef, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import {WebView} from 'react-native-webview';
import type {WebViewNavigation} from 'react-native-webview';
import {useFocusEffect, useRoute, RouteProp} from '@react-navigation/native';
import {api} from '../api/api';
import {ScreenHeader} from '../components';

type ReadInAppRouteParams = {
  ReadInApp: {url?: string} | undefined;
};

export function ReadInAppScreen() {
  const route = useRoute<RouteProp<ReadInAppRouteParams, 'ReadInApp'>>();
  const urlParam = route.params?.url;
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const webViewRef = useRef<WebView>(null);
  const submittedUrls = useRef<Set<string>>(new Set());

  useFocusEffect(
    useCallback(() => {
      if (!hasConsented) {
        setShowConsentModal(true);
      }
    }, [hasConsented])
  );

  // Handle URL parameter when navigated from MediaDetailsScreen
  useEffect(() => {
    if (urlParam && hasConsented) {
      let url = urlParam;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      setCurrentUrl(url);
    }
  }, [urlParam, hasConsented]);

  const handleConsent = () => {
    setShowConsentModal(false);
    setHasConsented(true);
    // If a URL was passed as parameter, load it after consent
    if (urlParam) {
      let url = urlParam;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      setCurrentUrl(url);
    }
  };

  const handleDecline = () => {
    setShowConsentModal(false);
    setHasConsented(false);
  };

  const handleNavigationStateChange = async (navState: WebViewNavigation) => {
    const url = navState.url;
    setCurrentUrl(url);

    // Only submit if this is a real URL and we haven't submitted it yet
    if (url && url.startsWith('http') && !submittedUrls.current.has(url)) {
      submittedUrls.current.add(url);
      try {
        await api.submitUrl(url);
      } catch (error) {
        // Silently fail - we don't want to interrupt the user's browsing
        console.log('Failed to submit URL:', error);
      }
    }
  };

  const handleGoToUrl = () => {
    if (inputUrl.trim()) {
      let url = inputUrl.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      setCurrentUrl(url);
      setInputUrl('');
    }
  };

  const handleGoBack = () => {
    webViewRef.current?.goBack();
  };

  const handleGoForward = () => {
    webViewRef.current?.goForward();
  };

  const handleRefresh = () => {
    webViewRef.current?.reload();
  };

  if (!hasConsented) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Read In App" />
        <View style={styles.notConsentedContainer}>
          <Text style={styles.notConsentedText}>
            Tap the button below to start reading in the app.
          </Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => setShowConsentModal(true)}>
            <Text style={styles.startButtonText}>Start Reading</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={showConsentModal}
          transparent
          animationType="fade"
          onRequestClose={handleDecline}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Read In App</Text>
              <Text style={styles.modalMessage}>
                This will open up a web view within the app. We will see all URLs
                you visit, and automatically track all media related visits where
                possible. Continue?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButtonNo}
                  onPress={handleDecline}>
                  <Text style={styles.modalButtonNoText}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButtonYes}
                  onPress={handleConsent}>
                  <Text style={styles.modalButtonYesText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Read In App" />

      <View style={styles.urlBar}>
        <TextInput
          style={styles.urlInput}
          value={inputUrl}
          onChangeText={setInputUrl}
          placeholder="Enter URL..."
          placeholderTextColor="#71717a"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          onSubmitEditing={handleGoToUrl}
        />
        <TouchableOpacity style={styles.goButton} onPress={handleGoToUrl}>
          <Text style={styles.goButtonText}>Go</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navigationBar}>
        <TouchableOpacity style={styles.navButton} onPress={handleGoBack}>
          <Text style={styles.navButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleGoForward}>
          <Text style={styles.navButtonText}>Forward</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleRefresh}>
          <Text style={styles.navButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {currentUrl ? (
        <WebView
          ref={webViewRef}
          source={{uri: currentUrl}}
          style={styles.webView}
          onNavigationStateChange={handleNavigationStateChange}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No URL loaded</Text>
          <Text style={styles.emptyStateMessage}>
            Enter a URL above to start browsing and tracking your reading progress.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  notConsentedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notConsentedText: {
    fontSize: 16,
    color: '#a1a1aa',
    textAlign: 'center',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#7c3aed',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  urlBar: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  urlInput: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#27272a',
  },
  goButton: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
  },
  goButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  navigationBar: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  navButton: {
    backgroundColor: '#27272a',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  navButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#a1a1aa',
  },
  webView: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 14,
    color: '#71717a',
    textAlign: 'center',
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
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 14,
    color: '#a1a1aa',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButtonNo: {
    flex: 1,
    backgroundColor: '#27272a',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalButtonNoText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#a1a1aa',
  },
  modalButtonYes: {
    flex: 1,
    backgroundColor: '#7c3aed',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalButtonYesText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
});
