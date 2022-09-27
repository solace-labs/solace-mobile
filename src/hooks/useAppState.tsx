import {useEffect} from 'react';
import {AppState, AppStateStatus} from 'react-native';

export function useAppState(onChange: (state: AppStateStatus) => void) {
  useEffect(() => {
    const changeSubscription = AppState.addEventListener('change', onChange);
    return () => {
      changeSubscription.remove();
    };
  }, [onChange]);
}
