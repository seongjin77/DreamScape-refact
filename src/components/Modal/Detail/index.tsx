import React, { useEffect, useRef, useState } from 'react';
import { ModalContainerStyle, ImageWrapper, ModalStyle, CommentModalStyle } from './Styled';
import useModal from '../../../hooks/useModal';
import { Button } from '@mui/material';

import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';

import AspectRatioSelector from '../../AspectRatioSelector';
import { useDeviceType } from '../../../hooks/useDeviceType';
import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { PasswordCheckModal } from '../';
import useToast from '../../../hooks/useToast';
interface DetailImageProps {
  id: string;
  imageUrl: string;
  description: string;
  title: string;
  deviceType: string;
  prompt: string;
}

interface AddCommentProps {
  id: string;
  userId: string;
  setUserId: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  commentValue: string;
  setCommentValue: (value: string) => void;
}

interface TempUserInfo {
  id: string;
  currentValue: string;
}

/* 댓글 추가 */
const AddComment = ({
  id,
  userId,
  setUserId,
  password,
  setPassword,
  commentValue,
  setCommentValue,
}: AddCommentProps) => {
  const saveComment = async () => {
    if (!userId || !password || !commentValue) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const commentData = {
      userId,
      password,
      commentValue,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, `images/${id}/comments`), commentData);

    setUserId('');
    setPassword('');
    setCommentValue('');
  };

  return (
    <div className="comment-add">
      <div className="user-info-add">
        <div className="form">
          <label htmlFor="">닉네임</label>
          <input value={userId} type="text" onChange={(e) => setUserId(e.target.value)} />
        </div>
        <div className="form">
          <label htmlFor="">패스워드</label>
          <input value={password} type="text" onChange={(e) => setPassword(e.target.value)} />
        </div>
      </div>
      <div className="textarea-add">
        <textarea
          value={commentValue}
          onChange={(e) => {
            setCommentValue(e.target.value);
          }}
        />
        <Button variant="contained" onClick={saveComment}>
          등록하기
        </Button>
      </div>
    </div>
  );
};

