import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import BottomSheet, {BottomSheetBackgroundProps} from '@gorhom/bottom-sheet';
import {BASE_IMAGE_URL} from '@env';
import {Image, Pressable, Text, View, StyleSheet} from 'react-native';
import {SpeciesDetailsType} from '../../types';
import {useAppSelector} from '../../redux/utils/hooks';

import _speciesDetails from '../../data/speciesDetails.json';

const speciesDetails = _speciesDetails as SpeciesDetailsType;

type TreeDetailDrawerBackgroundProps = {
  defaultProps: BottomSheetBackgroundProps;
};

function TreeDetailDrawerBackground({
  defaultProps,
}: TreeDetailDrawerBackgroundProps) {
  const treeDetailData = useAppSelector(state => state.treeDetail.data);

  return (
    treeDetailData && (
      <View style={[defaultProps.style, styles.drawerBackground]}>
        <Image
          style={[styles.treePhoto]}
          source={{
            uri: BASE_IMAGE_URL + treeDetailData.spc_latin + '.jpg',
          }}
        />
      </View>
    )
  );
}

function TreeDetailDrawer() {
  const [allowTouch, setAllowTouch] = useState(false);
  const treeDetailData = useAppSelector(state => state.treeDetail.data);
  const ref = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => {
    if (treeDetailData?.status === 'Alive') {
      return [140, '75%'];
    }
    return [140, 141];
  }, [treeDetailData]);

  const overrideStyles = useMemo(
    () => styler(allowTouch, treeDetailData?.status === 'Dead'),
    [allowTouch, treeDetailData],
  );

  const BackgroundComponent = useCallback(
    (props: BottomSheetBackgroundProps) => (
      <TreeDetailDrawerBackground defaultProps={props} />
    ),
    [],
  );

  const handleSheetChanges = useCallback((index: number) => {
    setAllowTouch(index === 1);
  }, []);

  const handleInnerPress = useCallback(() => {
    if (!allowTouch) {
      ref.current?.snapToIndex(1);
    }
  }, [allowTouch]);

  const handleOuterPress = useCallback(() => {
    ref.current?.snapToIndex(0);
  }, []);

  const titleName = useMemo(() => {
    if (treeDetailData) {
      const latinName = treeDetailData.spc_latin;

      if (!latinName) {
        if (treeDetailData.status !== 'Alive') {
          return treeDetailData.status;
        } else {
          return 'Unknown';
        }
      }

      return latinName;
    }

    return '';
  }, [treeDetailData]);

  const commonNames = useMemo(() => {
    if (treeDetailData) {
      const speciesDetail = speciesDetails[treeDetailData.spc_latin];

      if (speciesDetail) {
        return speciesDetail.commonNames;
      }
    }

    return '';
  }, [treeDetailData]);

  useEffect(() => {
    if (treeDetailData) {
      if (treeDetailData.status === 'Alive') {
        ref.current?.snapToIndex(1);
      } else {
        ref.current?.snapToIndex(0);
      }
    } else {
      ref.current?.close();
    }
  }, [treeDetailData]);

  return (
    <Pressable onPress={handleOuterPress} style={overrideStyles.container}>
      <BottomSheet
        backgroundComponent={BackgroundComponent}
        handleIndicatorStyle={styles.handleIndicator}
        handleStyle={styles.handle}
        index={-1}
        ref={ref}
        onChange={handleSheetChanges}
        snapPoints={snapPoints}>
        <Pressable
          onPress={handleInnerPress}
          style={[styles.contentContainer, overrideStyles.contentContainer]}>
          <View style={styles.titleContainer}>
            <Text style={[styles.text, styles.latin]}>{titleName}</Text>
            <Text style={[styles.text, styles.common]}>{commonNames}</Text>
          </View>
        </Pressable>
      </BottomSheet>
    </Pressable>
  );
}

const styler = (allowTouch: boolean, small: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      backgroundColor: 'transparent',
      pointerEvents: allowTouch ? 'auto' : 'box-none',
    },
    contentContainer: {
      height: small ? 140 : '75%',
    },
  });

const styles = StyleSheet.create({
  drawer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  drawerBackground: {
    backgroundColor: 'black',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
  },
  treePhoto: {
    height: '43%',
    opacity: 0.6,
  },
  content: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  text: {
    color: 'white',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
    position: 'relative',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    overflow: 'hidden',
  },
  handle: {
    height: 40,
  },
  handleIndicator: {
    backgroundColor: 'white',
    marginTop: 10,
  },
  titleContainer: {
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
  },
  latin: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  common: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default TreeDetailDrawer;
