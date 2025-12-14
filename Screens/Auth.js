import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import PagerView from 'react-native-pager-view';

import Login from './Login';
import Register from './Register';

const Auth = () => {
  const [page, setPage] = useState(0); // 0 = Sign Up, 1 = Sign In

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Indicator bars */}
      <View style={styles.indicatorContainer}>
        <View style={[styles.bar, page === 0 && styles.activeBar]} />
        <View style={[styles.bar, page === 1 && styles.activeBar]} />
      </View>

      {/* Swipeable Pager */}
      <PagerView
        style={styles.pager}
        initialPage={0}
        onPageSelected={(e) => setPage(e.nativeEvent.position)}
      >
        <View key="1" style={styles.page}>
          <Register />
        </View>
        <View key="2" style={styles.page}>
          <Login />
        </View>
      </PagerView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
    gap: 8,
  },
  bar: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#d3d3d3', // inactive gray
  },
  activeBar: {
    backgroundColor: 'dodgerblue', // active one
  },
  pager: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
});

export default Auth;
