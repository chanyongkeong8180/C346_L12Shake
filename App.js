import { useState, useEffect } from 'react';
import { View, Text, StyleSheet,  } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Audio } from 'expo-av';

export default function App() {
  const [{x, y, z}, setData] = useState({x: 0, y: 0, z: 0});
  const [shake, setShake] = useState();
  const [text, setText] = useState(false);

  let threshold = 2;
  let acceleration = (x ** 2 + y ** 2 + z ** 2) ** 0.5;

  async function playShake() {
     const file = require('./shake.wav');
     const {sound} = await Audio.Sound.createAsync(file);
     setShake(sound);
     setText(true);
     sound.setOnPlaybackStatusUpdate((status) => {
       if (status.didJustFinish) {
         setText(false);
       }
     });
     await sound.playAsync();
  }

  useEffect(() => {
    return shake ? () => {
      console.log('Unloading Sound');
      shake.unloadAsync();
    }
    : undefined;
  }, [shake]);

  useEffect(() => {
    {acceleration > threshold && playShake()}
  }, [acceleration]);

  useEffect(() => {
    Accelerometer.setUpdateInterval(100);
    const subscription = Accelerometer.addListener(setData);
    return () =>
      subscription.remove();
  }, []);
  return (
    <View style={[styles.container,
                  {backgroundColor: text === true ?
                  "lime" : "red"}]}>
      <Text style={styles.text}>{text === true && "SHAKE"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 100,
  },
});
