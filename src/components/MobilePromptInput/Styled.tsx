import styled from 'styled-components';

export const PromptInputStyle = styled.div<{
  deviceType: string;
  isVisible: boolean;
  isCollapsed: boolean;
}>`
  position: fixed;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  max-width: 640px;
  width: 100%;
  background-color: rgba(182, 182, 182, 0.6);
  border-radius: 15px;
  transition: 0.5s;
  opacity: ${(props) => (props.isVisible && !props.isCollapsed ? '1' : '0')};
  visibility: ${(props) => (props.isVisible && !props.isCollapsed ? 'visible' : 'hidden')};
  height: ${(props) => (props.isCollapsed ? '0' : 'auto')};
  overflow: hidden;

  .input-contents-wrapper {
    display: flex;
    flex-direction: row;
    gap: 10px;
    width: 100%;
    padding: ${(props) => (props.isCollapsed ? '0' : '10px')};
    justify-content: center;
    align-items: center;
    transition: padding 0.3s ease-in-out;

    textarea {
      box-sizing: border-box;
      width: 100%;
      height: ${(props) => (props.isCollapsed ? '0' : '50px')};
      padding: ${(props) => (props.isCollapsed ? '0' : '14px 18px')};
      background: var(--white-color);
      border: 2px solid var(--skyblue-color);
      border-radius: 15px;
      resize: none;
      outline: none;
      transition:
        height 0.3s ease-in-out,
        padding 0.3s ease-in-out;
      visibility: ${(props) => (props.isCollapsed ? 'hidden' : 'visible')};

      &::placeholder {
        font-size: ${(props) => (props.deviceType === 'mobile' ? '12px' : '14px')};
      }

      &:focus {
        border: 2px solid var(--blue-color);
      }
    }

    button {
      position: relative;
      overflow: hidden;
      border: none;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 80px;
      height: 50px;
      background: var(--blue-color);
      border-radius: 15px;
      color: #fff;
      font-size: 14px;
      cursor: pointer;
      transition: background 0.3s ease-in-out;
    }
  }
`;

/* 오른쪽 상단의 펼치기/접기 버튼 */
export const ToggleButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: var(--blue-color);
  color: white;
  border: none;
  padding: 10px;
  border-radius: 10%;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: background 0.3s ease-in-out;

  &:hover {
    background-color: #1565c0;
  }

  svg {
    vertical-align: middle;
  }
`;
