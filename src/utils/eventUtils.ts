import { EventType, EventRewardDto } from '../types/event';

/**
 * 이벤트 타입을 한글 텍스트로 변환
 */
export const getEventTypeText = (type: EventType): string => {
  switch (type) {
    case "BATTLE":
      return "배틀";
    case "MISSION":
      return "미션";
    case "MULTIPLE":
      return "랭킹";
    case "REVIEW":
      return "리뷰";
    case "CHALLENGE":
      return "챌린지";
    default:
      return type;
  }
};

/**
 * 이벤트 상태를 한글 텍스트로 변환
 */
export const getEventStatusText = (status: string): string => {
  switch (status) {
    case 'UPCOMING':
      return '예정';
    case 'ONGOING':
      return '진행중';
    case 'ENDED':
      return '완료';
    default:
      return '알 수 없음';
  }
};

/**
 * 이벤트 타입에 대한 색상 클래스 반환
 */
export const getEventTypeColor = (type: string): string => {
  switch (type) {
    case 'BATTLE':
      return 'bg-purple-600 text-white';
    case 'MISSION':
      return 'bg-orange-600 text-white';
    case 'MULTIPLE':
      return 'bg-pink-600 text-white';
    case 'REVIEW':
      return 'bg-green-600 text-white';
    case 'CHALLENGE':
      return 'bg-red-600 text-white';
    default:
      return 'bg-gray-600 text-white';
  }
};

/**
 * 이벤트 상태에 대한 색상 클래스 반환
 */
export const getEventStatusColor = (status: string): string => {
  switch (status) {
    case 'UPCOMING':
      return 'bg-blue-600 text-white';
    case 'ONGOING':
      return 'bg-green-600 text-white';
    case 'ENDED':
      return 'bg-gray-600 text-white';
    default:
      return 'bg-gray-600 text-white';
  }
};

/**
 * 날짜를 YYYY.MM.DD 형식으로 포맷팅
 */
export const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '-';
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  } catch (error) {
    return '-';
  }
};

/**
 * 날짜를 YYYY-MM-DD 형식으로 변환 (백엔드용)
 */
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

/**
 * 날짜를 datetime-local 형식으로 변환
 */
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

/**
 * 문자열 rewards를 EventRewardDto[]로 변환
 */
export const parseRewardsString = (rewardsString: string): EventRewardDto[] => {
  try {
    const lines = rewardsString.split('\n').filter(line => line.trim());
    return lines.map((line, index) => ({
      conditionValue: String(index + 1),
      reward: line.trim()
    }));
  } catch (error) {
    console.error('rewards 파싱 실패:', error);
    return [];
  }
};

/**
 * EventRewardDto[]를 문자열로 변환
 */
export const stringifyRewards = (rewards: EventRewardDto[]): string => {
  return rewards.map(reward => reward.reward).join('\n');
};

/**
 * 이벤트 폼 유효성 검사
 */
export const validateEventForm = (form: {
  title: string;
  description: string;
  purchaseStartDate: string;
  purchaseEndDate: string;
  eventStartDate: string;
  eventEndDate: string;
  announcementDate: string;
  participationMethod: string;
  selectionCriteria: string;
  precautions: string;
  maxParticipants: number;
  rewards: EventRewardDto[];
}): string[] => {
  const errors: string[] = [];

  if (!form.title.trim()) {
    errors.push("이벤트 제목을 입력해주세요.");
  }

  if (!form.description.trim()) {
    errors.push("이벤트 설명을 입력해주세요.");
  }

  if (!form.purchaseStartDate) {
    errors.push("구매 시작일을 설정해주세요.");
  }

  if (!form.purchaseEndDate) {
    errors.push("구매 종료일을 설정해주세요.");
  }

  if (!form.eventStartDate) {
    errors.push("이벤트 시작일을 설정해주세요.");
  }

  if (!form.eventEndDate) {
    errors.push("이벤트 종료일을 설정해주세요.");
  }

  if (!form.announcementDate) {
    errors.push("발표일을 설정해주세요.");
  }

  if (!form.participationMethod.trim()) {
    errors.push("참여 방법을 입력해주세요.");
  }

  if (!form.selectionCriteria.trim()) {
    errors.push("선정 기준을 입력해주세요.");
  }

  if (!form.precautions.trim()) {
    errors.push("주의사항을 입력해주세요.");
  }

  if (form.maxParticipants < 1) {
    errors.push("최대 참가자 수는 1명 이상이어야 합니다.");
  }

  // 보상 데이터 검증
  if (form.rewards.length === 0) {
    errors.push("최소 1개의 보상이 필요합니다.");
  } else {
    for (let i = 0; i < form.rewards.length; i++) {
      const reward = form.rewards[i];
      if (!reward.conditionValue || !reward.conditionValue.trim()) {
        errors.push(`${i + 1}번째 보상의 조건값을 입력해주세요.`);
      }
      if (!reward.reward || !reward.reward.trim()) {
        errors.push(`${i + 1}번째 보상의 내용을 입력해주세요.`);
      }
    }
  }

  // 날짜 유효성 검사
  const purchaseStart = new Date(form.purchaseStartDate);
  const purchaseEnd = new Date(form.purchaseEndDate);
  const eventStart = new Date(form.eventStartDate);
  const eventEnd = new Date(form.eventEndDate);
  const announcement = new Date(form.announcementDate);

  if (purchaseEnd <= purchaseStart) {
    errors.push("구매 종료일은 시작일보다 늦어야 합니다.");
  }

  if (eventEnd <= eventStart) {
    errors.push("이벤트 종료일은 시작일보다 늦어야 합니다.");
  }

  if (purchaseEnd < eventStart) {
    errors.push("구매 종료일은 이벤트 시작일보다 이전이어야 합니다.");
  }

  if (eventEnd <= purchaseEnd) {
    errors.push("이벤트 종료일은 구매 종료일 이후여야 합니다.");
  }

  if (eventEnd >= announcement) {
    errors.push("결과 발표일은 이벤트 종료일 이후여야 합니다.");
  }

  return errors;
};

/**
 * 에러 메시지 생성
 */
export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  } else if (error.response?.status === 400) {
    return "입력 데이터가 올바르지 않습니다. 모든 필수 항목을 확인해주세요.";
  } else if (error.response?.status === 401) {
    return "로그인이 필요하거나 권한이 없습니다.";
  } else if (error.response?.status === 403) {
    return "관리자 권한이 필요합니다.";
  } else if (error.response?.status >= 500) {
    return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
  return "알 수 없는 오류가 발생했습니다.";
};
