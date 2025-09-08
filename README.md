# 🛍️ FeedShop - E-Commerce + 커뮤니티 채팅 서비스

<div align="center">
  <img src="https://readdy.ai/api/search-image?query=modern%20minimalist%20logo%20design%20for%20an%20e-commerce%20and%20community%20platform%20blue%20color%20theme%20clean%20and%20professional%20simple%20geometric%20shapes%20abstract%20representation%20of%20connection%20and%20shopping&width=200&height=80&seq=3&orientation=landscape" alt="FeedShop Logo" width="200"/>
  
  ### 쇼핑과 소통을 한 곳에서! 🚀
  
  [![React](https://img.shields.io/badge/React-18.0.0-blue.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-4.9.0-blue.svg)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0.0-38B2AC.svg)](https://tailwindcss.com/)
  [![Vite](https://img.shields.io/badge/Vite-4.0.0-646CFF.svg)](https://vitejs.dev/)
</div>

---

## 📋 프로젝트 개요

**FeedShop**은 전자상거래와 커뮤니티 기능을 결합한 혁신적인 웹 플랫폼입니다. 사용자들은 상품을 구매하면서 동시에 다른 사용자들과 실시간 채팅을 통해 소통할 수 있습니다. 또한 관리자 대시보드를 통해 효율적인 플랫폼 관리가 가능합니다.

### 🎯 주요 특징

- **통합 플랫폼**: 쇼핑몰 + 커뮤니티 + 채팅 서비스
- **실시간 채팅**: 사용자 간 실시간 소통
- **관리자 대시보드**: 종합적인 플랫폼 관리 시스템
- **반응형 디자인**: 모든 디바이스에서 최적화된 경험
- **사용자 친화적 UI/UX**: 직관적이고 모던한 인터페이스

---

## 🛠️ 기술 스택

### Frontend

- **React 18** - 사용자 인터페이스 구축
- **TypeScript** - 타입 안전성과 개발 생산성 향상
- **Tailwind CSS** - 유틸리티 퍼스트 CSS 프레임워크
- **Vite** - 빠른 개발 서버 및 빌드 도구
- **React Router** - 클라이언트 사이드 라우팅
- **Axios** - HTTP 클라이언트

### 개발 도구

- **ESLint** - 코드 품질 관리
- **Prettier** - 코드 포맷팅
- **Git** - 버전 관리

---

## 🚀 주요 기능

### 👤 사용자 기능

- **상품 쇼핑**: 상품 목록, 상세 정보, 장바구니, 주문
- **커뮤니티**: 게시글 작성, 댓글, 좋아요
- **실시간 채팅**: 사용자 간 1:1 채팅, 채팅방 관리
- **프로필 관리**: 개인정보 수정, 멤버십 정보, 알림 설정
- **위시리스트**: 관심 상품 저장 및 관리

### 🔧 관리자 기능

- **대시보드**: 플랫폼 현황 한눈에 보기
- **사용자 관리**: 사용자 목록, 상태 관리, 상세 정보
- **신고 관리**: 신고 처리, 상태 변경, 상세 조회
- **통계 분석**: 매출, 사용자, 상품 통계 및 차트
- **상품 관리**: 상품 등록, 수정, 삭제

### 📱 반응형 디자인

- **모바일 최적화**: 터치 친화적 인터페이스
- **태블릿 지원**: 중간 화면에서의 최적화
- **데스크톱 경험**: 큰 화면에서의 풍부한 기능

<img width="620" height="718" alt="화면 캡처 2025-09-08 140225" src="https://github.com/user-attachments/assets/87a13073-2630-4b48-84dc-37d1d847dea9" />

<img width="617" height="812" alt="dd" src="https://github.com/user-attachments/assets/02ca5bf1-3d27-4426-a096-b3598a889c4c" />

<img width="623" height="835" alt="화면 캡처 2025-09-08 140403" src="https://github.com/user-attachments/assets/54f41b84-0eb4-45d2-baec-51fffcf63955" />

<img width="627" height="828" alt="화면 캡처 2025-09-08 140628" src="https://github.com/user-attachments/assets/16800b4f-85f6-473e-b55d-cb46bae178dd" />

<img width="625" height="793" alt="화면 캡처 2025-09-08 140934" src="https://github.com/user-attachments/assets/ad47368e-bb3b-48e4-89f5-53bef2d931d0" />





---

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── cards/          # 카드 컴포넌트
│   ├── layout/         # 레이아웃 컴포넌트
│   └── modal/          # 모달 컴포넌트
├── pages/              # 페이지 컴포넌트
│   ├── admin           # 관리자 기능 페이지
│   ├── auth/           # 인증 및 사용자 관련 페이지
│   ├── common          # 공통/기타 페이지 (홈, 개인정보처리방침 등)
│   ├── seller          # 판매자 기능 페이지
│   ├── feed/           # 피드 관련 페이지
│   ├── reviews         # 리뷰 관련 페이지
│   ├── cart/           # 장바구니 관련 페이지
│   ├── order/          # 주문 관련 페이지
│   ├── products/       # 상품 관련 페이지
│   └── stores/         # 가게 관련 페이지
├── contexts/           # React Context
├── hooks/              # 커스텀 훅
├── types/              # TypeScript 타입 정의
├── utils/              # 유틸리티 함수
└── api/                # API 관련 설정
```

---

## 🚀 설치 및 실행

### 1. 저장소 클론

```bash
git clone https://github.com/your-username/FeedShop-Frontend.git
cd FeedShop-Frontend
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 빌드

```bash
npm run build
```

### 5. 빌드 결과 미리보기

```bash
npm run preview
```

---

## 📸 스크린샷

### 메인 페이지

![메인 페이지](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=FeedShop+Main+Page)

### 관리자 대시보드

![관리자 대시보드](https://via.placeholder.com/800x400/10B981/FFFFFF?text=Admin+Dashboard)

## 🔧 개발 환경 설정

### 필수 요구사항

- Node.js 16.0.0 이상
- npm 8.0.0 이상

### 권장 개발 도구

- VS Code
- React Developer Tools
- Tailwind CSS IntelliSense

---

## 📈 성능 최적화

- **코드 스플리팅**: lazy()를 활용한 지연 로딩
- **이미지 최적화**: WebP 포맷 및 적응형 이미지
- **번들 최적화**: Vite를 통한 빠른 빌드
- **캐싱 전략**: 브라우저 캐싱 활용

---

## 🧪 테스트

```bash
# 단위 테스트 실행
npm run test

# 테스트 커버리지 확인
npm run test:coverage
```

---

## 📝 API 문서

### 주요 API 엔드포인트

- `GET /api/products` - 상품 목록 조회
- `POST /api/orders` - 주문 생성
- `GET /api/users` - 사용자 정보 조회

---

## 🤝 기여 방법

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

---

<div align="center">
  <p>⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요! ⭐</p>
  <p>Made with ❤️ by [Your Name]</p>
</div>
