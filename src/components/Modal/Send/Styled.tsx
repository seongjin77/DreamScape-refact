import styled from 'styled-components';

export const ModalWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const ModalContent = styled.div<{
  openSideModal: boolean;
  deviceType: string;
}>`
  background-color: rgb(39, 39, 42);
  border-radius: 20px;
  padding: 40px 30px;
  height: ${(props) => (props.deviceType === 'mobile' ? '100vh' : 'calc(100vh - 50px)')};
  max-width: ${(props) => (props.deviceType === 'mobile' ? 'initial' : '650px')};
  width: ${(props) => {
    switch (props.deviceType) {
      case 'mobile':
        return '100vw';
      case 'tablet':
        return '100vw';
      case 'desktop':
      default:
        return '40vw';
    }
  }};
  box-shadow: ${({ openSideModal }) => (openSideModal ? '0' : '0 4px 10px rgba(0, 0, 0, 0.3)')};
  border-radius: ${({ openSideModal }) => (openSideModal ? '20px 0 0 20px' : '20px')};
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.3s ease-in;
  z-index: 2;
  transform: ${({ openSideModal, deviceType }) => {
    switch (deviceType) {
      case 'mobile':
      case 'tablet':
        return 'translate(0%, 0%)';
      case 'desktop':
        return openSideModal ? 'translate(-50%, 0%)' : 'translate(0%, 0%)';
      default:
        return 'translate(0%, 0%)';
    }
  }};
  &.mobile-modal {
    border-radius: initial;
    transform: translate(0%, 0%);
  }

  position: absolute;
  .modal-contents {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    .modal-img-contents {
      display: flex;
      height: 100%;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      img {
        max-width: 100%;
        max-height: 60vh;
        height: auto;
      }
    }
    .modal-footer {
      margin-top: 20px;
      .contents-text {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        color: var(--white-color);
        line-height: 1.3;
        p {
          font-size: 16px;
          font-weight: 700;
        }
      }
      .model-btn-wrapeer {
        display: flex;
        gap: 20px;
        padding: 20px;
        justify-content: center;

        & > button {
          width: 140px;
          height: 36px;
          font-size: ${(props) => (props.deviceType === 'mobile' ? '12px' : '14px')};
        }

        .close-btn {
          background-color: var(--white-color);
          color: var(--black-color);
        }
      }
    }
  }
`;

export const CommentModalStyle = styled.div<{
  openSideModal: boolean;
  deviceType: string;
}>`
  flex-shrink: 0;
  height: ${(props) => {
    switch (props.deviceType) {
      case 'mobile':
        return '80vh';
      case 'tablet':
        return '80vh';
      case 'desktop':
      default:
        return 'calc(100vh - 50px)';
    }
  }};
  max-width: ${(props) => (props.deviceType === 'mobile' ? 'initial' : '650px')};
  width: ${(props) => {
    switch (props.deviceType) {
      case 'mobile':
        return '100vw';
      case 'tablet':
        return '100vw';
      case 'desktop':
      default:
        return '40vw';
    }
  }};
  background-color: rgb(39, 39, 42);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: ${({ openSideModal, deviceType }) => {
    switch (deviceType) {
      case 'mobile':
        return '0';
      case 'tablet':
        return '20px';
      case 'desktop':
        return openSideModal ? '0 20px 20px 0' : '20px';
      default:
        return '20px';
    }
  }};
  align-items: center;
  padding: 40px 30px;
  box-shadow: ${({ openSideModal }) => (openSideModal ? '0' : '0 4px 10px rgba(0, 0, 0, 0.3)')};
  transition: 0.3s ease-in;
  position: absolute;
  transform: ${({ openSideModal, deviceType }) => {
    switch (deviceType) {
      case 'mobile':
      case 'tablet':
        return 'translate(0%, 0%)';
      case 'desktop':
        return openSideModal ? 'translate(50%, 0%)' : 'translate(0%, 0%)';
      default:
        return 'translate(0%, 0%)';
    }
  }};
  z-index: ${({ deviceType, openSideModal }) => {
    if (deviceType === 'tablet' && openSideModal) {
      return '3';
    }
    return '1';
  }};
  opacity: ${({ deviceType, openSideModal }) => {
    switch (deviceType) {
      case 'tablet':
        return openSideModal ? '1' : '0';
      default:
        return '1';
    }
  }};
  &.mobile-modal {
    border-radius: 15px 15px 0 0;
    transform: ${({ openSideModal }) =>
      openSideModal ? 'translate(0%, 0%);' : 'translate(0%, 100%);'} !important;
    bottom: 0;
    z-index: 3;
  }

  .introduce {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    color: var(--white-color);
    p {
      font-size: 21px;
      font-weight: 700;
    }
    .small {
      font-size: 16px;
      font-weight: 500;
    }
  }
  .info-area {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    height: 100%;
    .form {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%;
      height: auto;
      &.large-form {
        height: 100%;
      }
      label {
        font-size: 14px;
        color: var(--white-color);
        font-weight: bold;
      }
      .title-input {
        box-sizing: border-box;
        position: relative;
        width: 100%;
        height: 50px;
        padding: 14px 18px;
        background: var(--white-color);
        border: none;
        border-radius: 15px;
        resize: none;
        outline: 1px solid #d2d2d2;
        transition: border 1s ease;
        font-size: 16px;
        &::placeholder {
          font-size: 14px;
        }
        &:hover {
          outline: 2px solid var(--blue-color);
        }
        &:focus {
          outline: 2px solid var(--blue-color);
        }
      }
      .description-area {
        box-sizing: border-box;
        position: relative;
        width: 100%;
        height: 100%;
        padding: 14px 18px;
        background: var(--white-color);
        border: none;
        border-radius: 15px;
        resize: none;
        outline: 1px solid #d2d2d2;
        transition: border 1s ease;
        font-size: 16px;
        &::placeholder {
          font-size: 14px;
        }
        &:hover {
          outline: 2px solid var(--blue-color);
        }
        &:focus {
          outline: 2px solid var(--blue-color);
        }
      }
    }
  }
  .btn-area {
    width: 100%;
    display: flex;
    align-items: center;
    padding-top: 20px;
    flex-direction: ${(props) => (props.deviceType === 'mobile' || 'tablet' ? 'row' : 'column')};
    gap: 20px;
    .back-btn {
      position: relative;
      overflow: hidden;
      border: none;
      width: 100%;
      height: 6vh;
      background: linear-gradient(to top, var(--white-color) 0%, var(--gray-color) 100%);
      border-radius: 15px;
      color: var(--black-color);
      font-size: 18px;
      cursor: pointer;
      z-index: 1;

      &:hover::before {
        transform: scaleY(0);
      }
    }
    .upload-btn {
      position: relative;
      overflow: hidden;
      border: none;
      width: 100%;
      height: 6vh;
      background: var(--blue-color);
      border-radius: 10px;
      color: #fff;
      font-size: 18px;
      cursor: pointer;
      z-index: 1;
      transition: 0.3s ease-in;

      &:hover {
        background-color: #1565c0;
      }
    }
  }
`;
