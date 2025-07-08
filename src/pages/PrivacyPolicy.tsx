import React from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 30px;
  text-align: center;
`;

const Section = styled.section`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 15px;
  color: #333;
`;

const Content = styled.div`
  line-height: 1.6;
  color: #666;
`;

const PrivacyPolicy: React.FC = () => {
  return (
    <Container>
      <Title>개인정보처리방침</Title>

      <Section>
        <SectionTitle>1. 수집하는 개인정보 항목</SectionTitle>
        <Content>
          <p>회원가입 시 수집하는 개인정보는 다음과 같습니다:</p>
          <ul>
            <li>필수항목: 이메일, 비밀번호, 이름</li>
            <li>선택항목: 없음</li>
          </ul>
        </Content>
      </Section>

      <Section>
        <SectionTitle>2. 개인정보의 수집 및 이용목적</SectionTitle>
        <Content>
          <p>수집한 개인정보는 다음의 목적을 위해 이용됩니다:</p>
          <ul>
            <li>
              회원 관리: 회원제 서비스 이용, 개인식별, 불량회원의 부정이용 방지
            </li>
            <li>서비스 제공: 상품 구매 및 결제, 배송, 고객상담</li>
          </ul>
        </Content>
      </Section>

      <Section>
        <SectionTitle>3. 개인정보의 보유 및 이용기간</SectionTitle>
        <Content>
          <p>
            회원의 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이 달성되면
            지체 없이 파기합니다.
          </p>
          <p>
            단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와
            같이 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.
          </p>
        </Content>
      </Section>

      <Section>
        <SectionTitle>4. 개인정보의 파기절차 및 방법</SectionTitle>
        <Content>
          <p>
            회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당
            정보를 지체 없이 파기합니다.
          </p>
          <p>파기절차 및 방법은 다음과 같습니다:</p>
          <ul>
            <li>
              파기절차: 회원이 서비스 가입 등을 위해 입력한 정보는 목적이 달성된
              후 별도의 DB로 옮겨져 내부 방침 및 기타 관련 법령에 의한 정보보호
              사유에 따라 일정 기간 저장된 후 파기됩니다.
            </li>
            <li>
              파기방법: 전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수
              없는 기술적 방법을 사용하여 삭제합니다.
            </li>
          </ul>
        </Content>
      </Section>

      <Section>
        <SectionTitle>5. 개인정보 보호책임자</SectionTitle>
        <Content>
          <p>
            회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보
            처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와
            같이 개인정보 보호책임자를 지정하고 있습니다.
          </p>
          <p>개인정보 보호책임자: [이름]</p>
          <p>이메일: [이메일 주소]</p>
        </Content>
      </Section>
    </Container>
  );
};

export default PrivacyPolicy;
