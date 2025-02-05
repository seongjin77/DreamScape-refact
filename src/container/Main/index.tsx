import React, { useState, useEffect } from 'react';
import { MainStyle } from './Styled';
import Headers from '../../components/Header';
import PromptInput from '../../components/PromptInput';
import Option from '../../components/Option';
import ImageView from '../../components/imageView';
import Footer from '../../components/Footer';
import MobilePromptInput from '../../components/MobilePromptInput';

import { useDeviceType } from '../../hooks/useDeviceType';
import SearchBar from '../../components/SeachBar';

const Main: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const { deviceType } = useDeviceType();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handlePromptGenerated = (generatedPrompt: string) => {
    setPrompt(generatedPrompt);
  };

  useEffect(() => {
    const body = document.querySelector('body') as HTMLElement;
    const app = document.querySelector('#root') as HTMLElement;

    if (deviceType === 'mobile') {
      body.style.overflowX = 'hidden';
      app.style.overflowX = 'hidden';
    } else {
      body.style.overflowX = '';
      app.style.overflowX = '';
    }

    return () => {
      body.style.overflowX = '';
      app.style.overflowX = '';
    };
  }, [deviceType]);

  return (
    <MainStyle deviceType={deviceType}>
      <Headers />
      <main>
        <section className="contents">
          <div className="main-title-wrraper">
            <h2>AI 이미지 생성 프로젝트</h2>
            <p>해당 입력칸에 명령어를 입력하여 이미지를 생성해보세요.</p>
          </div>
          <Option onPromptGenerated={handlePromptGenerated} />
          <PromptInput generatedPrompt={prompt} />
          <SearchBar onSearch={setSearchQuery} />

          <ImageView deviceType={deviceType} searchQuery={searchQuery} />
        </section>
      </main>
      <MobilePromptInput />
      <Footer />
    </MainStyle>
  );
};

export default Main;
