// 한국 시간으로 날짜 포맷팅
export const formatKoreanDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const koreanTime = new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Seoul'
    }).format(date);
    return koreanTime;
  } catch (error) {
    console.warn('날짜 파싱 실패:', error);
    return dateString; // 파싱 실패 시 원본 반환
  }
};

// 상대적 시간 표시 (예: "3분 전", "1시간 전", "2일 전")
export const formatRelativeTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return '방금 전';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}일 전`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks}주 전`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths}개월 전`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears}년 전`;
  } catch (error) {
    console.warn('상대적 시간 계산 실패:', error);
    return formatKoreanDate(dateString);
  }
};

// 오늘인지 확인
export const isToday = (dateString: string): boolean => {
  try {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  } catch (error) {
    return false;
  }
};

// 어제인지 확인
export const isYesterday = (dateString: string): boolean => {
  try {
    const date = new Date(dateString);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
  } catch (error) {
    return false;
  }
};
