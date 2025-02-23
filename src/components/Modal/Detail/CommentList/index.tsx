import { useState, useRef, useEffect } from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import useModal from '../../../../hooks/useModal';
import useToast from '../../../../hooks/useToast';
import { PasswordCheckModal } from '../../';
import { Button } from '@mui/material';
import { db } from '../../../../firebase/config';

interface TempUserInfo {
  id: string;
  currentValue: string;
}

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

export default CommentList;
