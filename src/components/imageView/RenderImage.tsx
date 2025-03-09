import { useRef } from 'react';
import { PaginationStyle } from './Styled';
import useModal from '../../hooks/useModal';
import { DetailImageModal } from '../Modal';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface ImageData {
  id: string;
  url: string;
  description: string;
  title: string;
  prompt: string;
  postpassword: string;
  commentCount: number;
}

interface RenderImageProps {
  images: ImageData[];
  deviceType: string;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  handlePageClick: (pageNumber: number) => void;
  currentPage: number;
  totalImages: number;
  ITEMS_PER_PAGE: number;
  paginateImages: (images: ImageData[]) => ImageData[];
}

const RenderImage = ({
  images,
  deviceType,
  handlePrevPage,
  handleNextPage,
  handlePageClick,
  currentPage,
  totalImages,
  ITEMS_PER_PAGE,
  paginateImages,
}: RenderImageProps) => {
  const { openModal } = useModal();
  const sliderRef = useRef<Slider | null>(null);

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

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  const getOptimizedImageUrl = (imageUrl: string) => {
    // 기본 이미지 URL (최대 크기)
    let baseUrl;
    let width;

    switch (deviceType) {
      case 'mobile':
      case 'tablet':
        width = 712; // 태블릿에서 사용할 이미지 너비
        break;
      case 'desktop':
        width = 250; // 데스크탑에서 사용할 이미지 너비
        break;
      default:
        width = 250; // 기본값 (데스크탑)
    }

    // weserv.nl CDN URL에 크기 적용하여 최적화된 이미지 URL 반환
    baseUrl = `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl)}&w=${width}`;

    return baseUrl;
  };

  if (deviceType === 'mobile') {
    return (
      <Slider ref={sliderRef} {...settings}>
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
              src={getOptimizedImageUrl(image.url)}
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
                src={getOptimizedImageUrl(image.url)}
                alt={image.description}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span className="comment-count">{image.commentCount} Comments</span>
            </div>
          ))}
        </div>
        <PaginationStyle>
          <button className="arrow-button" onClick={handlePrevPage} disabled={currentPage === 1}>
            <MdNavigateBefore size={24} />
          </button>
          {Array.from({ length: Math.ceil(totalImages / ITEMS_PER_PAGE) }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageClick(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="arrow-button"
            onClick={handleNextPage}
            disabled={currentPage * ITEMS_PER_PAGE >= totalImages}
          >
            <MdNavigateNext size={24} />
          </button>
        </PaginationStyle>
      </>
    );
  }
};

export default RenderImage;
