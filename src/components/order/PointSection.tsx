/**
 * 포인트 사용 관리 컴포넌트
 * 
 * 기능:
 * - 보유 포인트 확인 및 표시
 * - 포인트 사용 여부 토글 스위치
 * - 사용할 포인트 금액 입력 및 조절
 * - 전액 사용 기능 제공
 * - 포인트 사용 규칙 및 제한사항 안내
 * 
 * 제공 기능:
 * - 현재 보유 포인트 표시 (P 단위)
 * - 포인트 사용 ON/OFF 토글
 * - 사용할 포인트 직접 입력 (100원 단위)
 * - 보유 포인트 전액 사용 버튼
 * - 포인트 사용 제한 안내 (구매금액의 10%까지)
 * 
 * 사용되는 곳:
 * - PaymentPage에서 포인트 할인 적용 섹션
 * 
 * UX 고려사항:
 * - 토글 스위치로 직관적인 ON/OFF 제어
 * - 포인트 사용 비활성화 시 입력 필드도 함께 비활성화
 * - 전액 사용 버튼으로 편의성 제공
 * - 사용 규칙을 명확히 안내하여 사용자 혼란 방지
 */

// React 라이브러리
import React from "react";
// 스타일 컴포넌트들
import {
  Card,                  // 섹션 래퍼 카드
  SectionTitle,          // 섹션 제목
  PointContainer,        // 포인트 관련 요소 컨테이너
  PointHeader,           // 포인트 헤더 (보유량 + 토글)
  PointInfo,             // 포인트 정보 표시 영역
  PointBalance,          // 포인트 잔액 표시
  PointToggle,           // 포인트 사용 토글 영역
  ToggleLabel,           // 토글 라벨
  ToggleSwitch,          // 토글 스위치 컨테이너
  ToggleSlider,          // 토글 슬라이더 (체크박스)
  Slider,                // 슬라이더 스타일
  PointInputContainer,   // 포인트 입력 컨테이너
  Input,                 // 포인트 입력 필드
  UseAllButton,          // 전액 사용 버튼
} from "../../pages/order/PaymentPage.styles";

/**
 * PointSection 컴포넌트의 Props 인터페이스
 */
interface PointSectionProps {
  usePoint: boolean;                      // 포인트 사용 여부
  usedPoints: number;                     // 현재 사용중인 포인트 금액
  availablePoints: number;                // 보유 가능한 포인트 총량
  isProcessing: boolean;                  // 결제 처리 중 상태
  formatPrice: (price: number) => string; // 가격 포맷팅 함수
  onPointToggle: (enabled: boolean) => void;     // 포인트 사용 토글 핸들러
  onPointsChange: (value: string) => void;       // 사용 포인트 변경 핸들러
  onUseAllPoints: () => void;                    // 전액 사용 핸들러
}

/**
 * 포인트 사용 관리 컴포넌트
 * 
 * 사용자의 보유 포인트를 표시하고, 포인트 사용 여부를 토글로 제어할 수 있으며,
 * 사용할 포인트 금액을 직접 입력하거나 전액 사용할 수 있는 기능을 제공합니다.
 * 포인트 사용 규칙과 제한사항을 명확히 안내합니다.
 */
export const PointSection: React.FC<PointSectionProps> = ({
  usePoint,
  usedPoints,
  availablePoints,
  isProcessing,
  formatPrice,
  onPointToggle,
  onPointsChange,
  onUseAllPoints,
}) => {
  return (
    <Card>
      {/* 섹션 제목 */}
      <SectionTitle>포인트 사용</SectionTitle>
      <PointContainer>
        {/* 포인트 정보 및 사용 토글 헤더 */}
        <PointHeader>
          {/* 보유 포인트 정보 표시 */}
          <PointInfo>
            <span>보유 포인트</span>
            <PointBalance>{formatPrice(availablePoints)}P</PointBalance>  {/* P 단위로 포인트 표시 */}
          </PointInfo>
          
          {/* 포인트 사용 여부 토글 스위치 */}
          <PointToggle>
            <ToggleLabel>포인트 사용</ToggleLabel>
            <ToggleSwitch>
              <ToggleSlider
                checked={usePoint}                                        // 현재 포인트 사용 상태
                onChange={(e) => onPointToggle(e.target.checked)}
                disabled={isProcessing}                                   // 결제 처리 중 토글 비활성화
              />
              <Slider />  {/* 토글 슬라이더 스타일 요소 */}
            </ToggleSwitch>
          </PointToggle>
        </PointHeader>

        {/* 포인트 입력 및 전액 사용 버튼 영역 */}
        <PointInputContainer disabled={!usePoint}>  {/* 포인트 사용 OFF 시 전체 컨테이너 비활성화 */}
          {/* 사용할 포인트 입력 필드 */}
          <Input
            type="number"
            placeholder="사용할 포인트"
            value={usePoint ? usedPoints || "" : ""}                     // 포인트 사용 OFF 시 빈 값
            onChange={(e) => onPointsChange(e.target.value)}
            min="0"                                                       // 최소값 0
            step="100"                                                    // 100원 단위로 증감
            disabled={isProcessing || !usePoint}                         // 처리 중이거나 사용 OFF 시 비활성화
            style={{ opacity: usePoint ? 1 : 0.5 }}                     // 비활성화 시 투명도 조절
          />
          
          {/* 보유 포인트 전액 사용 버튼 */}
          <UseAllButton
            onClick={onUseAllPoints}
            disabled={isProcessing || !usePoint}                         // 처리 중이거나 사용 OFF 시 비활성화
          >
            전액사용
          </UseAllButton>
        </PointInputContainer>

        {/* 포인트 사용 규칙 안내 메시지 */}
        <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "8px" }}>
          * 100원 단위로 사용 가능하며, 구매금액의 10%까지 사용할 수 있습니다.
        </div>
      </PointContainer>
    </Card>
  );
};
