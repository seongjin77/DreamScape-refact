import React, { useState, useEffect, useCallback } from 'react';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import Styled from './Styled';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = '제목이나 프롬프트를 입력하세요',
}) => {
  const [query, setQuery] = useState('');

  // 입력값 변경 핸들러
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  }, []);

  // 입력 초기화 핸들러
  const handleClear = useCallback(() => {
    setQuery('');
    onSearch('');
  }, [onSearch]);

  // 실시간 검색 실행 (디바운스 적용)
  useEffect(() => {
    const delay = setTimeout(() => {
      onSearch(query);
    }, 300); // 300ms 지연 후 검색 실행 (너무 자주 호출되는 것을 방지)

    return () => clearTimeout(delay); // 입력이 계속될 경우 이전 검색 요청 취소
  }, [query, onSearch]);

  return (
    <Styled>
      <TextField
        variant="outlined"
        fullWidth
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: query && (
            <InputAdornment position="end">
              <IconButton onClick={handleClear} size="small">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Styled>
  );
};

export default SearchBar;
