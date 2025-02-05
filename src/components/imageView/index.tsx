import React, { useState, useEffect } from 'react';
import { ImageViewStyle, PaginationStyle } from './Styled';
import useModal from '../../hooks/useModal';
import { DetailImageModal } from '../Modal';
import CircularProgress from '@mui/material/CircularProgress';
import { getDocs, onSnapshot, collection, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md'; // ✅ React Icons 추가

interface ImageData {
  id: string;
  url: string;
  description: string;
  title: string;
  prompt: string;
  commentCount: number;
  postpassword: string;
}

interface ImageViewProps {
  deviceType: string;
  searchQuery: string;
}

const ITEMS_PER_PAGE = 12; // 한 페이지당 9개씩 표시

const ImageView: React.FC<ImageViewProps> = ({ deviceType, searchQuery }) => {
  const [activeTab, setActiveTab] = useState('tab1');
  const [latestImages, setLatestImages] = useState<ImageData[]>([]);
  const [oldestImages, setOldestImages] = useState<ImageData[]>([]);
  const [popularImages, setPopularImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { openModal } = useModal();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  useEffect(() => {
    setCurrentPage(1); // 검색할 때 페이지를 1로 초기화
  }, [searchQuery]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setCurrentPage(1); // 탭을 변경할 때 페이지를 1로 초기화
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

    const q = isSortingByComments
      ? query(imageCollection, orderBy('commentCount', 'desc'), limit(36))
      : query(imageCollection, orderBy(orderField, orderDirection), limit(36));

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

      const filteredData = searchQuery
        ? imageData.filter(
            (image) =>
              image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              image.prompt.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : imageData;

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

  const paginateImages = (images: ImageData[]) => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return images.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const renderImages = (images: ImageData[]) => {
    if (deviceType === 'mobile') {
      return (
        <Slider {...settings}>
          {images.map((image) => (
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
      );
    } else {
      return (
        <>
          <div className="grid-container">
            {paginateImages(images).map((image, index) => (
              <div
                className={`grid-item item${index + 1}`}
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
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span className="comment-count">{image.commentCount} Comments</span>
              </div>
            ))}
          </div>
          <PaginationStyle>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <MdNavigateBefore size={24} />
            </button>
            <span>{currentPage}</span>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage * ITEMS_PER_PAGE >= images.length}
            >
              <MdNavigateNext size={24} />
            </button>
          </PaginationStyle>
        </>
      );
    }
  };

  return (
    <ImageViewStyle deviceType={deviceType}>
      <section className="grid-section">
        <div className="tab-menu">
          <div className="tabs">
            {['tab1', 'tab2', 'tab3'].map((tab, idx) => (
              <button
                key={idx}
                className={`tab-link ${activeTab === tab ? 'active' : ''}`}
                onClick={() => handleTabClick(tab)}
              >
                {['최신순', '오래된 순', '댓글 많은 순'][idx]}
              </button>
            ))}
          </div>
          <div className="tab-content">
            {loading ? (
              <CircularProgress />
            ) : (
              renderImages(
                activeTab === 'tab1'
                  ? latestImages
                  : activeTab === 'tab2'
                    ? oldestImages
                    : popularImages,
              )
            )}
          </div>
        </div>
      </section>
    </ImageViewStyle>
  );
};

export default ImageView;
