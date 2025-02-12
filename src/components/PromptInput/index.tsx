import React, { useState, useEffect, useCallback } from 'react';
import { PromptInputStyle } from './Styled';
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

  useEffect(() => {
    if (generatedPrompt && generatedPrompt !== prompt) {
      setPrompt(generatedPrompt);
    }
  }, [generatedPrompt]);

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
    if (!prompt.trim()) return;

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
        handleSubmitButton();
      } else if (e.key === 'Enter' && e.ctrlKey) {
        setPrompt((prev) => prev + '\n');
      }
    },
    [handleSubmitButton],
  );

  return (
    <PromptInputStyle deviceType={deviceType}>
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
          disabled={!prompt.trim()}
          style={{
            opacity: !prompt.trim() ? 0.5 : 1,
            cursor: !prompt.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          생성하기
        </button>
      </div>
    </PromptInputStyle>
  );
};

export default PromptInput;
