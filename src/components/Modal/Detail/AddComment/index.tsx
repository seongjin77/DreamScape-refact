import { Button } from '@mui/material';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../firebase/config';
import { useForm } from 'react-hook-form';

interface AddCommentProps {
  id: string;
}

interface CommentData {
  userId: string;
  password: string;
  commentValue: string;
}

/* 댓글 추가 */
const AddComment = ({ id }: AddCommentProps) => {
  const { register, handleSubmit, reset } = useForm<CommentData>();

  const onSubmit = async (data: CommentData) => {
    // form 필드 값이 유효하지 않으면 자동으로 RHF에서 실행 안됨
    const { userId, password, commentValue } = data;

    const commentData = {
      userId,
      password,
      commentValue,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, `images/${id}/comments`), commentData);

    // Reset form fields
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="comment-add">
      <div className="user-info-add">
        <div className="form">
          <label htmlFor="userId">닉네임</label>
          <input id="userId" {...register('userId', { required: true })} type="text" />
        </div>
        <div className="form">
          <label htmlFor="password">패스워드</label>
          <input id="password" {...register('password', { required: true })} type="password" />
        </div>
      </div>
      <div className="textarea-add">
        <textarea id="commentValue" {...register('commentValue', { required: true })} />
        <Button variant="contained" type="submit">
          등록하기
        </Button>
      </div>
    </form>
  );
};

export default AddComment;
