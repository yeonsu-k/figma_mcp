## 🎨 디자인 토큰 워크플로우

### Tokens Studio + TailwindCSS 파이프라인

이 프로젝트는 Figma의 Tokens Studio 플러그인에서 생성된 디자인 토큰을 TailwindCSS와 통합하는 자동화된 워크플로우를 갖추고 있습니다.

1. **디자인 토큰 생성**: Figma에서 Tokens Studio 플러그인으로 디자인 토큰을 생성
2. **토큰 변환**: token-transformer와 sd-tailwindcss-transformer를 사용하여 토큰을 TailwindCSS 설정으로 변환
3. **CSS 생성**: 디자인 토큰을 기반으로 CSS 변수 생성
4. **TailwindCSS 통합**: 생성된 테마 설정을 TailwindCSS와 통합

### 토큰 빌드 및 워치 명령어

```bash
# 디자인 토큰 빌드
npm run tokens:build

# 토큰 변경사항 감지 및 자동 빌드
npm run tokens:watch

# 생성된 파일 정리
npm run tokens:clean
```

### 생성되는 파일

- `assets/css/design-tokens.css`: CSS 변수로 변환된 디자인 토큰
- `tailwind.theme.js`: TailwindCSS 테마 설정
- `public/api/tokens.json`: API용 토큰 데이터

# MCP 테스트 대시보드

**MCP 테스트 대시보드**는 사이버 보안 관리를 위한 모던한 관리자 대시보드입니다. Nuxt.js 3과 Vue 3를 기반으로 구축된 반응형 웹 애플리케이션입니다.

![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Nuxt.js](https://img.shields.io/badge/Nuxt.js-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🛠️ 기술 스택

### Frontend Framework
- **Nuxt.js 3.8.0**: Universal Vue.js Framework
- **Vue.js 3**: Progressive JavaScript Framework
- **TypeScript 5.3.3**: 타입 안전성과 개발 경험 향상

### 상태 관리 & 유틸리티
- **Pinia 2.1.7**: Vue.js 공식 상태 관리 라이브러리
- **VueUse 10.7.0**: Vue 컴포지션 유틸리티 모음
- **Vue Toastification**: 알림 메시지 시스템

### UI & 스타일링
- **Tailwind CSS 6.8.4**: 유틸리티 우선 CSS 프레임워크
- **Headless UI**: 접근성 우선 컴포넌트 라이브러리
- **Heroicons**: 아름다운 SVG 아이콘 세트
- **Inter Font**: 모던하고 가독성 높은 폰트

### 개발 도구
- **ESLint**: 코드 품질 관리
- **Nuxt DevTools**: 개발 생산성 향상
- **TypeScript Type Checking**: 컴파일 타임 에러 체크
- **Style Dictionary**: 디자인 토큰 관리
- **sd-tailwindcss-transformer**: 디자인 토큰을 TailwindCSS 설정으로 변환

## 📁 프로젝트 구조

```
figma_mcp/
├── app.vue                    # 루트 컴포넌트
├── nuxt.config.ts             # Nuxt 설정 파일
├── package.json               # 프로젝트 의존성
├── tailwind.config.js         # Tailwind CSS 설정
├── tsconfig.json              # TypeScript 설정
│
├── assets/
│   └── css/
│       └── main.css           # 전역 스타일시트
│
├── middleware/
│   └── auth.ts                # 인증 미들웨어
│
├── pages/
│   ├── dashboard.vue          # 대시보드 페이지
│   └── login.vue              # 로그인 페이지
│
├── public/
│   ├── favicon.ico            # 파비콘
│   ├── robots.txt             # SEO 설정
│   └── todo.html              # 임시 페이지
│
├── server/
│   └── tsconfig.json          # 서버 TypeScript 설정
│
└── stores/
    └── auth.ts                # 인증 상태 관리
```

## 🚦 시작하기

### 사전 요구사항
- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0
- **Git**: 최신 버전

### 설치 및 실행

1. **저장소 클론**
```bash
git clone <repository-url>
cd figma_mcp
```

2. **의존성 설치**
```bash
# npm 사용
npm install

# pnpm 사용 (권장)
pnpm install

# yarn 사용
yarn install
```

3. **개발 서버 실행**
```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev
```

개발 서버가 `http://localhost:3000`에서 실행됩니다.

## 📱 페이지 구성

### 로그인 페이지 (`/login`)
- **모던한 UI**: 그라데이션 배경과 블러 효과
- **반응형 디자인**: 모바일부터 데스크톱까지 완벽 지원
- **사용자 경험**: 로딩 상태, 에러 메시지, 폼 검증
- **추가 기능**: 비밀번호 찾기, 에이전트 다운로드

### 대시보드 페이지 (`/dashboard`)
- **헤더**: 브랜드 로고, 사용자 정보, 로그아웃
- **통계 카드**: 4개 주요 지표 실시간 표시
- **차트 영역**: 보안 활동 시각화
- **활동 로그**: 최근 보안 이벤트 목록

## 🔧 개발 가이드

### 코드 스타일
- **TypeScript**: 모든 코드에 타입 정의 적용
- **ESLint**: Nuxt 공식 ESLint 설정 사용
- **Composition API**: Vue 3 Composition API 활용
- **Tailwind CSS**: 유틸리티 클래스 기반 스타일링

### 상태 관리 패턴
```typescript
// stores/auth.ts - Pinia 스토어 예시
export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isLoading: false,
    error: null
  }),
  
  getters: {
    isAuthenticated: (state): boolean => !!state.token && !!state.user,
    isAdmin: (state): boolean => state.user?.role === 'admin'
  },
  
  actions: {
    async login(credentials: LoginCredentials) {
      // 로그인 로직
    }
  }
})
```

### 미들웨어 활용
```typescript
// middleware/auth.ts - 라우트 보호
export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated && to.path !== '/login') {
    return navigateTo('/login')
  }
})
```

## 🚀 배포

### 프로덕션 빌드
```bash
# 빌드 생성
npm run build

# 프로덕션 미리보기
npm run preview
```

### 정적 사이트 생성
```bash
npm run generate
```

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.
