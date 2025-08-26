import { EventType, EventStatus, EventRewardDto, EventForm } from '../types/event';

// 날짜 포맷팅 함수
export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '날짜 없음';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    return '날짜 오류';
  }
};

// 이벤트 타입 텍스트 변환
export const getEventTypeText = (type: EventType): string => {
  switch (type) {
    case 'BATTLE':
      return '배틀';
    case 'MISSION':
      return '미션';
    case 'MULTIPLE':
      return '다수참여';
    case 'REVIEW':
      return '리뷰';
    case 'CHALLENGE':
      return '챌린지';
    default:
      return '기타';
  }
};

// 이벤트 상태 텍스트 변환
export const getEventStatusText = (status: EventStatus): string => {
  switch (status) {
    case 'UPCOMING':
      return '예정';
    case 'ONGOING':
      return '진행중';
    case 'ENDED':
      return '종료';
    default:
      return '알 수 없음';
  }
};

// 이벤트 타입 색상 반환
export const getEventTypeColor = (type: EventType): string => {
  switch (type) {
    case 'BATTLE':
      return 'bg-red-500';
    case 'MISSION':
      return 'bg-green-500';
    case 'MULTIPLE':
      return 'bg-purple-500';
    case 'REVIEW':
      return 'bg-blue-500';
    case 'CHALLENGE':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
};

// 이벤트 상태 색상 반환
export const getEventStatusColor = (status: EventStatus): string => {
  switch (status) {
    case 'UPCOMING':
      return 'bg-blue-500';
    case 'ONGOING':
      return 'bg-green-500';
    case 'ENDED':
      return 'bg-gray-500';
    default:
      return 'bg-gray-400';
  }
};

// 이벤트 폼 유효성 검사
export const validateEventForm = (form: EventForm): string[] => {
  const errors: string[] = [];

  if (!form.title.trim()) {
    errors.push('이벤트 제목을 입력해주세요.');
  }

  if (!form.type) {
    errors.push('이벤트 유형을 선택해주세요.');
  }

  if (!form.eventStartDate) {
    errors.push('이벤트 시작일을 선택해주세요.');
  }

  if (!form.eventEndDate) {
    errors.push('이벤트 종료일을 선택해주세요.');
  }

  if (!form.purchaseStartDate) {
    errors.push('구매 시작일을 선택해주세요.');
  }

  if (!form.purchaseEndDate) {
    errors.push('구매 종료일을 선택해주세요.');
  }

  if (!form.announcementDate) {
    errors.push('발표일을 선택해주세요.');
  }

  if (!form.description.trim()) {
    errors.push('이벤트 설명을 입력해주세요.');
  }

  if (!form.participationMethod.trim()) {
    errors.push('참여 방법을 입력해주세요.');
  }

  if (!form.selectionCriteria.trim()) {
    errors.push('선정 기준을 입력해주세요.');
  }

  if (!form.precautions.trim()) {
    errors.push('주의사항을 입력해주세요.');
  }

  if (form.maxParticipants <= 0) {
    errors.push('최대 참여자 수는 1명 이상이어야 합니다.');
  }

  if (form.rewards.length === 0) {
    errors.push('보상 정보를 입력해주세요.');
  }

  // 날짜 유효성 검사
  const startDate = new Date(form.eventStartDate);
  const endDate = new Date(form.eventEndDate);
  const purchaseStartDate = new Date(form.purchaseStartDate);
  const purchaseEndDate = new Date(form.purchaseEndDate);
  const announcementDate = new Date(form.announcementDate);

  if (endDate <= startDate) {
    errors.push('이벤트 종료일은 시작일보다 늦어야 합니다.');
  }

  if (purchaseEndDate <= purchaseStartDate) {
    errors.push('구매 종료일은 시작일보다 늦어야 합니다.');
  }

  if (announcementDate <= endDate) {
    errors.push('발표일은 이벤트 종료일보다 늦어야 합니다.');
  }

  return errors;
};

// 에러 메시지 생성
export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return '알 수 없는 오류가 발생했습니다.';
};

// 이벤트 보상 문자열 변환
export const rewardsToString = (rewards: EventRewardDto[]): string => {
  return rewards.map(reward => reward.reward).join('\n');
};

// 문자열을 이벤트 보상 배열로 변환
export const stringToRewards = (rewardsString: string): EventRewardDto[] => {
  if (!rewardsString.trim()) return [];
  
  return rewardsString.split('\n')
    .filter(line => line.trim())
    .map((line, index) => ({
      conditionValue: String(index + 1),
      reward: line.trim()
    }));
};

// 날짜를 YYYY-MM-DD 형식으로 변환 (백엔드용)
export const toLocalDateString = (dateTimeStr: string): string => {
  if (!dateTimeStr) return '';
  try {
    const date = new Date(dateTimeStr);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0]; // YYYY-MM-DD 형식
  } catch (error) {
    return '';
  }
};

// 날짜를 datetime-local 형식으로 변환
export const toDatetimeLocal = (str: string | undefined): string => {
  if (!str) return '';
  try {
    const date = new Date(str);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().slice(0, 16);
  } catch (error) {
    return '';
  }
};