/* 댓글 리스트 */
const CommentList = ({ commentList, id }: { commentList: any[]; id: string }) => {
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const tempUserInfo = useRef<TempUserInfo | null>(null);
  const tempDeleteInfo = useRef<TempUserInfo | null>(null);
  const flag = useRef<string>('');

  const [isPass, setIsPass] = useState(false);
  const { openModal } = useModal();
  const { successToast } = useToast();

  const checkPassword = (password: string, userId: string, flagCheck: string) => {
    if (flag.current === '') {
      flag.current = flagCheck;
    }
    openModal({
      id: 'PasswordCheckModal',
      component: (
        <PasswordCheckModal password={password} setIsPass={setIsPass} userId={userId} flag={flag} />
      ),
    });
  };

  const handleEditClick = (id: string, currentValue: string, password: string, userId: string) => {
    // 비밀번호 확인
    checkPassword(password, userId, 'edit');
    // 임시 유저 정보 저장
    tempUserInfo.current = { id, currentValue };
  };

  const changeEditMode = (id: string, currentValue: string) => {
    setEditMode(id);
    setEditValue(currentValue);
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setIsPass(false);
    tempUserInfo.current = null;
    flag.current = '';
  };

  /* 수정 */
  const handleSaveEdit = async (commentUserId: string) => {
    try {
      // 특정 id를 가진 서브컬렉션의 문서 참조
      const commentRef = doc(db, `images/${id}/comments`, commentUserId);

      // 문서 업데이트
      await updateDoc(commentRef, { commentValue: editValue });
      successToast('수정 완료');
      setEditMode(null);
      setEditValue('');
      flag.current = '';
      setIsPass(false);
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  /* 삭제 */
  const handleDeleteClick = (id: string, password: string, userId: string) => {
    // 비밀번호 확인
    checkPassword(password, userId, 'delete');
    // 임시 유저 정보 저장
    tempDeleteInfo.current = { id, currentValue: '' };
  };

  const deleteComment = async (commentUserId: string) => {
    const commentRef = doc(db, `images/${id}/comments`, commentUserId);
    await deleteDoc(commentRef);
    flag.current = '';
    setIsPass(false);
  };

  useEffect(() => {
    // 비밀번호 확인 통과 후 수정모드 변경
    if (isPass && tempUserInfo.current && flag.current === 'edit') {
      changeEditMode(tempUserInfo.current.id, tempUserInfo.current.currentValue);
    }

    // 비밀번호 확인 통과 후 삭제
    if (isPass && tempDeleteInfo.current && flag.current === 'delete') {
      deleteComment(tempDeleteInfo.current.id).catch((error) => {
        console.error('Error deleting: ', error);
      });
      successToast('삭제 완료');
    }
  }, [isPass]);

  return (
    <ul className="comment-list-wrapper">
      {commentList.map((data) => (
        <li className="comment-list" key={data.id}>
          <div className="comment-user-info">
            <span className="nickname">{data.userId}</span>
          </div>
          <div className="comment-wrapper">
            {editMode === data.id ? (
              <textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} />
            ) : (
              <p className="comment">{data.commentValue}</p>
            )}
            {/* <span className="">더보기</span> */}
          </div>
          <div className="button-box">
            {editMode === data.id ? (
              <>
                <Button variant="contained" onClick={() => handleSaveEdit(data.id)}>
                  저장하기
                </Button>
                <Button color="error" variant="outlined" onClick={handleCancelEdit}>
                  취소하기
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  onClick={() =>
                    handleEditClick(data.id, data.commentValue, data.password, data.userId)
                  }
                >
                  수정하기
                </Button>
                <Button
                  color="error"
                  variant="outlined"
                  onClick={() => handleDeleteClick(data.id, data.password, data.userId)}
                >
                  삭제하기
                </Button>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

const DetailImage = ({ id, imageUrl, description, title, prompt }: DetailImageProps) => {
  // img
  const { closeModal } = useModal();
  const [openComment, setOpenComment] = useState<boolean>(false);
  // comment
  const [commentValue, setCommentValue] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const { deviceType } = useDeviceType();
  const [aspectRatio, setAspectRatio] = useState<string>('1/1');

  const [commentList, setCommentList] = useState<any[]>([]);

  const openDescription = () => {
    setOpenComment(!openComment);
  };

  useEffect(() => {
    const commentsRef = collection(db, `images/${id}/comments`);
    const initialQuery = query(commentsRef, orderBy('createdAt', 'desc'), limit(10));

    const unsubscribe = onSnapshot(initialQuery, (snapshot) => {
      const newComments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCommentList(newComments);
    });

    return () => unsubscribe();
  }, []);

  const handleImgDownload = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('이미지 요청 실패');

      const blob = await response.blob();
      const img = new Image();
      img.src = URL.createObjectURL(blob);

      img.onload = () => {
        const [widthRatio, heightRatio] = aspectRatio.split('/').map(Number);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const newWidth = img.naturalWidth;
        const newHeight = (newWidth * heightRatio) / widthRatio;

        canvas.width = newWidth;
        canvas.height = newHeight;

        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        canvas.toBlob((blob) => {
          if (!blob) return;

          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `${title || 'downloaded-image'}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }, 'image/png');
      };
    } catch (error) {
      console.error('이미지 다운로드 오류:', error);
    }
  };
  return (
    <ModalContainerStyle>
      <ModalStyle
        className={`${deviceType === 'mobile' ? 'mobile-modal' : ''}`}
        openComment={openComment}
        deviceType={deviceType}
      >
        <div className="modal-body">
          {/* 이미지와 설명 */}
          <ImageWrapper>
            <div className="image-wrapper">
              <img src={imageUrl} alt={description} style={{ aspectRatio }} />
              <div className="article-wrapper">
                <AspectRatioSelector setAspectRatio={setAspectRatio} aspectRatio={aspectRatio} />
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
            <Button
              className="close-btn"
              variant="outlined"
              onClick={() => closeModal('detailModal')}
            >
              닫기
            </Button>

            <Button variant="contained" onClick={openDescription}>
              {openComment ? '접기' : '상세보기'}
            </Button>
          </div>
        </div>
      </ModalStyle>
      <CommentModalStyle
        className={`${deviceType === 'mobile' ? 'mobile-modal' : ''}`}
        openComment={openComment}
        deviceType={deviceType}
      >
        {(deviceType === 'mobile' || deviceType === 'tablet') && (
          <Button
            className="modal-close"
            onClick={() => setOpenComment(false)}
            sx={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              color: 'white', // 🔹 아이콘 색상을 흰색으로 변경
              minWidth: 'auto',
              padding: '5px',
            }}
          >
            <CloseIcon />
          </Button>
        )}
        <AddComment
          id={id}
          userId={userId}
          setUserId={setUserId}
          password={password}
          setPassword={setPassword}
          commentValue={commentValue}
          setCommentValue={setCommentValue}
        />
        <CommentList id={id} commentList={commentList} />
      </CommentModalStyle>
    </ModalContainerStyle>
  );
};

export default DetailImage;
