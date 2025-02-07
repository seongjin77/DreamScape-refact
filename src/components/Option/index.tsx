import React, { useState } from 'react';
import { OptionStyld } from './Styled';
import { CircularProgress } from '@mui/material';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface OptionProps {
  onPromptGenerated: (prompt: string) => void;
}

const Option: React.FC<OptionProps> = ({ onPromptGenerated }) => {
  const [loading, setLoading] = useState(false);

  const fetchPromptFromGoogleAI = async () => {
    const API_KEY = '';

    if (!API_KEY) {
      console.error('API 키가 설정되지 않았습니다.');
      onPromptGenerated('프롬프트를 불러올 수 없습니다.');
      return;
    }

    setLoading(true); // 로딩 상태 시작
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-exp',
      });

      const prompt =
        'Make a short and creative prompt for AI image generation. Provide only the prompt text in Korean, without any additional formatting or labels.';
      const result = await model.generateContent(prompt);

      const generatedPrompt = result.response.text();
      console.log('추천 프롬프트:', generatedPrompt);

      onPromptGenerated(generatedPrompt);
    } catch (error) {
      const fallbackPrompt = '프롬프트를 불러올 수 없습니다.';
      console.error('Google Generative AI 오류:', error);
      console.log(fallbackPrompt);

      onPromptGenerated(fallbackPrompt);
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  return (
    <OptionStyld>
      <div className="option-wrapper">
        <button
          className="select-item img-upload"
          onClick={fetchPromptFromGoogleAI}
          disabled={loading}
        >
          <span>{loading ? <CircularProgress size={20} color="inherit" /> : '프롬프트 추천'}</span>
        </button>
      </div>
    </OptionStyld>
  );
};

export default Option;
