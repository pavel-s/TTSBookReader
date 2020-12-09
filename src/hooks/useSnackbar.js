import { useState } from 'react';

const useSnackbar = () => {
  const [visible, setVisible] = useState(false);
  // const onToggleSnackBar = () => setVisible(!visible);
  const onDismiss = () => setVisible(false);
  const [message, setMessage] = useState('');
  const showSuccess = (message) => {
    setMessage(message || 'Book was added to Library');
    setVisible(true);
  };
  const showError = (message) => {
    setMessage(message || 'Failed to open Book');
    setVisible(true);
  };

  return { visible, message, onDismiss, showSuccess, showError };
};

export default useSnackbar;
