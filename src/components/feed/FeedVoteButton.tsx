import React, { useState, useEffect } from "react";
import FeedService from "../../api/feedService";

interface FeedVoteButtonProps {
  feedId: number;
  feedType: string;
  participantVoteCount: number;
  onVoteSuccess?: (voteCount: number) => void;
  onVoteError?: (error: any) => void;
}

const FeedVoteButton: React.FC<FeedVoteButtonProps> = ({
  feedId,
  feedType,
  participantVoteCount,
  onVoteSuccess,
  onVoteError,
}) => {
  const [voted, setVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(participantVoteCount);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 초기 투표 상태 확인
  useEffect(() => {
    const checkVoteStatus = async () => {
      try {
        const hasVoted = await FeedService.hasVoted(feedId);
        setVoted(hasVoted);
      } catch (error) {
        console.error('투표 상태 확인 실패:', error);
      }
    };

    checkVoteStatus();
  }, [feedId]);

  // participantVoteCount prop이 변경될 때 voteCount 업데이트
  useEffect(() => {
    setVoteCount(participantVoteCount);
  }, [participantVoteCount]);

  const handleVote = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const result = await FeedService.voteFeed(feedId, { eventId: feedId });
      
      // 투표 완료 후 상태 재확인
      try {
        const hasVoted = await FeedService.hasVoted(feedId);
        setVoted(hasVoted);
        console.log(`투표 후 상태 재확인: ${hasVoted}`);
      } catch (error) {
        console.error('투표 상태 재확인 실패:', error);
        // 백업으로 API 응답 사용
        setVoted(result.voted);
      }
      
      // 투표 수 업데이트
      setVoteCount(result.voteCount);
      
      // 성공 콜백 호출
      if (onVoteSuccess) {
        onVoteSuccess(result.voteCount);
      }
      
      setShowVoteModal(false);
      
      // 추가로 최신 투표 수 조회
      try {
        const latestVoteCount = await FeedService.getVoteCount(feedId);
        setVoteCount(latestVoteCount);
        if (onVoteSuccess) {
          onVoteSuccess(latestVoteCount);
        }
      } catch (error) {
        console.error('투표 수 업데이트 실패:', error);
      }
    } catch (error: any) {
      console.error('투표 실패:', error);
      
      // 에러 메시지 설정
      const errorMsg = error.response?.data?.message || '투표에 실패했습니다.';
      setErrorMessage(errorMsg);
      
      // 에러 콜백 호출
      if (onVoteError) {
        onVoteError(error);
      }
      
      // 3초 후 에러 메시지 제거
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  // 이벤트가 아니면 버튼을 숨김
  if (feedType !== 'EVENT') {
    return null;
  }

  return (
    <>
      <button
        className={`mt-3 w-full py-2 rounded-lg font-medium transition ${
          voted 
            ? 'bg-green-500 text-white hover:bg-green-600' 
            : 'bg-[#87CEEB] text-white hover:bg-blue-400'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setShowVoteModal(true);
        }}
        disabled={loading}
      >
        <i className={`fas ${voted ? 'fa-check' : 'fa-vote-yea'} mr-1`}></i>
        {voted ? '투표 완료' : '투표하기'} ({voteCount})
      </button>

      {/* 투표 확인 모달 */}
      {showVoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">투표 확인</h3>
            <p className="text-gray-600 mb-6">
              이 이벤트에 투표하시겠습니까?
            </p>
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {errorMessage}
              </div>
            )}
            <div className="flex space-x-3">
              <button
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                onClick={() => setShowVoteModal(false)}
                disabled={loading}
              >
                취소
              </button>
              <button
                className="flex-1 bg-[#87CEEB] text-white py-2 rounded-lg hover:bg-blue-400 transition"
                onClick={handleVote}
                disabled={loading}
              >
                {loading ? '처리중...' : '투표하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedVoteButton;
