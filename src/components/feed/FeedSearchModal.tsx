import React, { useState, useEffect } from 'react';

interface FeedSearchModalProps {
  open: boolean;
  onClose: () => void;
  onSearch: (searchTerm: string) => void;
}

const FeedSearchModal: React.FC<FeedSearchModalProps> = ({
  open,
  onClose,
  onSearch
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // 로컬 스토리지에서 최근 검색어 불러오기
  useEffect(() => {
    const savedSearches = localStorage.getItem('feedRecentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // 최근 검색어 저장
  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    
    const updatedSearches = [term, ...recentSearches.filter(s => s !== term)].slice(0, 10);
    setRecentSearches(updatedSearches);
    localStorage.setItem('feedRecentSearches', JSON.stringify(updatedSearches));
  };

  // 검색 실행
  const handleSearch = () => {
    if (searchTerm.trim()) {
      saveRecentSearch(searchTerm.trim());
      onSearch(searchTerm.trim());
      onClose();
    }
  };

  // Enter 키로 검색
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 개별 검색어 삭제
  const removeSearchTerm = (term: string) => {
    const updatedSearches = recentSearches.filter(s => s !== term);
    setRecentSearches(updatedSearches);
    localStorage.setItem('feedRecentSearches', JSON.stringify(updatedSearches));
  };

  // 모든 검색어 삭제
  const clearAllSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('feedRecentSearches');
  };

  // 최근 검색어 클릭
  const handleRecentSearchClick = (term: string) => {
    setSearchTerm(term);
    onSearch(term);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto relative">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fas fa-arrow-left text-xl"></i>
          </button>
          <h2 className="text-lg font-semibold text-gray-800">피드 검색</h2>
          <div className="w-6"></div> {/* 균형을 위한 빈 공간 */}
        </div>

        {/* 검색 입력 */}
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="검색어를 입력해주세요."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#87CEEB] pr-12"
            />
            <button
              onClick={handleSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#87CEEB]"
            >
              <i className="fas fa-search text-lg"></i>
            </button>
          </div>
        </div>

        {/* 최근 검색어 */}
        {recentSearches.length > 0 && (
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-800">최근 검색어</h3>
              <button
                onClick={clearAllSearches}
                className="text-sm text-gray-500 hover:text-red-500"
              >
                모두삭제
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-100 rounded-full px-3 py-2 text-sm"
                >
                  <button
                    onClick={() => handleRecentSearchClick(term)}
                    className="text-gray-700 hover:text-[#87CEEB] mr-2"
                  >
                    {term}
                  </button>
                  <button
                    onClick={() => removeSearchTerm(term)}
                    className="text-gray-400 hover:text-red-500 text-xs"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedSearchModal;
