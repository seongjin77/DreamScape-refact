import styled from 'styled-components';

export const Styled = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;

  .MuiInputBase-root {
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: 50px;
    padding: 14px 18px;
    background: var(--white-color);
    border-radius: 15px;
    resize: none;
    outline: none;
    transition: border 0.2 s ease;
    border: 1px solid #d2d2d2;
    &:hover {
      border: 2px solid var(--blue-color);
    }
    fieldset {
      border: none;
    }
  }
`;

export default Styled;
