import { ImageWrapper } from '../Styled';
import { Button } from '@mui/material';

import useModal from '../../../../hooks/useModal';
import useToast from '../../../../hooks/useToast';
import { useEffect, useRef, useState } from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../../firebase/config';
import { PostPasswordCheckModal } from '../../';

import AspectRatioSelector from '../../../AspectRatioSelector';

import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';

interface ImageDescriptionProps {
  imageUrl: string;
  description: string;
  title: string;
  prompt: string;
  postpassword: string;
  id: string;
  setOpenComment: (openComment: boolean) => void;
  openComment: boolean;
}

const ImageDescription = ({
  imageUrl,
  description,
  title,
  prompt,
  postpassword,
  id,
  setOpenComment,
  openComment,
}: ImageDescriptionProps) => {
  const { closeModal, openModal } = useModal();
  const { successToast, errorToast } = useToast();
  const [aspectRatio, setAspectRatio] = useState<string>('1/1');
  const Postflag = useRef<string>('');
  const [isPostPass, setIsPostPass] = useState(false);

  const fetchImageBlob = async (imageUrl: string): Promise<Blob> => {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`이미지 요청 실패: ${response.statusText}`);
    return response.blob();
  };

  const resizeImage = (image: HTMLImageElement, aspectRatio: string): HTMLCanvasElement => {
    const [widthRatio, heightRatio] = aspectRatio.split('/').map(Number);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('캔버스 생성 실패');

    const newWidth = image.naturalWidth;
    const newHeight = (newWidth * heightRatio) / widthRatio;

    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.drawImage(image, 0, 0, newWidth, newHeight);

    return canvas;
  };

  const downloadImage = (canvas: HTMLCanvasElement, title: string = 'downloaded-image'): void => {
    canvas.toBlob((blob) => {
      if (!blob) throw new Error('Blob 생성 실패');

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${title}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }, 'image/png');
  };

  const handleImgDownload = async () => {
    if (!imageUrl) return;

    try {
      const blob = await fetchImageBlob(imageUrl);
      const img = new Image();
      img.src = URL.createObjectURL(blob);

      img.onload = () => {
        const canvas = resizeImage(img, aspectRatio);
        downloadImage(canvas, title);
        URL.revokeObjectURL(img.src); // 메모리 해제
      };
    } catch (error) {
      console.error('이미지 다운로드 오류:', error);
    }
  };

  const handleDeletePost = (): void => {
    if (!postpassword) {
      errorToast('삭제 비밀번호가 없습니다.');
      return;
    }

    if (Postflag.current === '') {
      Postflag.current = 'delete';
    }

    openModal({
      id: 'PostPasswordCheckModal',
      component: (
        <PostPasswordCheckModal
          postpassword={postpassword}
          setIsPostPass={setIsPostPass}
          flag={Postflag}
        />
      ),
    });
  };

  const deletePost = async (): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'images', id));
      successToast('게시물이 삭제되었습니다.');
      closeModal('detailModal');
    } catch (error) {
      console.error('게시물 삭제 실패:', error);
    }
  };

  useEffect(() => {
    if (isPostPass && Postflag.current === 'delete') {
      deletePost().catch((error) => console.error('게시물 삭제 실패:', error));
    }
  }, [isPostPass]);

  const openDescription = () => {
    setOpenComment(!openComment);
  };

  return (
    <div className="modal-body">
      {/* 이미지와 설명 */}
      <ImageWrapper>
        <div className="image-wrapper">
          <img src={imageUrl} alt={description} style={{ aspectRatio }} />
          <div className="article-wrapper">
            <AspectRatioSelector setAspectRatio={setAspectRatio} aspectRatio={aspectRatio} />
            <button
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              onClick={handleDeletePost}
            >
              <DeleteIcon sx={{ color: 'white' }} />
            </button>
            <button
              onClick={handleImgDownload}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <DownloadIcon sx={{ color: 'white' }} />
            </button>
          </div>
        </div>
        <div className="info-wrpper">
          <div className="title-area">
            <p className="area-title">타이틀</p>
            <p className="title">{title}</p>
          </div>
          <div className="prompt-area">
            <p className="area-title">프롬프트 내용 </p>
            <p className="prompt">{prompt}</p>
          </div>
          <div className="description-area">
            <p className="area-title">내용</p>
            <p className="description">{description}</p>
          </div>
        </div>
      </ImageWrapper>
      <div className="button-box">
        <Button className="close-btn" variant="outlined" onClick={() => closeModal('detailModal')}>
          닫기
        </Button>

        <Button variant="contained" onClick={openDescription}>
          {openComment ? '접기' : '상세보기'}
        </Button>
      </div>
    </div>
  );
};

export default ImageDescription;
