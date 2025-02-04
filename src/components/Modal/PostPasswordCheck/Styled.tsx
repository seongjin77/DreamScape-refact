import styled from 'styled-components';

export const ModalContainerStyle = styled.div`
  /* width: 100%;
  height: 100%; */
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 50%;
  top: 50%;
`;

export const ModalContentStyle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  z-index: 5;
  background-color: var(--white-color);
  padding: 20px;
  border-radius: 10px;
  width: 280px;
  height: 250px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.8);
  .MuiInputBase-root {
    margin-top: 15px;
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: 36.5px;
    background: var(--white-color);
    border-radius: 5px;
    resize: none;
    outline: none;
    transition: border 1s ease;
  }
`;
