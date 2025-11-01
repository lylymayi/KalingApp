import React, {useRef, useState} from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';

export default function HelpButton({ onSOS = () => {} }) {
  const timeoutRef = useRef(null);
  const [countdown, setCountdown] = useState(null);
  const anim = useRef(new Animated.Value(1)).current;

  const startPress = () => {
    let sec = 3;
    setCountdown(sec);
    timeoutRef.current = setInterval(() => {
      sec -= 1;
      setCountdown(sec > 0 ? sec : 0);
      if (sec <= 0) {
        clearInterval(timeoutRef.current);
        setCountdown(null);
        Animated.sequence([
          Animated.timing(anim, { toValue: 1.2, duration: 100, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 1, duration: 100, useNativeDriver: true })
        ]).start();
        onSOS();
      }
    }, 1000);
  };

  const endPress = () => {
    clearInterval(timeoutRef.current);
    setCountdown(null);
  };

  return (
    <View style={{alignItems:'center'}}>
      <Pressable onPressIn={startPress} onPressOut={endPress}>
        <Animated.View style={[styles.button, { transform: [{ scale: anim } ] }]}>
          <Text style={styles.text}>HELP SOS</Text>
        </Animated.View>
      </Pressable>
      {countdown !== null && <Text style={{marginTop:8}}>Hold for {countdown}s</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  button:{width:160,height:160,borderRadius:80,backgroundColor:'#E53935',alignItems:'center',justifyContent:'center',elevation:4},
  text:{color:'#fff',fontWeight:'700',fontSize:18}
});