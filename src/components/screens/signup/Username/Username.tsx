import {View} from 'react-native';
import React, {useContext, useState} from 'react';
import styles from './styles';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {GlobalContext} from '../../../../state/contexts/GlobalContext';
import {setUser} from '../../../../state/actions/global';
import SolaceButton from '../../../common/SolaceUI/SolaceButton/SolaceButton';
import SolaceContainer from '../../../common/SolaceUI/SolaceContainer/SolaceContainer';
import SolaceText from '../../../common/SolaceUI/SolaceText/SolaceText';
import SolaceInput from '../../../common/SolaceUI/SolaceInput/SolaceInput';
import Header from '../../../common/Header/Header';

export type Props = {
  navigation: any;
};

export enum Status {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success',
}

const UsernameScreen: React.FC<Props> = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [status, setStatus] = useState({
    text: 'your username will be public',
    status: Status.INFO,
  });

  const {state, dispatch} = useContext(GlobalContext);

  const checkUsernameAvailability = async () => {
    if (username.trim().length === 0) {
      return;
    }
    setIsLoading(true);
    dispatch(setUser({...state.user, solaceName: username}));
    setTimeout(() => {
      /** Checking username availability */
      // const available = await SolaceSDK.checkUsernameAvailability(username);
      const available = true;
      if (available) {
        setStatus({
          text: 'username is available',
          status: Status.SUCCESS,
        });
        setUsernameAvailable(true);
      } else {
        setStatus({
          text: 'username is not available',
          status: Status.ERROR,
        });
      }
      setIsLoading(false);
    }, 2000);
  };

  const handleUsernameSubmit = async () => {
    navigation.navigate('Email');
  };

  const handleChange = (text: string) => {
    setUsername(text);
    if (usernameAvailable) {
      setUsernameAvailable(false);
    }
    if (status.status !== Status.INFO) {
      setStatus({text: 'your username will be public', status: Status.INFO});
    }
  };

  const getIcon = () => {
    let name = 'infocirlceo';
    let color = 'gray';
    switch (status.status) {
      case Status.INFO:
        name = 'infocirlceo';
        color = 'gray';
        break;
      case Status.WARNING:
        name = 'exclamationcircle';
        color = 'orange';
        break;
      case Status.ERROR:
        name = 'closecircleo';
        color = 'red';
        break;
      case Status.SUCCESS:
        name = 'checkcircleo';
        color = 'green';
    }
    return (
      <View style={styles.subTextContainer}>
        <AntDesign name={name} style={[styles.subIcon, {color}]} />
        <SolaceText
          variant="light"
          weight="semibold"
          size="sm"
          style={{paddingLeft: 4}}>
          {status.text}
        </SolaceText>
      </View>
    );
  };

  return (
    <SolaceContainer>
      <View style={styles.textContainer}>
        <Header
          heading="your solace username"
          subHeading={'choose a username that others can use to send you money'}
        />
        <SolaceInput
          placeholder="username"
          mt={16}
          value={username}
          onChangeText={text => handleChange(text)}
        />
        {getIcon()}
      </View>
      <View style={{flex: 1}}>
        {isLoading && (
          <SolaceText type="secondary" weight="bold" variant="light">
            checking...
          </SolaceText>
        )}
      </View>
      <SolaceButton
        mt={16}
        loading={isLoading}
        disabled={username.trim().length === 0 || isLoading}
        onPress={() => {
          usernameAvailable
            ? handleUsernameSubmit()
            : checkUsernameAvailability();
        }}>
        <SolaceText type="secondary" weight="bold" variant="dark">
          {usernameAvailable ? 'next' : 'check'}
        </SolaceText>
      </SolaceButton>
    </SolaceContainer>
  );
};

export default UsernameScreen;
