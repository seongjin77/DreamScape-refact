import styled from 'styled-components';

export const OptionStyld = styled.div`
  width: 100%;
  .option-wrapper {
    display: flex;
    flex-direction: row;

    width: 100%;
    justify-content: flex-start;
    align-items: center;
    font-size: 12px;
    .select-item {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      position: relative;
      width: 100px;
      height: 26px;
      gap: 5px;
      font-weight: 700;
      cursor: pointer;

      &.img-upload {
        border: none;
        align-items: center;
        display: flex;
        justify-content: center;
        background: var(--blue-color);
        transition: transform 0.5s ease;
        border-radius: 15px;
        color: var(--white-color);
        cursor: pointer;
        z-index: 1;
        overflow: hidden;
        &:hover {
          transform: scale(1.05);
        }
      }
    }
  }
`;
