import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

function Journey() {
  return (
    <View style={styles.container}>
      <Text>Journey screen!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Journey;
