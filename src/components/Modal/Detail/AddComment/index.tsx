import { Button } from '@mui/material';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../firebase/config';
import { useForm } from 'react-hook-form';

interface AddCommentProps {
  id: string;
}

/* 댓글 추가 */
const AddComment = ({ id }: AddCommentProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data: any) => {
    const { userId, password, commentValue } = data;

    if (!userId && !password && !commentValue) {
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

    // Reset form fields
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="comment-add">
      <div className="user-info-add">
        <div className="form">
          <label htmlFor="userId">닉네임</label>
          <input {...register('userId', { required: true })} type="text" />
        </div>
        <div className="form">
          <label htmlFor="password">패스워드</label>
          <input {...register('password', { required: true })} type="password" />
        </div>
      </div>
      {errors.userId && <span>닉네임을 입력해주세요.</span>}
      {errors.password && <span>패스워드를 입력해주세요.</span>}
      <div className="textarea-add">
        <textarea {...register('commentValue', { required: true })} />
        {errors.commentValue && <span>댓글을 입력해주세요.</span>}
        <Button variant="contained" type="submit">
          등록하기
        </Button>
      </div>
    </form>
  );
};

export default AddComment;
