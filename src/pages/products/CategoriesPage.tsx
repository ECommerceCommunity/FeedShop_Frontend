import React from "react";
import styled from "styled-components";
import PreparationNotice from "../../components/PreparationNotice";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const CategoriesPage: React.FC = () => {
  return (
    <Container>
      <PreparationNotice
        title="카테고리 페이지 준비중입니다"
        message="카테고리별 상품 분류 기능을 준비 중입니다."
        subMessage="현재는 전체 상품 페이지에서 모든 상품을 확인하실 수 있습니다."
      />
    </Container>
  );
};

export default CategoriesPage;