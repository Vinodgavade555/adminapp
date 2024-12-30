import React from 'react';
import {View, Text, StyleSheet, ScrollView, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const HeroScroll = () => {
  const data = [
    {
      title: 'Total Openings by Country',
      value: '1,234',
      description: 'Jobs available worldwide',
    },
    {
      title: 'Total Hired by Platform',
      value: '567,890',
      description: 'Candidates hired successfully',
    },
    {
      title: 'Total Applications',
      value: '3,456,789',
      description: 'Applications submitted',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        // pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}>
        {data.map((item, index) => (
          <View key={index} style={[styles.card]}>
            <LinearGradient start={{x: 1, y: 0}} end={{x: 1, y: 2}}
              colors={['#0088cc', '#006699', '#004466']}
              style={styles.linearGradient}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.value}>{item.value}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </LinearGradient>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  scrollView: {
    flexGrow: 0,
  },
  card: {
    flex: 1,
    width: '100%', // Adjust width based on your needs
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden', // Ensures gradient doesn't overflow
  },
  linearGradient: {
    padding: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#fff',
  },
  value: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  description: {
    fontSize: 14,
    marginTop: 10,
    color: '#f0f0f0',
    textAlign: 'center',
  },
});

export default HeroScroll;
