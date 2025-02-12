import React, { useState, useEffect, useCallback } from 'react';
import { PromptInputStyle, ToggleButton } from './Styled';
import SendImage from '../Modal/Send';
import useModal from '../../hooks/useModal';
import { useDeviceType } from '../../hooks/useDeviceType';

interface PromptInputProps {
  generatedPrompt?: string;
}

const PromptInput: React.FC<PromptInputProps> = ({ generatedPrompt = '' }) => {
  const [prompt, setPrompt] = useState<string>(generatedPrompt);
  const { deviceType } = useDeviceType();
  const { openModal } = useModal();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  useEffect(() => {
    if (generatedPrompt && generatedPrompt !== prompt) {
      setPrompt(generatedPrompt);
    }
  }, [generatedPrompt]);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const fetchImage = async (setImageUrl: (url: string) => void): Promise<void> => {
    try {
      const response = await fetch(
        `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`,
      );
      if (!response.ok) throw new Error('Failed to fetch image');
      const url = response.url;
      setImageUrl(url);
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  const handleSubmitButton = useCallback((): void => {
    if (!prompt.trim()) return; // ✅ 빈 값일 경우 실행하지 않음
    openModal({
      id: 'SendImageModal',
      component: <SendImage fetchImage={fetchImage} deviceType={deviceType} prompt={prompt} />,
    });
  }, [prompt, openModal, fetchImage, deviceType]);

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  }, []);

  const handleTextareaKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.ctrlKey) {
        e.preventDefault();
        if (prompt.trim()) handleSubmitButton();
      } else if (e.key === 'Enter' && e.ctrlKey) {
        setPrompt((prev) => prev + '\n');
      }
    },
    [handleSubmitButton],
  );

  const handleToggleButtonClick = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  return (
    <>
      <PromptInputStyle deviceType={deviceType} isVisible={isVisible} isCollapsed={isCollapsed}>
        {!isCollapsed && (
          <div className="input-contents-wrapper">
            <textarea
              value={prompt}
              onChange={handleTextareaChange}
              onKeyDown={handleTextareaKeyDown}
              placeholder="AI가 생성할 내용에 대한 설명을 입력하세요"
            />
            <button
              onClick={handleSubmitButton}
              type="button"
              disabled={!prompt.trim()} // ✅ 입력값 없으면 비활성화
            >
              생성하기
            </button>
          </div>
        )}
      </PromptInputStyle>

      <ToggleButton isVisible={isVisible} onClick={handleToggleButtonClick}>
        {isCollapsed ? '이미지 생성창 펼치기' : '생성창 접기'}
      </ToggleButton>
    </>
  );
};

export default PromptInput;
