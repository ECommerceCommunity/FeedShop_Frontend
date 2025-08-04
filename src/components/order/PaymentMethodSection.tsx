/**
 * 결제 수단 선택 및 카드 정보 입력 컴포넌트
 * 
 * 기능:
 * - 결제 수단 선택 (카드, 무통장입금, 간편결제, 휴대폰결제)
 * - 카드 결제 선택 시 카드 정보 입력 폼 표시
 * - 카드번호, 유효기간, CVC 입력 및 유효성 검사
 * - 결제 처리 중 상태에서 UI 비활성화
 * 
 * 제공 기능:
 * - 4가지 결제 수단 중 하나 선택
 * - 카드 선택 시 세부 정보 입력 (카드번호 최대 16자리, 유효기간 MM/YY 형식, CVC 3자리)
 * - 실시간 입력 값 검증 및 포맷팅
 * - 결제 처리 중 입력 필드 비활성화
 * 
 * 사용되는 곳:
 * - PaymentPage에서 결제 수단 선택 섹션
 * 
 * UX 고려사항:
 * - 선택된 결제 수단에 따라 추가 입력 폼 동적 표시
 * - 카드 정보 입력 시 보안을 위한 적절한 input type 및 제한 설정
 * - 결제 처리 중 사용자 실수 방지를 위한 비활성화 처리
 */

// React 라이브러리
import React from "react";
// 스타일 컴포넌트들
import {
  Card,                     // 섹션 래퍼 카드
  SectionTitle,            // 섹션 제목
  PaymentMethodContainer,  // 결제 수단 버튼 컨테이너
  PaymentMethodButton,     // 결제 수단 선택 버튼
  FormGroup,               // 폼 그룹 래퍼
  Label,                   // 입력 필드 라벨
  Input,                   // 입력 필드
  Row,                     // 가로 배치 컨테이너
} from "../../pages/order/PaymentPage.styles";

/**
 * PaymentMethodSection 컴포넌트의 Props 인터페이스
 */
interface PaymentMethodSectionProps {
  selectedMethod: string;     // 현재 선택된 결제 수단
  shippingInfo: {            // 카드 정보 객체
    cardNumber: string;      // 카드번호 (최대 16자리)
    cardExpiry: string;      // 유효기간 (MM/YY 형식)
    cardCvv: string;         // CVC 보안코드 (3자리)
  };
  isProcessing: boolean;     // 결제 처리 중 상태
  onMethodChange: (method: string) => void;              // 결제 수단 변경 핸들러
  onInputChange: (field: string, value: string) => void; // 입력 값 변경 핸들러
}

// 사용 가능한 결제 수단 목록
const paymentMethods = ["카드", "무통장입금", "간편결제", "휴대폰결제"];

/**
 * 결제 수단 선택 및 카드 정보 입력 컴포넌트
 * 
 * 선택한 결제 수단에 따라 추가 입력 폼을 동적으로 표시하며,
 * 특히 카드 결제 선택 시 카드번호, 유효기간, CVC 입력을 요구합니다.
 * 결제 처리 중에는 모든 입력을 비활성화하여 사용자 실수를 방지합니다.
 */
export const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  selectedMethod,
  shippingInfo,
  isProcessing,
  onMethodChange,
  onInputChange,
}) => {
  return (
    <Card>
      {/* 섹션 제목 */}
      <SectionTitle>결제 수단</SectionTitle>
      
      {/* 결제 수단 선택 버튼들 */}
      <PaymentMethodContainer>
        {paymentMethods.map((method) => (
          <PaymentMethodButton
            key={method}
            selected={selectedMethod === method}  // 현재 선택된 수단인지 확인
            onClick={() => onMethodChange(method)}
            disabled={isProcessing}                // 결제 처리 중에는 변경 불가
          >
            {method}
          </PaymentMethodButton>
        ))}
      </PaymentMethodContainer>

      {/* 카드 결제 선택 시에만 표시되는 카드 정보 입력 폼 */}
      {selectedMethod === "카드" && (
        <div style={{ marginTop: "16px" }}>
          {/* 카드번호 입력 */}
          <FormGroup>
            <Label>카드번호 *</Label>
            <Input
              type="text"
              placeholder="1234567890123456"
              value={shippingInfo.cardNumber}
              onChange={(e) => onInputChange("cardNumber", e.target.value)}
              maxLength={16}                      // 카드번호 최대 16자리 제한
              disabled={isProcessing}
            />
          </FormGroup>
          
          {/* 유효기간과 CVC를 가로로 배치 */}
          <Row>
            {/* 유효기간 입력 */}
            <FormGroup>
              <Label>유효기간 *</Label>
              <Input
                type="text"
                placeholder="MM/YY"
                value={shippingInfo.cardExpiry}
                onChange={(e) => onInputChange("cardExpiry", e.target.value)}
                maxLength={5}                     // MM/YY 형식으로 5자리 제한
                disabled={isProcessing}
              />
            </FormGroup>
            
            {/* CVC 보안코드 입력 */}
            <FormGroup>
              <Label>CVC *</Label>
              <Input
                type="text"
                placeholder="123"
                value={shippingInfo.cardCvv}
                onChange={(e) => onInputChange("cardCvv", e.target.value)}
                maxLength={3}                     // CVC 3자리 제한
                disabled={isProcessing}
              />
            </FormGroup>
          </Row>
        </div>
      )}
    </Card>
  );
};
