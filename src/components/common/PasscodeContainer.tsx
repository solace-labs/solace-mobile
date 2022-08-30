import React, {FC, useEffect, useRef} from 'react';
import {StyleProp, TextInput, TouchableOpacity, ViewStyle} from 'react-native';
import PasscodeDot from './PasscodeDot';
import SolaceInput from './solaceui/SolaceInput';

type Props = {
  code: string;
  setCode: any;
};

export const PASSCODE_LENGTH = 6;
const PasscodeContainer: FC<Props> = ({code, setCode}) => {
  const textInputRef = useRef<TextInput>(null);

  const tempArray = new Array(PASSCODE_LENGTH).fill(0);

  const handleOnPress = () => {
    const textInput = textInputRef.current! as TextInput;
    textInput.focus();
  };

  useEffect(() => {
    setTimeout(() => {
      const textInput = textInputRef.current! as TextInput;
      textInput.focus();
    }, 500);
  }, []);

  const passcodeContainerStyle: StyleProp<ViewStyle> = {
    flexDirection: 'row',
    marginTop: 50,
    justifyContent: 'center',
    paddingVertical: 20,
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => handleOnPress()}
        style={passcodeContainerStyle}>
        {tempArray.map((_, index) => {
          return <PasscodeDot key={index} isFilled={code.length - index > 0} />;
        })}
      </TouchableOpacity>
      <SolaceInput
        autoFocus={true}
        forwardRef={textInputRef}
        hidden={true}
        mt={16}
        maxLength={PASSCODE_LENGTH}
        returnKeyType="done"
        keyboardType="number-pad"
        value={code}
        onChangeText={text => setCode(text)}
      />
    </>
  );
};

export default PasscodeContainer;
