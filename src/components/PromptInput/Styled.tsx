import styled from 'styled-components';

export const PromptInputStyle = styled.div<{ deviceType: string }>`
  width: 100%;
  .input-contents-wrapper {
    display: flex;
    flex-direction: ${(props) => (props.deviceType === 'mobile' ? 'column' : 'row')};
    gap: 20px;
    width: 100%;
    padding: 20px 0;
    justify-content: center;
    align-items: center;
    textarea {
      box-sizing: border-box;
      position: relative;
      width: 100%;
      height: 100px;
      padding: 14px 18px;
      background: var(--white-color);
      outline: 1px solid #d2d2d2;
      border-radius: 15px;
      resize: none;
      transition: border 0.2 s ease;
      border: none;
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
    button {
      position: relative;
      overflow: hidden;
      border: none;
      display: flex;
      justify-content: center;
      align-items: center;
      width: ${(props) => (props.deviceType === 'mobile' ? '100%' : '182px')};
      height: ${(props) => (props.deviceType === 'mobile' ? '50px' : '100px')};
      margin: 0 auto;
      background: var(--blue-color);
      border-radius: 15px;
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      z-index: 1;
      transition: 0.3s ease-in;
      &:hover {
        transform: scale(1.05);
      }
    }
  }
`;
