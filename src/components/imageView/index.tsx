import React, { useState, useEffect } from 'react';
import { ImageViewStyle } from './Styled';
import useModal from '../../hooks/useModal';
import { DetailImageModal } from '../Modal';
import CircularProgress from '@mui/material/CircularProgress';
import { getDocs, onSnapshot, collection, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface ImageData {
  id: string;
  url: string;
  description: string;
  title: string;
  prompt: string;
  commentCount: number;
  generatedPrompt?: string;
  postpassword: string;
}

interface ImageViewProps {
  deviceType: string;
  searchQuery: string;
}

const ImageView: React.FC<ImageViewProps> = ({ deviceType, searchQuery }) => {
  const [activeTab, setActiveTab] = useState('tab1');
  const [latestImages, setLatestImages] = useState<ImageData[]>([]);
  const [oldestImages, setOldestImages] = useState<ImageData[]>([]);
  const [popularImages, setPopularImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const { openModal } = useModal();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  const openDetailModal = (
    id: string,
    url: string,
    description: string,
    title: string,
    prompt: string,
    postpassword: string,
  ) => {
    openModal({
      id: 'detailModal',
      component: (
        <DetailImageModal
          id={id}
          imageUrl={url}
          title={title}
          description={description}
          deviceType={deviceType}
          prompt={prompt}
          postpassword={postpassword}
        />
      ),
    });
  };

  const fetchImages = async (
    orderField: string,
    orderDirection: 'asc' | 'desc',
    setState: React.Dispatch<React.SetStateAction<ImageData[]>>,
    isSortingByComments: boolean = false,
  ) => {
    setLoading(true);
    const imageCollection = collection(db, 'images');

    let q;
    if (searchQuery) {
      q = query(imageCollection, orderBy(orderField, orderDirection), limit(50)); // 50개까지만 가져오기
    } else {
      q = isSortingByComments
        ? query(imageCollection, orderBy('createdAt', 'desc'), limit(10))
        : query(imageCollection, orderBy(orderField, orderDirection), limit(10));
    }

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const imageData = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();
          const commentCollection = collection(db, `images/${doc.id}/comments`);
          const commentSnapshot = await getDocs(commentCollection);
          const commentCount = commentSnapshot.size;

          return {
            id: doc.id,
            url: data.url || 'null',
            title: data.title || 'No Title',
            prompt: data.prompt || '',
            description: data.description || 'No description',
            commentCount,
            postpassword: data.postpassword || '',
          };
        }),
      );

      // 검색어가 있을 경우 필터링
      const filteredData = searchQuery
        ? imageData.filter(
            (image) =>
              image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              image.prompt.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : imageData;

      if (isSortingByComments) {
        filteredData.sort((a, b) => b.commentCount - a.commentCount);
      }

      setState(filteredData);
      setLoading(false);
    });

    return unsubscribe;
  };

  useEffect(() => {
    const fetchData = async () => {
      const unsubscribeLatest = await fetchImages('createdAt', 'desc', setLatestImages);
      const unsubscribeOldest = await fetchImages('createdAt', 'asc', setOldestImages);
      const unsubscribePopular = await fetchImages('createdAt', 'desc', setPopularImages, true);

      return () => {
        unsubscribeLatest();
        unsubscribeOldest();
        unsubscribePopular();
      };
    };

    let unsubscribe: (() => void) | undefined;

    fetchData()
      .then((cleanup) => {
        unsubscribe = cleanup;
      })
      .catch((error) => console.error('이미지 불러오기 실패:', error));

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [searchQuery]);

  const filterImages = (images: ImageData[]) => {
    return images.filter(
      (image) =>
        image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.prompt.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };

  const renderImages = (images: ImageData[]) => {
    const filteredImages = filterImages(images);

    if (deviceType === 'mobile') {
      return filteredImages.length > 0 ? (
        <Slider {...settings}>
          {filteredImages.map((image) => (
            <div
              key={image.id}
              onClick={() =>
                openDetailModal(
                  image.id,
                  image.url,
                  image.description,
                  image.title,
                  image.prompt,
                  image.postpassword,
                )
              }
            >
              <img
                src={image.url}
                alt={image.description}
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />
            </div>
          ))}
        </Slider>
      ) : (
        <p style={{ textAlign: 'center' }}>이미지가 없습니다.</p>
      );
    } else {
      return filteredImages.length > 0 ? (
        <div className="grid-container">
          {filteredImages.map((image, index) => (
            <div
              className={`grid-item item${index + 1}`}
              onClick={() =>
                openDetailModal(
                  image.id,
                  image.url,
                  image.description,
                  image.title,
                  image.prompt,
                  image.postpassword,
                )
              }
              key={image.id}
            >
              <img
                src={image.url}
                alt={image.description}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span className="comment-count">{image.commentCount} Comments</span>
              <span className="file-size">{Math.floor(Math.random() * 1500 + 500)} KB</span>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center' }}>이미지가 없습니다.</p>
      );
    }
  };

  return (
    <ImageViewStyle deviceType={deviceType}>
      <section className="grid-section">
        <div className="tab-menu">
          <div className="tabs">
            <button
              className={`tab-link ${activeTab === 'tab1' ? 'active' : ''}`}
              onClick={() => handleTabClick('tab1')}
            >
              최신순
            </button>
            <button
              className={`tab-link ${activeTab === 'tab2' ? 'active' : ''}`}
              onClick={() => handleTabClick('tab2')}
            >
              오래된 순
            </button>
            <button
              className={`tab-link ${activeTab === 'tab3' ? 'active' : ''}`}
              onClick={() => handleTabClick('tab3')}
            >
              댓글 많은 순
            </button>
          </div>
          <div className="tab-content">
            {loading ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '200px',
                }}
              >
                <CircularProgress />
              </div>
            ) : (
              <>
                {activeTab === 'tab1' && (
                  <div className="tab-pane">
                    <div>{renderImages(latestImages)}</div>
                  </div>
                )}
                {activeTab === 'tab2' && (
                  <div className="tab-pane">
                    <div>{renderImages(oldestImages)}</div>
                  </div>
                )}
                {activeTab === 'tab3' && (
                  <div className="tab-pane">
                    <div>{renderImages(popularImages)}</div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </ImageViewStyle>
  );
};

export default ImageView;
