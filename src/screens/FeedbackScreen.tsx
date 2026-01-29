import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {api} from '../api/api';
import {LoadingSpinner, EmptyState, ScreenHeader} from '../components';
import {AddUserSubmissionRequestSubmissionTypeEnum} from '../../generated-types/models';

interface UserSubmission {
  id: number;
  submissionType: string;
  description: string;
  createdAt?: string;
}

const SUBMISSION_TYPE_OPTIONS = [
  {value: AddUserSubmissionRequestSubmissionTypeEnum.Support, label: 'Support'},
  {value: AddUserSubmissionRequestSubmissionTypeEnum.Bug, label: 'Bug'},
  {value: AddUserSubmissionRequestSubmissionTypeEnum.FeatureRequest, label: 'Feature Request'},
  {value: AddUserSubmissionRequestSubmissionTypeEnum.Review, label: 'Review'},
  {value: AddUserSubmissionRequestSubmissionTypeEnum.Misc, label: 'Misc'},
];

function formatDate(dateString?: string): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

function truncateDescription(description: string, maxLength = 50): string {
  if (!description) return '';
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength) + '...';
}

function formatSubmissionType(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

const separatorStyles = StyleSheet.create({
  separator: {height: 8},
});

function ItemSeparator() {
  return <View style={separatorStyles.separator} />;
}

export function FeedbackScreen() {
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // View submission modal
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<UserSubmission | null>(null);

  // Add submission modal
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newDescription, setNewDescription] = useState('');
  const [newSubmissionType, setNewSubmissionType] = useState<string>(
    AddUserSubmissionRequestSubmissionTypeEnum.FeatureRequest,
  );

  const loadSubmissions = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    }
    const {data, error} = await api.getMyUserSubmissions();

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error loading submissions',
        text2: error,
      });
    } else if (data) {
      setSubmissions(data as UserSubmission[]);
    }

    setIsLoading(false);
    setIsRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSubmissions();
    }, [loadSubmissions]),
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadSubmissions(false);
  };

  const handleViewSubmission = (submission: UserSubmission) => {
    setSelectedSubmission(submission);
    setViewModalVisible(true);
  };

  const handleOpenAddModal = () => {
    setNewDescription('');
    setNewSubmissionType(AddUserSubmissionRequestSubmissionTypeEnum.FeatureRequest);
    setAddModalVisible(true);
  };

  const handleSubmitFeedback = async () => {
    if (!newDescription.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Description required',
        text2: 'Please enter a description for your feedback',
      });
      return;
    }

    setIsSubmitting(true);
    const {data, error, statusCode} = await api.addUserSubmission(
      newSubmissionType,
      newDescription,
    );

    if (error || (statusCode && statusCode !== 200)) {
      Toast.show({
        type: 'error',
        text1: 'Submission failed',
        text2: error || `Request failed with status ${statusCode}`,
      });
    } else {
      Toast.show({
        type: 'success',
        text1: 'Feedback submitted!',
        text2: (data as {message?: string})?.message || 'Your feedback has been received',
      });
      setAddModalVisible(false);
      loadSubmissions(false);
    }

    setIsSubmitting(false);
  };

  const renderSubmissionItem = ({item}: {item: UserSubmission}) => (
    <TouchableOpacity
      style={styles.submissionItem}
      onPress={() => handleViewSubmission(item)}>
      <View style={styles.submissionContent}>
        <View style={styles.submissionHeader}>
          <Text style={styles.submissionType}>
            {formatSubmissionType(item.submissionType)}
          </Text>
          <Text style={styles.submissionDate}>{formatDate(item.createdAt)}</Text>
        </View>
        <Text style={styles.submissionDescription} numberOfLines={2}>
          {truncateDescription(item.description)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Feedback"
        subtitle="View and submit feedback"
        icon="F"
      />

      <View style={styles.addButtonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleOpenAddModal}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>My Submissions</Text>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <LoadingSpinner />
          </View>
        ) : submissions.length === 0 ? (
          <EmptyState
            title="No Submissions Found"
            message="You haven't submitted any feedback yet."
          />
        ) : (
          <FlatList
            data={submissions}
            renderItem={renderSubmissionItem}
            keyExtractor={item => item.id.toString()}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor="#7c3aed"
                colors={['#7c3aed']}
              />
            }
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={ItemSeparator}
          />
        )}
      </View>

      {/* View Submission Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={viewModalVisible}
        onRequestClose={() => setViewModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setViewModalVisible(false)}>
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Submission Details</Text>

              {selectedSubmission && (
                <ScrollView style={styles.modalScrollContent}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Type</Text>
                    <Text style={styles.detailValue}>
                      {formatSubmissionType(selectedSubmission.submissionType)}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Created Date</Text>
                    <Text style={styles.detailValue}>
                      {formatDate(selectedSubmission.createdAt)}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Description</Text>
                    <Text style={styles.detailValueDescription}>
                      {selectedSubmission.description}
                    </Text>
                  </View>
                </ScrollView>
              )}

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setViewModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Add Submission Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={() => setAddModalVisible(false)}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TouchableOpacity
            style={styles.modalOverlayInner}
            activeOpacity={1}
            onPress={() => !isSubmitting && setAddModalVisible(false)}>
            <TouchableOpacity activeOpacity={1} onPress={() => {}}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>New Feedback</Text>

                <ScrollView style={styles.modalScrollContent}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Submission Type</Text>
                    <View style={styles.typeButtonsContainer}>
                      {SUBMISSION_TYPE_OPTIONS.map(option => (
                        <TouchableOpacity
                          key={option.value}
                          style={[
                            styles.typeButton,
                            newSubmissionType === option.value &&
                              styles.typeButtonActive,
                          ]}
                          onPress={() => setNewSubmissionType(option.value)}
                          disabled={isSubmitting}>
                          <Text
                            style={[
                              styles.typeButtonText,
                              newSubmissionType === option.value &&
                                styles.typeButtonTextActive,
                            ]}>
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                      style={styles.textArea}
                      placeholder="Describe your feedback..."
                      placeholderTextColor="#71717a"
                      value={newDescription}
                      onChangeText={setNewDescription}
                      multiline
                      numberOfLines={5}
                      textAlignVertical="top"
                      editable={!isSubmitting}
                    />
                  </View>
                </ScrollView>

                <View style={styles.modalButtonRow}>
                  <TouchableOpacity
                    style={[styles.cancelButton, isSubmitting && styles.buttonDisabled]}
                    onPress={() => setAddModalVisible(false)}
                    disabled={isSubmitting}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.submitButton, isSubmitting && styles.buttonDisabled]}
                    onPress={handleSubmitFeedback}
                    disabled={isSubmitting}>
                    <Text style={styles.submitButtonText}>
                      {isSubmitting ? 'Sending...' : 'Send Feedback'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  addButtonContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
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
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 100,
  },
  submissionItem: {
    padding: 12,
    backgroundColor: '#27272a',
    borderRadius: 8,
  },
  submissionContent: {
    flex: 1,
  },
  submissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  submissionType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7c3aed',
  },
  submissionDate: {
    fontSize: 12,
    color: '#71717a',
  },
  submissionDescription: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlayInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 360,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: '#27272a',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalScrollContent: {
    maxHeight: 400,
  },
  detailRow: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 12,
    color: '#71717a',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 16,
    color: '#ffffff',
  },
  detailValueDescription: {
    fontSize: 14,
    color: '#a1a1aa',
    lineHeight: 20,
  },
  closeButton: {
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#27272a',
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  // Add modal styles
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 8,
  },
  typeButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#27272a',
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  typeButtonActive: {
    backgroundColor: 'rgba(124, 58, 237, 0.3)',
    borderColor: '#7c3aed',
  },
  typeButtonText: {
    fontSize: 13,
    color: '#71717a',
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: '#ffffff',
  },
  textArea: {
    backgroundColor: '#27272a',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#3f3f46',
    minHeight: 120,
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    alignItems: 'center',
    backgroundColor: '#7f1d1d',
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#fecaca',
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    padding: 14,
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
