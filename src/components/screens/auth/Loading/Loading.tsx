/* eslint-disable react-hooks/exhaustive-deps */
import {View, Text, ScrollView, Image, ActivityIndicator} from 'react-native';
import React, {useEffect} from 'react';
import styles from './styles';
import {StorageGetItem} from '../../../../utils/storage';

export type Props = {
  navigation: any;
};

const Loading: React.FC<Props> = ({navigation}) => {
  const getTokens = async () => {
    const tokens = await StorageGetItem('tokens');
    // console.log({tokens});
    if (tokens) {
      navigation.reset({
        index: 0,
        routes: [{name: 'MainPasscode'}],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    }
  };

  useEffect(() => {
    getTokens();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} bounces={false}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../../../../assets/images/solace/solace-icon.png')}
          />
          <Text style={styles.logo}>Solace</Text>
          <ActivityIndicator size="small" />
        </View>
      </View>
    </ScrollView>
  );
};
export default Loading;
