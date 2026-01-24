import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import Toast from 'react-native-toast-message';
import {api} from '../api/api';
import {Badge, LoadingSpinner} from '../components';
import {AnalyticsPeriod, MediaProgressStatus, UserProgressAnalytics} from '../types';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const PERIODS = [
  {label: 'Day', value: AnalyticsPeriod.DAY},
  {label: 'Week', value: AnalyticsPeriod.WEEK},
  {label: 'Month', value: AnalyticsPeriod.MONTH},
  {label: 'Year', value: AnalyticsPeriod.YEAR},
];

interface StatusAggregate {
  status: MediaProgressStatus;
  total: number;
}

export function AnalyticsScreen() {
  const [analyticsData, setAnalyticsData] = useState<UserProgressAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<AnalyticsPeriod>(AnalyticsPeriod.DAY);

  useEffect(() => {
    loadAnalytics(selectedPeriod);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAnalytics = async (period: AnalyticsPeriod) => {
    setIsLoading(true);
    const {data, error} = await api.getProgressAnalytics(period);

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error loading analytics',
        text2: error,
      });
      setAnalyticsData([]);
    } else if (data) {
      setAnalyticsData(data);
    }

    setIsLoading(false);
  };

  const handlePeriodChange = (period: AnalyticsPeriod) => {
    setSelectedPeriod(period);
    loadAnalytics(period);
  };

  const aggregateByStatus = (): StatusAggregate[] => {
    const statusCounts: Record<MediaProgressStatus, number> = {
      [MediaProgressStatus.Read]: 0,
      [MediaProgressStatus.ReRead]: 0,
      [MediaProgressStatus.InProgress]: 0,
    };

    analyticsData.forEach(item => {
      if (statusCounts[item.status] !== undefined) {
        statusCounts[item.status] += item.dailyResult;
      }
    });

    return Object.entries(statusCounts).map(([status, total]) => ({
      status: status as MediaProgressStatus,
      total,
    }));
  };

  const getPeriodLabel = (period: AnalyticsPeriod): string => {
    switch (period) {
      case AnalyticsPeriod.DAY:
        return 'day';
      case AnalyticsPeriod.WEEK:
        return 'week';
      case AnalyticsPeriod.MONTH:
        return 'month';
      case AnalyticsPeriod.YEAR:
        return 'year';
      default:
        return 'day';
    }
  };

  const getChartData = () => {
    // Group data by date
    const dateMap: Record<string, Record<MediaProgressStatus, number>> = {};

    analyticsData.forEach(item => {
      const dateStr = new Date(item.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      if (!dateMap[dateStr]) {
        dateMap[dateStr] = {
          [MediaProgressStatus.Read]: 0,
          [MediaProgressStatus.ReRead]: 0,
          [MediaProgressStatus.InProgress]: 0,
        };
      }
      dateMap[dateStr][item.status] = item.dailyResult;
    });

    const labels = Object.keys(dateMap);
    const readData = labels.map(date => dateMap[date][MediaProgressStatus.Read] || 0);
    const rereadData = labels.map(date => dateMap[date][MediaProgressStatus.ReRead] || 0);
    const inProgressData = labels.map(date => dateMap[date][MediaProgressStatus.InProgress] || 0);

    // If no data, return placeholder
    if (labels.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [
          {data: [0], color: () => '#22c55e', strokeWidth: 2},
        ],
        legend: ['Read'],
      };
    }

    return {
      labels: labels.slice(-7), // Show last 7 data points max
      datasets: [
        {
          data: readData.slice(-7),
          color: () => '#22c55e',
          strokeWidth: 2,
        },
        {
          data: rereadData.slice(-7),
          color: () => '#ffffff',
          strokeWidth: 2,
        },
        {
          data: inProgressData.slice(-7),
          color: () => '#ef4444',
          strokeWidth: 2,
        },
      ],
      legend: ['Read', 'Re-Read', 'In Progress'],
    };
  };

  const aggregatedData = aggregateByStatus();
  const chartData = getChartData();

  const getStatusBadgeVariant = (status: MediaProgressStatus) => {
    switch (status) {
      case MediaProgressStatus.Read:
        return 'success';
      case MediaProgressStatus.ReRead:
        return 'secondary';
      case MediaProgressStatus.InProgress:
        return 'info';
      default:
        return 'secondary';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>A</Text>
        </View>
        <View>
          <Text style={styles.title}>My Analytics</Text>
          <Text style={styles.subtitle}>Track your reading progress</Text>
        </View>
      </View>

      <View style={styles.periodContainer}>
        {PERIODS.map(period => (
          <TouchableOpacity
            key={period.value}
            style={[
              styles.periodButton,
              selectedPeriod === period.value && styles.periodButtonActive,
            ]}
            onPress={() => handlePeriodChange(period.value)}>
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === period.value && styles.periodButtonTextActive,
              ]}>
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Analytics over the last {getPeriodLabel(selectedPeriod)}
        </Text>

        {isLoading ? (
          <LoadingSpinner text="Waiting for Results" />
        ) : (
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Status</Text>
              <Text style={styles.tableHeaderText}>Total</Text>
            </View>
            {aggregatedData.map(item => (
              <View key={item.status} style={styles.tableRow}>
                <Badge variant={getStatusBadgeVariant(item.status)}>
                  {item.status}
                </Badge>
                <Text style={styles.totalText}>{item.total}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {!isLoading && analyticsData.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Progress Over Time</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <LineChart
              data={chartData}
              width={Math.max(SCREEN_WIDTH - 64, chartData.labels.length * 50)}
              height={220}
              chartConfig={{
                backgroundColor: '#1a1a1a',
                backgroundGradientFrom: '#1a1a1a',
                backgroundGradientTo: '#1a1a1a',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(113, 113, 122, ${opacity})`,
                style: {
                  borderRadius: 8,
                },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                },
                propsForBackgroundLines: {
                  stroke: '#27272a',
                },
              }}
              bezier
              style={styles.chart}
              withInnerLines={true}
              withOuterLines={false}
              withShadow={false}
            />
          </ScrollView>
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, {backgroundColor: '#22c55e'}]} />
              <Text style={styles.legendText}>Read</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, {backgroundColor: '#ffffff'}]} />
              <Text style={styles.legendText}>Re-Read</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, {backgroundColor: '#ef4444'}]} />
              <Text style={styles.legendText}>In Progress</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.spacer} />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 14,
    color: '#71717a',
  },
  periodContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#27272a',
  },
  periodButtonActive: {
    backgroundColor: '#7c3aed',
  },
  periodButtonText: {
    color: '#71717a',
    fontSize: 14,
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: '#ffffff',
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  tableContainer: {
    gap: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#71717a',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  chart: {
    borderRadius: 8,
    marginVertical: 8,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#71717a',
  },
  spacer: {
    height: 100,
  },
});
