import React from 'react';
import { FooterStyle } from './Styled';
import { FaGithub } from 'react-icons/fa6';

const Footer: React.FC = () => {
  return (
    <FooterStyle>
      <div className="footer-wrapper">
        <div className="footer-contents">
          <div className="producer-info">
            {/* 제작자 정보 */}
            <div className="link-area">
              <p>제작자: 김성진</p>
              <a href="https://github.com/seongjin77" target="_blank" rel="noopener noreferrer">
                <FaGithub className="github-icon" /> 깃허브 프로필
              </a>
            </div>
            <div className="link-area">
              <p>제작자: 강규민</p>
              <a href="https://github.com/jattett" target="_blank" rel="noopener noreferrer">
                <FaGithub className="github-icon" /> 깃허브 프로필
              </a>
            </div>
          </div>

          {/* 프로젝트 레포지토리 */}
          <div className="link-area">
            <p>📌 프로젝트 레포지토리</p>
            <a
              className="project-link"
              href="https://github.com/gm-sj/image-ai-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="github-icon" /> GitHub Repository
            </a>
          </div>
        </div>
      </div>
    </FooterStyle>
  );
};

export default Footer;
