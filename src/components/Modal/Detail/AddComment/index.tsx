import { Button } from '@mui/material';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../firebase/config';
import { useState } from 'react';

interface AddCommentProps {
  id: string;
}

/* 댓글 추가 */
const AddComment = ({ id }: AddCommentProps) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [commentValue, setCommentValue] = useState('');

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
          <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} />
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

export default AddComment;
