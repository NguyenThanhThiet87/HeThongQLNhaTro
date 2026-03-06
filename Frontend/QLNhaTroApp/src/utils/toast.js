import { Toast } from 'toastify-react-native';

const toast = {
  success: (message) => {
    Toast.success(message, "top");
  },

  error: (message) => {
    Toast.error(message, "top");
  },

  info: (message) => {
    Toast.info(message, "top");
  },
};

export default toast;
