import styled from 'styled-components';

export const FooterStyle = styled.div`
  width: 100%;
  .footer-wrraper {
    margin-top: 30px;
    height: 100%;
    min-height: 150px;
    padding: 15px 20px;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    .footer-contents {
      width: 100%;
      max-width: 1080px;
      color: var(--white-color);
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      p {
        text-align: center;
      }
    }
  }
`;
