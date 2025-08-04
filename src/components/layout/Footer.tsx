import { FC } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";

// 애니메이션 정의
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const glow = keyframes`
  0%, 100% {
    text-shadow: 0 0 5px rgba(249, 115, 22, 0.5);
  }
  50% {
    text-shadow: 0 0 20px rgba(249, 115, 22, 0.8), 0 0 30px rgba(249, 115, 22, 0.5);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
`;

const FooterContainer = styled.footer`
  background: linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%);
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 20% 20%,
        rgba(249, 115, 22, 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 80%,
        rgba(239, 68, 68, 0.08) 0%,
        transparent 50%
      );
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.5), transparent);
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 1.5rem 2rem;
  position: relative;
  z-index: 2;
`;

const FooterTop = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
  animation: ${fadeInUp} 1s ease-out;

  @media (max-width: 1024px) {
    grid-template-columns: 2fr 1fr 1fr;
    gap: 2rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2.5rem;
  }
`;

const FooterBrand = styled.div`
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const BrandTitle = styled.h2`
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #ffffff, #fef3c7, #f97316);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${glow} 3s ease-in-out infinite alternate;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const BrandDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.7;
  margin-bottom: 2rem;
  font-size: 1rem;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const SocialIcon = styled.a`
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.6s;
  }

  &:hover {
    transform: translateY(-3px) scale(1.1);
    box-shadow: 0 8px 25px rgba(249, 115, 22, 0.5);
    animation: ${float} 2s ease-in-out infinite;

    &::before {
      left: 100%;
    }
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  animation: ${fadeInUp} 1s ease-out;
  
  @media (max-width: 1024px) {
    &:nth-child(4), &:nth-child(5) {
      display: none;
    }
  }
  
  @media (max-width: 768px) {
    &:nth-child(3) {
      display: none;
    }
  }
`;

const FooterTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
  position: relative;
  
  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 30px;
    height: 2px;
    background: linear-gradient(135deg, #f97316, #ea580c);
    border-radius: 1px;
  }
  
  @media (max-width: 768px) {
    &::after {
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

const FooterLink = styled(Link)`
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  padding: 0.25rem 0;
  position: relative;
  display: inline-block;

  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 1px;
    background: linear-gradient(135deg, #f97316, #ea580c);
    transition: width 0.3s ease;
  }

  &:hover {
    color: #f97316;
    transform: translateX(5px);
    
    &::before {
      width: 100%;
    }
  }
`;

const FooterText = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0.25rem 0;
`;

const ContactInfo = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(249, 115, 22, 0.3);
    transform: translateY(-2px);
  }
`;

const ContactTitle = styled.h4`
  color: #f97316;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 1rem;
`;

const ContactText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin: 0.25rem 0;
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  margin: 0;
`;

const FooterBottomLinks = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const FooterBottomLink = styled(Link)`
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    color: #f97316;
  }
`;



const Footer: FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        

        <FooterTop>
          <FooterBrand>
            <BrandTitle>FeedShop</BrandTitle>
            <BrandDescription>
              스마트한 쇼핑 경험을 위한 최고의 선택. 
              고객과 비즈니스 모두를 위한 혁신적인 플랫폼으로 
              더 나은 미래를 만들어갑니다.
            </BrandDescription>
            <SocialIcons>
              <SocialIcon href="https://facebook.com" target="_blank">
                <i className="fab fa-facebook-f"></i>
              </SocialIcon>
              <SocialIcon href="https://instagram.com" target="_blank">
                <i className="fab fa-instagram"></i>
              </SocialIcon>
              <SocialIcon href="https://twitter.com" target="_blank">
                <i className="fab fa-twitter"></i>
              </SocialIcon>
              <SocialIcon href="https://youtube.com" target="_blank">
                <i className="fab fa-youtube"></i>
              </SocialIcon>
            </SocialIcons>
          </FooterBrand>

          <FooterSection>
            <FooterTitle>쇼핑</FooterTitle>
            <FooterLink to="/products">전체 상품</FooterLink>
            <FooterLink to="/categories">카테고리</FooterLink>
            <FooterLink to="/sale">할인 상품</FooterLink>
            <FooterLink to="/new">신상품</FooterLink>
            <FooterLink to="/wishlist">위시리스트</FooterLink>
          </FooterSection>

          <FooterSection>
            <FooterTitle>고객지원</FooterTitle>
            <ContactInfo>
              <ContactTitle>고객센터</ContactTitle>
              <ContactText>1588-0000</ContactText>
              <ContactText>평일 09:00 - 18:00</ContactText>
              <ContactText>점심 12:00 - 13:00</ContactText>
            </ContactInfo>
            <FooterLink to="/faq">자주 묻는 질문</FooterLink>
            <FooterLink to="/contact">문의하기</FooterLink>
          </FooterSection>

          <FooterSection>
            <FooterTitle>서비스</FooterTitle>
            <FooterLink to="/shipping">배송 안내</FooterLink>
            <FooterLink to="/returns">반품/교환</FooterLink>
            <FooterLink to="/warranty">품질보증</FooterLink>
            <FooterLink to="/membership">멤버십</FooterLink>
            <FooterLink to="/events">이벤트</FooterLink>
          </FooterSection>

          <FooterSection>
            <FooterTitle>회사</FooterTitle>
            <FooterLink to="/about">회사소개</FooterLink>
            <FooterLink to="/careers">채용정보</FooterLink>
            <FooterLink to="/press">보도자료</FooterLink>
            <FooterLink to="/investors">투자정보</FooterLink>
            <FooterLink to="/sustainability">지속가능경영</FooterLink>
          </FooterSection>
        </FooterTop>

        <FooterBottom>
          <Copyright>
            &copy; 2025 FeedShop. All rights reserved. Made with ❤️ in Seoul
          </Copyright>
          <FooterBottomLinks>
            <FooterBottomLink to="/terms">이용약관</FooterBottomLink>
            <FooterBottomLink to="/privacy">개인정보처리방침</FooterBottomLink>
            <FooterBottomLink to="/youth">청소년보호정책</FooterBottomLink>
            <FooterBottomLink to="/sitemap">사이트맵</FooterBottomLink>
          </FooterBottomLinks>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;