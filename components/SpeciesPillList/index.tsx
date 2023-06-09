import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SpeciesPill from '../../components/SpeciesPill';
import {
  Animated,
  Pressable,
  PressableStateCallbackType,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {FilterContext} from '../FilterController';
import useAnimation from '../../utils/useAnimation';

type SpeciesPillListProps = {
  remove: Function;
};

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

function SpeciesPillList({remove}: SpeciesPillListProps) {
  const [open, setOpen] = useState(true);
  const {species: selected} = useContext(FilterContext);
  const heightRef = useRef(40);
  const heightValue = useAnimation({immediate: false, from: heightRef.current});
  const spinValue = useAnimation({immediate: false});

  const speciesPills = useMemo(
    () =>
      selected.map(item => (
        <SpeciesPill key={item.id} item={item} remove={remove} />
      )),
    [remove, selected],
  );

  const handlePress = useCallback(() => {
    setOpen(!open);
  }, [open]);

  useEffect(() => {
    Animated.spring(spinValue, {
      toValue: open ? 1 : 0,
      useNativeDriver: true,
      friction: 5,
      overshootClamping: true,
    }).start();
  }, [open, spinValue]);

  useEffect(() => {
    Animated.spring(heightValue, {
      delay: 50,
      toValue: open ? heightRef.current * selected.length : 0,
      useNativeDriver: false,
      overshootClamping: true,
    }).start();
  }, [heightRef, heightValue, open, selected]);

  return (
    <View style={styles.pillList}>
      <Animated.View
        style={[
          styles.collapse,
          {
            height: heightValue,
          },
        ]}>
        {speciesPills}
      </Animated.View>
      {!!selected.length && (
        <Pressable onPress={handlePress} style={stylerPressable}>
          <View style={styles.chevronContainer}>
            <Text style={styles.count}>{`${selected.length} species`}</Text>
            <AnimatedIcon
              style={[
                styles.chevron,
                {
                  transform: [
                    {
                      rotate: spinValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '180deg'],
                      }),
                    },
                  ],
                },
              ]}
              name="expand-more"
            />
          </View>
        </Pressable>
      )}
    </View>
  );
}

const stylerPressable = ({pressed}: PressableStateCallbackType): ViewStyle => ({
  transform: pressed ? [{scale: 0.96}] : [],
});

const styles = StyleSheet.create({
  pillList: {
    display: 'flex',
    flex: 1,
    position: 'absolute',
    top: 60,
    zIndex: 2,
  },
  collapse: {
    overflow: 'hidden',
  },
  count: {
    color: 'black',
    marginLeft: 6,
  },
  chevronContainer: {
    borderWidth: 1,
    borderColor: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 6,
    paddingBottom: 8,
    borderRadius: 50,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginRight: 5,
    marginBottom: 5,
  },
  chevron: {
    color: 'black',
    marginLeft: 10,
    fontSize: 20,
  },
});

export default SpeciesPillList;
