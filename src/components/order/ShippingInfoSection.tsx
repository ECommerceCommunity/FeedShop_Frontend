/**
 * 배송 정보 입력 컴포넌트
 * 
 * 기능:
 * - 받는 분 성함, 연락처, 주소 입력
 * - 휴대폰 번호 자동 포맷팅 (000-0000-0000)
 * - 배송 요청사항 선택 및 직접 입력
 * - 입력 필드 유효성 검사 및 제한
 * - 결제 처리 중 입력 비활성화
 * 
 * 제공 기능:
 * - 필수 입력: 성함, 휴대폰, 우편번호, 주소
 * - 선택 입력: 상세주소, 배송 요청사항
 * - 휴대폰 번호 자동 하이픈 포맷팅
 * - 6가지 배송 요청사항 옵션 + 직접 입력
 * - 기타 선택 시 텍스트 영역 표시
 * 
 * 사용되는 곳:
 * - PaymentPage에서 배송지 정보 입력 섹션
 * 
 * UX 고려사항:
 * - 휴대폰 번호 입력 시 실시간 포맷팅으로 가독성 향상
 * - 배송 요청사항을 버튼 형태로 제공하여 선택 편의성 제공
 * - 기타 선택 시에만 추가 입력 영역 표시로 UI 간소화
 * - 결제 처리 중 모든 입력 비활성화로 데이터 무결성 보장
 */

// React 라이브러리
import React from "react";
// 스타일 컴포넌트들
import {
  Card,                      // 섹션 래퍼 카드
  SectionTitle,              // 섹션 제목
  FormGroup,                 // 폼 그룹 래퍼
  Label,                     // 입력 필드 라벨
  Input,                     // 입력 필드
  Row,                       // 가로 배치 컨테이너
  DeliveryRequestContainer,  // 배송 요청사항 컨테이너
  RequestOptionContainer,    // 요청사항 옵션 버튼 컨테이너
  RequestOptionButton,       // 요청사항 선택 버튼
  CustomRequestContainer,    // 직접 입력 컨테이너
  TextArea,                  // 텍스트 영역
} from "../../pages/order/PaymentPage.styles";

/**
 * ShippingInfoSection 컴포넌트의 Props 인터페이스
 */
interface ShippingInfoSectionProps {
  shippingInfo: {              // 배송 정보 객체
    name: string;              // 받는 분 성함
    phone: string;             // 휴대폰 번호 (포맷팅됨)
    zipcode: string;           // 우편번호
    address: string;           // 기본 주소
    detailAddress: string;     // 상세 주소
    request: string;           // 선택된 배송 요청사항
    customRequest: string;     // 직접 입력한 배송 요청사항
  };
  isProcessing: boolean;       // 결제 처리 중 상태
  onInputChange: (field: string, value: string) => void;        // 입력 값 변경 핸들러
  onDeliveryRequestChange: (option: string) => void;            // 배송 요청사항 변경 핸들러
}

// 배송 요청사항 선택 옵션 목록
const deliveryOptions = [
  "없음",
  "문 앞에 두고 벨을 눌러주세요",
  "경비실에 맡겨주세요",
  "부재 시 안전한 곳에 보관해주세요",
  "직접 받겠습니다",
  "기타 (직접 입력)",
];

/**
 * 배송 정보 입력 컴포넌트
 * 
 * 주문 상품의 배송을 위한 필수 정보들을 입력받고,
 * 휴대폰 번호 자동 포맷팅, 배송 요청사항 선택 등의 
 * 사용자 편의 기능을 제공합니다.
 */
