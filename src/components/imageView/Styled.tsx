import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const borderExpandAnimation = keyframes`
  from {
    border-width: 0;
  }
  to {
    border-width: 2px; 
  }
`;

export const ImageViewStyle = styled.div<{ deviceType: string }>`
  width: 100%;
  .grid-section {
    padding-top: ${(props) => (props.deviceType === 'mobile' ? '10px' : '20px')};
    .tab-menu {
      width: 100%;
      max-width: 1200px;

      .tabs {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        border-bottom: 2px solid var(--gray-color);
        margin-bottom: 20px;
        gap: ${(props) => (props.deviceType === 'mobile' ? '20px' : '100px')};

        .tab-link {
          padding: 10px 5px;
          border: none;
          background: none;
          color: rgba(0, 0, 0, 0.4);
          cursor: pointer;
          font-size: 14px;
          transition: color 0.7s ease;
          border-bottom: 0px solid transparent;

          &.active {
            border-bottom: 2px solid var(--blue-color);
            font-weight: bold;
            color: var(--blue-color);
            border-bottom-color: currentColor;
            animation: ${borderExpandAnimation} 0.3s ease-out forwards;
          }
        }
      }

      .tab-content {
        margin: 0 auto;
        text-align: center;
        .grid-container {
          display: ${(props) => (props.deviceType === 'mobile' ? '' : 'grid')};
          gap: 16px;
          max-width: 100%;
          grid-template-columns: repeat(4, 1fr);
          height: auto;
          margin: 0 auto;
        }

        /* 그리드 아이템 스타일 */
        .grid-item {
          background-color: var(--gray-color);
          border-radius: 12px;
          height: 250px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s;
          cursor: pointer;
          position: relative;
          animation: ${fadeIn} 2s ease-in-out;

          &:hover {
            transform: scale(1.05);
            span {
              opacity: 1;
            }
          }
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.4);
            transition: transform 0.5s ease;
            border-radius: 15px;
            z-index: 0;
            transform: translateY(200%);
            transform-origin: bottom;
          }
          &:hover::before {
            transform: translateY(0);
          }
          span {
            width: fit-content;
            position: absolute;
            bottom: 10px;
            right: 10px;
            color: white;
            background: rgba(0, 0, 0, 0.6);
            padding: 5px 10px;
            border-radius: 10px;
            font-size: 14px;
            font-weight: bold;
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
            z-index: 1;
          }
          .comment-count {
            top: 10px;
            right: 10px;
            bottom: inherit;
          }
          .file-size {
            bottom: 10px;
            left: 10px;
          }
        }
      }
    }
  }
  /* 슬라이드 코드 */
  .slick-prev {
    z-index: 1;
    left: -10px;
    width: 28px;
    height: 28px;
    background-color: var(--white-color);
    border-radius: 50%;
    &::before {
      color: var(--skyblue-color);
      font-size: 35px;
      position: relative;
      left: -3px;
    }
  }
  .slick-next {
    z-index: 1;
    right: -10px;
    width: 28px;
    height: 28px;
    background-color: var(--white-color);
    border-radius: 50%;
    &::before {
      color: var(--skyblue-color);
      font-size: 35px;
      position: relative;
      left: -3px;
    }
  }
  .slick-list {
    border-radius: 20px;
    .slick-track {
      .slick-slide {
        border-radius: 20px;
        &:first-child {
          margin-left: 0px;
        }
        &:last-child {
          margin-right: 0px;
        }
      }
    }
  }
`;

export const PaginationStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 30px;

  button {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px 5px;
    font-size: 16px;
    border: none;
    background-color: var(--blue-color);
    color: white;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s ease-in-out;
    border-radius: 50%;

    &:hover {
      background-color: #1565c0;
    }

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }

  span {
    font-size: 18px;
    font-weight: bold;
    color: var(--blue-color);
  }
`;
