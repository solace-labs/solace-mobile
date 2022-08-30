import {StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import React, {useContext, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {GlobalContext} from '../../../state/contexts/GlobalContext';
import {setUser} from '../../../state/actions/global';
import SolaceButton from '../../common/solaceui/SolaceButton';
import SolaceContainer from '../../common/solaceui/SolaceContainer/SolaceContainer';
import SolaceText from '../../common/solaceui/SolaceText/SolaceText';
import SolaceInput from '../../common/solaceui/SolaceInput/SolaceInput';
import Header from '../../common/Header';
import SolaceLoader from '../../common/solaceui/SolaceLoader/SolaceLoader';

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

    const containerStyle: StyleProp<ViewStyle> = {
      flexDirection: 'row',
      marginTop: 12,
      alignItems: 'center',
    };
    const iconStyle: StyleProp<TextStyle> = {
      color,
      fontSize: 16,
      fontWeight: 'bold',
    };

    return (
      <View style={containerStyle}>
        <AntDesign name={name} style={iconStyle} />
        <SolaceText
          variant="light"
          weight="semibold"
          size="sm"
          style={{paddingLeft: 8}}>
          {status.text}
        </SolaceText>
      </View>
    );
  };

  return (
    <SolaceContainer>
      <View style={{flex: 1}}>
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
        {isLoading && <SolaceLoader text="checking..." />}
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
