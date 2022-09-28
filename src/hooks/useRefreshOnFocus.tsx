import {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

export function useRefreshOnFocus<T>(refetch: () => Promise<T>) {
  const navigation = useNavigation();
  useEffect(() => {
    const willFocusSubscription = navigation.addListener('focus', async () => {
      try {
        await refetch();
      } catch (e) {
        console.log('error during incubation get', e);
      }
    });
    return willFocusSubscription;
  }, [navigation, refetch]);
}
