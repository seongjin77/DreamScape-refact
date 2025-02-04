import React from 'react';
import { FooterStyle } from './Styled';

const Footer: React.FC = () => {
  return (
    <FooterStyle>
      <footer className="footer-wrraper">
        <div className="footer-contents">
          <div className="link-area">
            <p>support@artguru.ai</p>
            <p>© 2024 All Rights Reserved</p>
          </div>
        </div>
      </footer>
    </FooterStyle>
  );
};

export default Footer;
