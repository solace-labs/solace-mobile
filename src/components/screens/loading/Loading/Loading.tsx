import {View, Text, ScrollView, Image, ActivityIndicator} from 'react-native';
import React, {useContext, useEffect} from 'react';
import styles from './styles';
import {GlobalContext} from '../../../../state/contexts/GlobalContext';

export type Props = {
  navigation: any;
};

const Loading: React.FC<Props> = ({navigation}) => {
  const {state, dispatch} = useContext(GlobalContext);

  useEffect(() => {}, []);

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
