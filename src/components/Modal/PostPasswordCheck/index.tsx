import { useState } from 'react';
import { ModalContainerStyle, ModalContentStyle } from './Styled';
import { FormControl, IconButton, InputAdornment, OutlinedInput, Button } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import useModal from '../../../hooks/useModal';
import useToast from '../../../hooks/useToast';

const PostPasswordCheck = ({
  postpassword,
  setIsPostPass,
  flag,
}: {
  postpassword: string;
  setIsPostPass: (isPass: boolean) => void;
  flag: React.MutableRefObject<string>;
}) => {
  const [passwordValue, setPasswordValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { closeModal } = useModal();
  const { errorToast } = useToast();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleCheckPassword = () => {
    if (passwordValue === postpassword) {
      setIsPostPass(true);
      closeModal('PostPasswordCheckModal');
    } else {
      errorToast('비밀번호가 일치하지 않습니다.');
    }
  };

  const handleClose = () => {
    setIsPostPass(false);
    closeModal('PostPasswordCheckModal');
    flag.current = '';
  };

  return (
    <ModalContainerStyle>
      <ModalContentStyle>
        <IconButton
          onClick={handleClose}
          style={{ position: 'absolute', top: '10px', right: '10px' }}
        >
          <CloseIcon />
        </IconButton>
        <LockIcon fontSize="large" />
        <p>게시물 비밀번호를 입력해주세요.</p>
        <FormControl variant="outlined">
          <OutlinedInput
            type={showPassword ? 'text' : 'password'}
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword}>
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
          <Button variant="contained" onClick={handleCheckPassword}>
            확인
          </Button>
        </FormControl>
      </ModalContentStyle>
    </ModalContainerStyle>
  );
};

export default PostPasswordCheck;
