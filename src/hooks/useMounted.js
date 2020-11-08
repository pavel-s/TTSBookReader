import { useEffect, useRef } from 'react';

/**
 * return ref
 * ref.current === true if component is mounted
 */
const useMounted = () => {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
};

export default useMounted;
