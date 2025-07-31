// 이벤트 관련 통일된 타입 정의

export interface EventRewardDto {
  conditionValue: string; // eventService.ts와 통일
  reward: string; // 백엔드와 일치
}

// 다른 타입들은 eventService.ts에서 정의 