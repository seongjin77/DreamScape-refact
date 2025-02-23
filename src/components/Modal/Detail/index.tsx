import { useEffect, useState } from 'react';
import { ModalContainerStyle, ModalStyle, CommentModalStyle } from './Styled';
import { Button } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

import { useDeviceType } from '../../../hooks/useDeviceType';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import CommentList from './CommentList';
import AddComment from './AddComment';
import ImageDescription from './ImageDescription';
interface DetailImageProps {
  id: string;
  imageUrl: string;
  description: string;
  title: string;
  deviceType: string;
  prompt: string;
  postpassword: string;
}

const DetailImage = ({
  id,
  imageUrl,
  description,
  title,
  prompt,
  postpassword,
}: DetailImageProps) => {
  const [openComment, setOpenComment] = useState<boolean>(false);

  const { deviceType } = useDeviceType();

  const [commentList, setCommentList] = useState<any[]>([]);

  useEffect(() => {
    const commentsRef = collection(db, `images/${id}/comments`);
    const initialQuery = query(commentsRef, orderBy('createdAt', 'desc'), limit(10));

    const unsubscribe = onSnapshot(initialQuery, (snapshot) => {
      const newComments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCommentList(newComments);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ModalContainerStyle>
      <ModalStyle
        className={`${deviceType === 'mobile' ? 'mobile-modal' : ''}`}
        openComment={openComment}
        deviceType={deviceType}
      >
        <ImageDescription
          prompt={prompt}
          imageUrl={imageUrl}
          description={description}
          title={title}
          postpassword={postpassword}
          id={id}
          setOpenComment={setOpenComment}
          openComment={openComment}
        />
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
              color: 'white',
              minWidth: 'auto',
              padding: '5px',
            }}
          >
            <CloseIcon />
          </Button>
        )}
        <AddComment id={id} />
        <CommentList id={id} commentList={commentList} />
      </CommentModalStyle>
    </ModalContainerStyle>
  );
};

export default DetailImage;
