import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import AspectRatioSelector from '../../AspectRatioSelector';
import { ModalWrapper, ModalContent, CommentModalStyle } from './Styled';
import { Button } from '@mui/material';
import { uploadImageFromUrl } from '../../../firebase/config';
import useModal from '../../../hooks/useModal';
import { useDeviceType } from '../../../hooks/useDeviceType';

interface ModalPageProps {
  fetchImage: (setImageUrl: (url: string) => void) => Promise<void>;
  deviceType: string;
  prompt: string;
}

const SendImage: React.FC<ModalPageProps> = ({ fetchImage, prompt }) => {
  const [aspectRatio, setAspectRatio] = useState<string>('1/1');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openSideModal, setOpenSideModal] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [postpassword, setPostpassword] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const { closeModal } = useModal();
  const { deviceType } = useDeviceType();

  // 이미지 로드
  useEffect(() => {
    setIsLoading(true);
    fetchImage(setImageUrl)
      .then(() => setIsLoading(false))
      .catch((error) => {
        console.error('Error fetching image:', error);
        setIsLoading(false);
      });
  }, [fetchImage]);

  const handleImgUpload = async () => {
    if (!imageUrl || !title || !description || !prompt) {
      alert('이미지, 제목, 내용을 모두 입력해주세요.');
      return;
    }

    try {
      await uploadImageFromUrl(imageUrl, description, title, prompt, postpassword);
      console.log('Send 컴포넌트 프롬프트 업로드 성공:', { prompt });
      console.log('Send 컴포넌트 데이터 업로드 성공:', { title, description });

      closeModal('SendImageModal');
    } catch (error) {
      console.error('Send 컴포넌트 데이터 업로드 실패:', error);
    }
  };
  const handleImgDownload = () => {
    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      const [widthRatio, heightRatio] = aspectRatio.split('/').map(Number);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const newWidth = img.width;
      const newHeight = (newWidth * heightRatio) / widthRatio;

      canvas.width = newWidth;
      canvas.height = newHeight;

      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'resized-image.png';
      link.click();
    };

    img.onerror = () => {
      console.error('이미지를 로드하는 데 실패했습니다.');
    };
  };

  const toggleModalSide = () => {
    setOpenSideModal(!openSideModal);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    if (newTitle.length <= 12) {
      setTitle(newTitle);
    }
  };

  const handlePostPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostpassword(e.target.value);
  };

  return (
    <ModalWrapper>
      <ModalContent
        className={`${deviceType === 'mobile' ? 'mobile-modal' : ''}`}
        openSideModal={openSideModal}
        deviceType={deviceType}
      >
        {isLoading ? (
          <CircularProgress sx={{ color: '#005bea' }} />
        ) : (
          <div className="modal-contents">
            {imageUrl ? (
              <div className="modal-img-contents">
                <img src={imageUrl} alt="Generated" style={{ aspectRatio }} />
              </div>
            ) : (
              <p>이미지를 불러오는 데 실패했습니다.</p>
            )}
            <AspectRatioSelector setAspectRatio={setAspectRatio} aspectRatio={aspectRatio} />
            <div className="modal-footer">
              <div className="contents-text">
                <p>이미지가 완성되었습니다. 버튼을 눌러 비율을 맞춰주세요</p>
              </div>
              <div className="model-btn-wrapeer">
                <Button
                  className="close-btn"
                  variant="outlined"
                  onClick={() => closeModal('SendImageModal')}
                >
                  닫기
                </Button>
                <Button variant="contained" onClick={handleImgDownload}>
                  다운로드
                </Button>
                <Button variant="contained" onClick={toggleModalSide}>
                  저장하기
                </Button>
              </div>
            </div>
          </div>
        )}
      </ModalContent>
      <CommentModalStyle
        className={`${deviceType === 'mobile' ? 'mobile-modal' : ''}`}
        openSideModal={openSideModal}
        deviceType={deviceType}
      >
        <div className="info-area">
          <div className="introduce">
            <p>제목과 내용을 입력해주세요</p>
            <p className="small">제목과 내용이 업로드 될 시 해당 정보는 서버에 올라갑니다.</p>
          </div>
          <div className="form">
            <label>제목</label>
            <input
              className="title-input"
              type="text"
              placeholder="제목을 입력해주세요 (최대 12자)"
              value={title}
              onChange={handleTitleChange}
              maxLength={12}
            />
          </div>
          <div className="form">
            <label>비밀번호</label>
            <input
              className="title-input"
              type="password" // 🔹 비밀번호 가리기 적용
              placeholder="비밀번호를 입력해주세요"
              value={postpassword}
              onChange={handlePostPasswordChange}
            />
          </div>
          <div className="form large-form">
            <label>내용</label>
            <textarea
              className="description-area"
              placeholder="내용을 입력해주세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="btn-area">
          {deviceType === 'mobile' || deviceType === 'tablet' ? (
            <Button className="back-btn" onClick={() => setOpenSideModal(false)}>
              뒤로가기
            </Button>
          ) : null}
          <button className="upload-btn" onClick={handleImgUpload}>
            메인에 업로드
          </button>
        </div>
      </CommentModalStyle>
    </ModalWrapper>
  );
};

export default SendImage;
