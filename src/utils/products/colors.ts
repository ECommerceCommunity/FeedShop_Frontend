/**
 * 상품 색상 관리 유틸리티
 * 
 * JSON 파일에서 색상 데이터를 가져와서 영문 색상명을 한국어 색상명으로 매핑하는 기능을 제공합니다.
 * 상품 옵션에서 색상을 선택할 때 사용자에게 한국어로 표시하기 위해 사용됩니다.
 */

import colors from "../../pages/data/products/colors.json";

// 색상 데이터 인터페이스
interface Color {
  color_image_url?: string;  // 색상 이미지 URL (선택적)
  color_name_en?: string;    // 영문 색상명 (예: "BLACK", "WHITE")
  color_name?: string;       // 한국어 색상명 (예: "블랙", "화이트")
}

/**
 * 영문 색상명을 한국어 색상명으로 매핑하는 객체
 * JSON 파일에서 색상 데이터를 읽어와서 영문명(대문자)을 키로, 한국어명을 값으로 하는 맵을 생성합니다.
 * 예: { "BLACK": "블랙", "WHITE": "화이트", "RED": "빨강" }
 */
export const colorNameMap = colors.reduce(
  (acc: Record<string, string>, cur: Color) => {
    // 색상 이미지 URL과 영문명이 모두 존재하는 경우에만 매핑에 추가
    if (cur.color_image_url && cur.color_name_en) {
      // 영문 색상명을 대문자로 변환하여 키로 사용, 한국어명을 값으로 저장
      acc[cur.color_name_en.toUpperCase()] = cur.color_name as string;
    }
    return acc;
  },
  {} as Record<string, string>
);
