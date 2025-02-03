import { toast } from 'react-toastify';

const useToast = () => {
  const successToast = (message: string) => {
    toast.success(message);
  };

  const errorToast = (message: string) => {
    toast.error(message);
  };

  const infoToast = (message: string) => {
    toast.info(message);
  };

  const warningToast = (message: string) => {
    toast.warning(message);
  };

  return { successToast, errorToast, infoToast, warningToast };
};

export default useToast;
