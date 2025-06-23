import { FC } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const FooterContainer = styled.footer`
  background-color: var(--background-color);
  padding: 40px 20px;
  border-top: 1px solid var(--border-color);
  text-align: center;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FooterTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  color: var(--text-color);
  margin-bottom: 10px;
`;

const FooterLink = styled(Link)`
  color: #666;
  text-decoration: none;
  font-size: 14px;

  &:hover {
    color: var(--primary-color);
  }
`;

const FooterText = styled.p`
  color: #666;
  font-size: 14px;
  line-height: 1.5;
`;

const Footer: FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>쇼핑몰</FooterTitle>
          <FooterLink to="/about">회사소개</FooterLink>
          <FooterLink to="/careers">채용정보</FooterLink>
          <FooterLink to="/terms">이용약관</FooterLink>
          <FooterLink to="/privacy">개인정보처리방침</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>고객센터</FooterTitle>
          <FooterText>평일 09:00 - 18:00</FooterText>
          <FooterText>점심시간 12:00 - 13:00</FooterText>
          <FooterText>주말 및 공휴일 휴무</FooterText>
          <FooterLink to="/faq">자주 묻는 질문</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>배송안내</FooterTitle>
          <FooterText>배송조회</FooterText>
          <FooterText>반품/교환 안내</FooterText>
          <FooterText>반품/교환 신청</FooterText>
          <FooterText>반품/교환 배송비 안내</FooterText>
        </FooterSection>

        <FooterSection>
          <FooterTitle>소셜미디어</FooterTitle>
          <FooterLink to="https://facebook.com">페이스북</FooterLink>
          <FooterLink to="https://instagram.com">인스타그램</FooterLink>
          <FooterLink to="https://twitter.com">트위터</FooterLink>
          <FooterLink to="https://youtube.com">유튜브</FooterLink>
        </FooterSection>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
