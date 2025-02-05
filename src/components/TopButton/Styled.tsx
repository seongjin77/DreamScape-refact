import styled from 'styled-components';

export const TopButtonStyle = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background-color: var(--blue-color);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.3s ease-in-out,
    transform 0.3s ease-in-out;

  &.visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  &:hover {
    background-color: #1565c0;
  }
`;
