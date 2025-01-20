import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {PieChart} from 'react-native-chart-kit';
import {colors} from '../../Global_CSS/TheamColors';

const AnalyticPage = () => {
  const data = [
    {
      name: 'Shortlisted',
      count: 942,
      percentage: 25,
      color: '#1f3b6f',
      legendFontColor: '#000',
      legendFontSize: 12,
    },
    {
      name: 'Hired',
      count: 25,
      percentage: 10,
      color: '#66cc99',
      legendFontColor: '#000',
      legendFontSize: 12,
    },
    {
      name: 'Rejected',
      count: 2452,
      percentage: 74,
      color: '#f67262',
      legendFontColor: '#000',
      legendFontSize: 12,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Application Response</Text>
        <TouchableOpacity>
          <Text style={styles.downloadReport}>Download Report</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.chartContainer}>
        <PieChart
          data={data}
          width={320}
          height={220}
          chartConfig={{
            backgroundColor: colors.background,
            backgroundGradientFrom: colors.background,
            backgroundGradientTo: colors.background,
            color: (opacity = 1) => `rgba(76, 119, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="percentage"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute // Display percentage values inside the chart
        />
      </View>
      {/* <View style={styles.labelsContainer}>
        <View style={styles.labelItem}>
          <View style={[styles.dot, {backgroundColor: '#1f3b6f'}]} />
          <Text style={styles.labelText}>Shortlisted</Text>
          <Text style={styles.valueText}>942</Text>
          <Text style={styles.percentageChange}>+2.5%</Text>
        </View>
        <View style={styles.labelItem}>
          <View style={[styles.dot, {backgroundColor: '#f67262'}]} />
          <Text style={styles.labelText}>Hired</Text>
          <Text style={styles.valueText}>25</Text>
          <Text style={styles.percentageChange}>+0.4%</Text>
        </View>
        <View style={styles.labelItem}>
          <View style={[styles.dot, {backgroundColor: '#aec4da'}]} />
          <Text style={styles.labelText}>Rejected</Text>
          <Text style={styles.valueText}>2,452</Text>
          <Text style={styles.percentageChange}>-0.5%</Text>
        </View>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    width: '100%',
  },
  headerContainer: {
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  downloadReport: {
    fontSize: 12,
    color: '#f67262',
  },
  labelsContainer: {
    alignItems: 'center',
  },
  labelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  labelText: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  valueText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
    marginRight: 8,
  },
  percentageChange: {
    fontSize: 12,
    color: '#000',
  },
  chartContainer: {
    alignItems: 'center',
  },
});

export default AnalyticPage;
