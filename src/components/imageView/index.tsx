import React, { useState, useEffect, useCallback } from 'react';
import { ImageViewStyle } from './Styled';
import CircularProgress from '@mui/material/CircularProgress';
import { getDocs, onSnapshot, collection, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/config';
import RenderImage from './RenderImage';

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

const ITEMS_PER_PAGE = 12;

const ImageView: React.FC<ImageViewProps> = ({ deviceType, searchQuery }) => {
  const [activeTab, setActiveTab] = useState('tab1');
  const [latestImages, setLatestImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalImages, setTotalImages] = useState(0);

  const handleTabClick = useCallback((tabId: string) => {
    setActiveTab(tabId);
    setCurrentPage(1);
  }, []);

  const fetchImages = useCallback(
    async (
      orderDirection: 'asc' | 'desc',
      setState: React.Dispatch<React.SetStateAction<ImageData[]>>,
      isSortingByComments: boolean = false,
    ) => {
      setLoading(true);
      const imageCollection = collection(db, 'images');

      const q = query(imageCollection, orderBy('createdAt', orderDirection), limit(50));

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const imageData = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const data = doc.data();
            const commentCollection = collection(db, `images/${doc.id}/comments`);
            const commentSnapshot = await getDocs(commentCollection);

            const commentCount = commentSnapshot.size || 0;

            return {
              id: doc.id,
              url: data.url || 'null',
              title: data.title || 'No Title',
              prompt: data.prompt || '',
              description: data.description || 'No description',
              commentCount,
              postpassword: data.postpassword || '',
              createdAt: data.createdAt ? data.createdAt.toDate() : new Date(0),
            };
          }),
        );

        let filteredData = searchQuery
          ? imageData.filter(
              (image) =>
                image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                image.prompt.toLowerCase().includes(searchQuery.toLowerCase()),
            )
          : imageData;

        if (isSortingByComments) {
          filteredData = filteredData.sort((a, b) => b.commentCount - a.commentCount);
        }

        setState(filteredData);
        setTotalImages(filteredData.length);
        setLoading(false);
      });

      return unsubscribe;
    },
    [searchQuery],
  );

  const paginateImages = useCallback(
    (images: ImageData[]) => {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      return images.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    },
    [currentPage],
  );

  const handlePrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);

  const handlePageClick = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  /* 검색시 페이지 리셋 */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      const sortOrder = activeTab === 'tab2' ? 'asc' : 'desc';
      const isSortingByComments = activeTab === 'tab3';

      const unsubscribeLatest = await fetchImages(sortOrder, setLatestImages, isSortingByComments);

      return unsubscribeLatest;
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
  }, [fetchImages, activeTab]);

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
              <RenderImage
                images={latestImages}
                deviceType={deviceType}
                handlePrevPage={handlePrevPage}
                handleNextPage={handleNextPage}
                handlePageClick={handlePageClick}
                currentPage={currentPage}
                totalImages={totalImages}
                ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                paginateImages={paginateImages}
              />
            )}
          </div>
        </div>
      </section>
    </ImageViewStyle>
  );
};

export default ImageView;
