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
  if (!type) return '기타';
  
  const upperType = type.toUpperCase();
  switch (upperType) {
    case 'RANKING':
      return '랭킹';
    case 'BATTLE':
      return '배틀';
    default:
      console.warn('Unknown event type:', type);
      return '기타';
  }
};

// 이벤트 상태 텍스트 변환
export const getEventStatusText = (status: EventStatus): string => {
  if (!status) return '알 수 없음';
  
  const upperStatus = status.toUpperCase();
  switch (upperStatus) {
    case 'UPCOMING':
      return '예정';
    case 'ONGOING':
      return '진행중';
    case 'ENDED':
      return '종료';
    default:
      console.warn('Unknown event status:', status);
      return '알 수 없음';
  }
};

// 이벤트 타입 색상 반환
export const getEventTypeColor = (type: EventType): string => {
  if (!type) return 'bg-gray-500';
  
  const upperType = type.toUpperCase();
  switch (upperType) {
    case 'RANKING':
      return 'bg-yellow-500';
    case 'BATTLE':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

// 이벤트 상태 색상 반환
export const getEventStatusColor = (status: EventStatus): string => {
  if (!status) return 'bg-gray-400';
  
  const upperStatus = status.toUpperCase();
  switch (upperStatus) {
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

// 공통 에러 메시지 처리 함수
export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    if (error.response.data.message.includes("Duplicate entry")) {
      return "이미 존재하는 이벤트입니다. 다른 제목이나 설정으로 다시 시도해주세요.";
    }
    return error.response.data.message;
  } else if (error.response?.status === 400) {
    return "입력 데이터가 올바르지 않습니다. 모든 필수 항목을 확인해주세요.";
  } else if (error.response?.status === 401) {
    return "로그인이 필요하거나 권한이 없습니다.";
  } else if (error.response?.status === 403) {
    return "관리자 권한이 필요합니다.";
  } else if (error.response?.status >= 500) {
    return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  } else if (error.message) {
    return error.message;
  }
  return "알 수 없는 오류가 발생했습니다.";
};

// 공통 FormData 생성 함수
export const createEventFormData = (eventForm: any, imageFile?: File | null): FormData => {
  const formData = new FormData();
  
  // 기본 필드들
  const basicFields = [
    'title', 'type', 'description', 'participationMethod', 
    'selectionCriteria', 'precautions'
  ];
  
  basicFields.forEach(field => {
    if (eventForm[field]) {
      formData.append(field, eventForm[field]);
    }
  });
  
  // 날짜 필드들
  const dateFields = [
    'purchaseStartDate', 'purchaseEndDate', 'eventStartDate', 
    'eventEndDate', 'announcementDate'
  ];
  
  dateFields.forEach(field => {
    if (eventForm[field]) {
      const dateValue = field === 'announcementDate' 
        ? toStartDateTime(eventForm[field])
        : field.includes('End') 
          ? toEndDateTime(eventForm[field])
          : toStartDateTime(eventForm[field]);
      formData.append(field === 'announcementDate' ? 'announcement' : field, dateValue);
    }
  });
  
  // 숫자 필드들
  if (eventForm.maxParticipants) {
    formData.append('maxParticipants', eventForm.maxParticipants.toString());
  }
  
  // 보상 데이터 처리
  if (eventForm.rewards && eventForm.rewards.length > 0) {
    const flattenedRewards = eventForm.rewards.flatMap((group: any) => 
      group.rewards.map((reward: any) => ({
        conditionValue: group.conditionValue,
        rewardType: reward.rewardType,
        rewardValue: reward.rewardValue,
        rewardDescription: reward.rewardDescription
      }))
    );
    formData.append('rewards', JSON.stringify(flattenedRewards));
  }
  
  // 이미지 파일
  if (imageFile) {
    formData.append('image', imageFile);
  }
  
  return formData;
};

// 공통 보상 데이터 변환 함수
export const transformRewardsForBackend = (rewards: any[]): any[] => {
  return rewards.map(rewardGroup => {
    const combinedRewardValue = rewardGroup.rewards.map((reward: any) => {
      const value = reward.rewardType === 'DISCOUNT_COUPON' ? `${reward.rewardValue}%` : reward.rewardValue;
      return `${reward.rewardType}: ${value}`;
    }).join(', ');
    
    return {
      conditionValue: rewardGroup.conditionValue,
      rewardValue: combinedRewardValue
    };
  });
};

// 공통 날짜 유효성 검사 함수
export const validateEventDates = (eventForm: any): string[] => {
  const errors: string[] = [];
  
  try {
    const startDate = new Date(eventForm.eventStartDate);
    const endDate = new Date(eventForm.eventEndDate);
    const purchaseStartDate = new Date(eventForm.purchaseStartDate);
    const purchaseEndDate = new Date(eventForm.purchaseEndDate);
    const announcementDate = new Date(eventForm.announcementDate);
    
    if (endDate <= startDate) {
      errors.push('이벤트 종료일은 시작일보다 늦어야 합니다.');
    }
    
    if (purchaseEndDate <= purchaseStartDate) {
      errors.push('구매 종료일은 시작일보다 늦어야 합니다.');
    }
    
    if (announcementDate <= endDate) {
      errors.push('발표일은 이벤트 종료일보다 늦어야 합니다.');
    }
  } catch (error) {
    errors.push('날짜 형식이 올바르지 않습니다.');
  }
  
  return errors;
};

// 공통 기본 보상 설정 함수
export const getDefaultRewards = (eventType: string): any[] => {
  if (eventType === 'BATTLE') {
    return [
      {
        conditionValue: "1",
        rewards: [
          { rewardType: "BADGE_POINTS", rewardValue: 100, rewardDescription: "100 뱃지점수" },
          { rewardType: "POINTS", rewardValue: 2000, rewardDescription: "2000 포인트" },
          { rewardType: "DISCOUNT_COUPON", rewardValue: 15, rewardDescription: "15% 할인쿠폰" }
        ]
      },
      {
        conditionValue: "participation",
        rewards: [
          { rewardType: "POINTS", rewardValue: 100, rewardDescription: "100 포인트" }
        ]
      }
    ];
  }
  
  return [
    {
      conditionValue: "1",
      rewards: [
        { rewardType: "BADGE_POINTS", rewardValue: 100, rewardDescription: "100 뱃지점수" },
        { rewardType: "POINTS", rewardValue: 2000, rewardDescription: "2000 포인트" },
        { rewardType: "DISCOUNT_COUPON", rewardValue: 15, rewardDescription: "15% 할인쿠폰" }
      ]
    },
    {
      conditionValue: "2",
      rewards: [
        { rewardType: "POINTS", rewardValue: 1500, rewardDescription: "1500 포인트" },
        { rewardType: "BADGE_POINTS", rewardValue: 50, rewardDescription: "50 뱃지점수" }
      ]
    },
    {
      conditionValue: "3",
      rewards: [
        { rewardType: "POINTS", rewardValue: 1000, rewardDescription: "1000 포인트" }
      ]
    }
  ];
};

// 이벤트 보상 문자열 변환
export const rewardsToString = (rewards: EventRewardDto[]): string => {
  return rewards.map(reward => reward.rewardDescription).join('\n');
};

// 문자열을 이벤트 보상 배열로 변환
export const stringToRewards = (rewardsString: string): EventRewardDto[] => {
  if (!rewardsString.trim()) return [];
  
  return rewardsString.split('\n')
    .filter(line => line.trim())
    .map((line, index) => ({
      conditionValue: String(index + 1),
      rewardType: "POINTS" as const,
      rewardValue: 100,
      rewardDescription: line.trim()
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

// 날짜에 시작 시간(00:00) 추가 (백엔드용)
export const toStartDateTime = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    // LocalDate 형식으로 반환 (YYYY-MM-DD)
    return dateStr;
  } catch (error) {
    return '';
  }
};

// 날짜에 종료 시간(23:59:59) 추가 (백엔드용)
export const toEndDateTime = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    // LocalDate 형식으로 반환 (YYYY-MM-DD)
    return dateStr;
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
