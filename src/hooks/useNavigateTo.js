import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

/**
 * @param {String} routeName - route to navigate
 * @returns {Function} memoized callback which navigate to chosen route
 */
const useNavigateTo = (routeName) => {
  const navigation = useNavigation();
  const navigateTo = useCallback(() => navigation.navigate(routeName), [
    navigation,
  ]);
  return navigateTo;
};

export default useNavigateTo;
