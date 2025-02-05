import styled from 'styled-components';

export const FooterStyle = styled.footer`
  background-color: #222;
  color: #fff;
  padding: 20px 0;
  text-align: center;
  font-size: 14px;

  .footer-wrapper {
    max-width: 800px;
    margin: 0 auto;
    padding: 10px;
  }

  .footer-contents {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    .producer-info {
      display: flex;
      gap: 20px;
    }
  }

  .link-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }

  a {
    color: #fff;
    display: flex;
    align-items: center;
    gap: 5px;
    text-decoration: none;
    font-weight: bold;
    transition: color 0.3s ease;

    &:hover {
      color: #ffcc00;
    }
  }

  .github-icon {
    font-size: 18px;
  }

  .project-link {
    margin-top: 15px;
    font-size: 21px;
    padding: 10px 15px;
    border-radius: 8px;
    background-color: #444;
    transition: background 0.3s ease;

    &:hover {
      background-color: #ffcc00;
      color: #222;
    }
  }
`;