export const ShippingInfoSection: React.FC<ShippingInfoSectionProps> = ({
  shippingInfo,
  isProcessing,
  onInputChange,
  onDeliveryRequestChange,
}) => {
  /**
   * 휴대폰 번호 입력 시 자동 포맷팅 처리 함수
   * 숫자만 추출하여 000-0000-0000 형태로 포맷팅
   * 최대 11자리까지만 입력 허용
   */
  const handlePhoneChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");          // 숫자가 아닌 문자 제거
    let formattedValue = cleanValue;

    // 입력된 숫자의 길이에 따라 포맷팅 적용
    if (cleanValue.length >= 3) {
      if (cleanValue.length <= 6) {
        // 3~6자리: 000-000 형태
        formattedValue = `${cleanValue.slice(0, 3)}-${cleanValue.slice(3)}`;
      } else {
        // 7자리 이상: 000-0000-0000 형태
        formattedValue = `${cleanValue.slice(0, 3)}-${cleanValue.slice(
          3,
          7
        )}-${cleanValue.slice(7, 11)}`;
      }
    }

    // 최대 11자리까지만 허용
    if (cleanValue.length <= 11) {
      onInputChange("phone", formattedValue);
    }
  };

  return (
    <Card>
      {/* 섹션 제목 */}
      <SectionTitle>배송 정보</SectionTitle>

      {/* 받는 분 성함 입력 (필수) */}
      <FormGroup>
        <Label>받는 분 성함 *</Label>
        <Input
          type="text"
          placeholder="성함을 입력해주세요"
          value={shippingInfo.name}
          onChange={(e) => onInputChange("name", e.target.value)}
          disabled={isProcessing}                    // 결제 처리 중 비활성화
        />
      </FormGroup>

      {/* 휴대폰 번호 입력 (필수, 자동 포맷팅) */}
      <FormGroup>
        <Label>휴대폰 번호 *</Label>
        <Input
          type="text"
          placeholder="01012345678 또는 010-1234-5678"
          value={shippingInfo.phone}
          onChange={(e) => handlePhoneChange(e.target.value)}  // 자동 포맷팅 적용
          disabled={isProcessing}
        />
      </FormGroup>

      {/* 주소 입력 (필수) */}
      <FormGroup>
        <Label>주소 *</Label>
        {/* 우편번호와 기본주소를 가로로 배치 */}
        <Row>
          {/* 우편번호 입력 */}
          <Input
            type="text"
            placeholder="우편번호 (5자리)"
            value={shippingInfo.zipcode}
            onChange={(e) => onInputChange("zipcode", e.target.value)}
            disabled={isProcessing}
          />
          
          {/* 기본 주소 입력 */}
          <Input
            type="text"
            placeholder="주소"
            value={shippingInfo.address}
            onChange={(e) => onInputChange("address", e.target.value)}
            disabled={isProcessing}
          />
        </Row>
        
        {/* 상세 주소 입력 (선택사항) */}
        <Input
          type="text"
          placeholder="상세 주소"
          value={shippingInfo.detailAddress}
          onChange={(e) => onInputChange("detailAddress", e.target.value)}
          style={{ marginTop: "8px" }}             // 위 필드와 간격
          disabled={isProcessing}
        />
      </FormGroup>

      {/* 배송 요청사항 선택 (선택사항) */}
      <FormGroup>
        <Label>배송 요청사항</Label>
        <DeliveryRequestContainer>
          {/* 배송 요청사항 옵션 버튼들 */}
          <RequestOptionContainer>
            {deliveryOptions.map((option) => (
              <RequestOptionButton
                key={option}
                type="button"
                selected={shippingInfo.request === option}    // 현재 선택된 옵션인지 확인
                onClick={() => onDeliveryRequestChange(option)}
                disabled={isProcessing}                        // 결제 처리 중 비활성화
              >
                {option}
              </RequestOptionButton>
            ))}
          </RequestOptionContainer>

          {/* "기타 (직접 입력)" 선택 시에만 표시되는 텍스트 영역 */}
          <CustomRequestContainer
            show={shippingInfo.request === "기타 (직접 입력)"}  // 조건부 표시
          >
            <TextArea
              placeholder="배송 시 요청사항을 직접 입력해주세요"
              value={shippingInfo.customRequest}
              onChange={(e) => onInputChange("customRequest", e.target.value)}
              disabled={isProcessing}
              style={{ minHeight: "60px" }}                   // 최소 높이 설정
            />
          </CustomRequestContainer>
        </DeliveryRequestContainer>
      </FormGroup>
    </Card>
  );
};
