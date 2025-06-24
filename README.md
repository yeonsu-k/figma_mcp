# Figma MCP - Tokens Studio + TailwindCSS 디자인 시스템

> Tokens Studio for Figma 플러그인과 TailwindCSS v4를 연동한 디자인 시스템 프로젝트

## 🎨 라이브 데모

**[Design Tokens Showcase](https://yeonsu-k.github.io/figma_mcp/)** - 모든 토큰을 시각적으로 확인할 수 있는 쇼케이스 페이지

- 색상 팔레트 및 단일 색상
- 간격(Spacing) 토큰 박스 시각화
- 폰트(Font Family) 토큰 미리보기
- 에셋(Asset) 토큰 이미지 미리보기
- 테두리(Border) 토큰 스타일 미리보기
- 타이포그래피(Typography) 토큰 복합 스타일 미리보기
- 클릭하여 토큰 값 복사 기능

## 📚 가이드 문서

### 🎨 디자이너용 가이드

- **[Tokens Studio 플러그인 설정 가이드](./docs/TOKENS_STUDIO_SETUP_GUIDE.md)** - Figma 플러그인 사용법과 토큰 생성 방법

### 🤝 협업 가이드

- **[디자인 시스템 협업 가이드](./docs/DESIGN_SYSTEM_GUIDE.md)** - 디자이너-개발자 간 협업 원칙과 워크플로우

## 🚀 빠른 시작

### 토큰 관리 워크플로우

1. **Figma에서 토큰 생성**: Tokens Studio 플러그인으로 디자인 토큰 정의
2. **JSON 파일 저장**: `tokens/global.json`에 토큰 저장
3. **토큰 빌드**: 개발용 CSS 변수로 변환
4. **TailwindCSS 사용**: 프로젝트에서 토큰 기반 클래스 활용

### 개발 명령어

```bash
# 디자인 토큰 빌드
npm run tokens:build

# 토큰 변경사항 감지 및 자동 빌드
npm run tokens:watch

# 개발 서버 실행
npm run dev

# 배포용 빌드
npm run deploy:build
```

## 📁 토큰 파일 구조

```
tokens/
├── global.json              # Tokens Studio 원본 파일
└── transformed.json         # 변환된 토큰 (자동 생성)

assets/css/
└── design-tokens.css        # TailwindCSS v4 호환 CSS 변수 (자동 생성)

public/api/
└── tokens.json              # API용 토큰 데이터 (자동 생성)
```

## 🎯 현재 등록된 토큰 타입

현재 프로젝트에 등록된 토큰은 `tokens/global.json` 파일에서 확인할 수 있으며, index.vue 페이지에서 시각적으로 확인 가능합니다.

### 지원되는 토큰 타입

#### 🎨 색상 토큰 (Color)

- **팔레트**: 단계별 색상 시스템 (예: spring-100, spring-500)
- **단일 색상**: 브랜드 기본 색상 (예: primary, secondary)
- **시각화**: 색상 칩과 함께 Hex 코드 및 TailwindCSS 클래스명 표시

#### 📏 간격 토큰 (Spacing)

- **용도**: 패딩, 마진, 간격 통일화
- **시각화**: 박스 모델을 통한 실제 크기 미리보기
- **예시**: xs(4px), sm(8px), md(16px), lg(24px), xl(32px)

#### 🔤 폰트 토큰 (Font Families)

- **용도**: 브랜드 폰트 및 시스템 폰트 정의
- **시각화**: 실제 텍스트 샘플로 폰트 미리보기
- **다국어 지원**: 영문, 한글, 숫자 샘플

#### 🖼️ 에셋 토큰 (Asset)

- **용도**: 이미지, 아이콘 등의 URL 관리
- **시각화**: 실제 이미지 미리보기 (로드 실패 시 fallback)
- **클릭 복사**: 이미지 URL 클립보드 복사

#### 🔲 테두리 토큰 (Border)

- **용도**: 테두리 스타일 통일화 (두께, 스타일, 색상)
- **시각화**: 실제 border 스타일이 적용된 박스
- **복합 속성**: width, style, color를 하나의 토큰으로 관리

#### ✍️ 타이포그래피 토큰 (Typography)

- **용도**: 완성된 텍스트 스타일 조합
- **포함 속성**: fontFamily, fontSize, fontWeight, lineHeight
- **시각화**: 실제 텍스트에 스타일이 적용된 미리보기

### 사용 예시

```html
<!-- 색상 토큰 사용 -->
<div class="bg-color-{token-name} text-color-{token-name}">브랜드 색상 적용</div>

<!-- 스페이싱 토큰 사용 -->
<div class="p-spacing-{size} m-spacing-{size}">일관된 간격 적용</div>

<!-- 폰트 토큰 사용 -->
<p class="font-{font-name}">기본 폰트 적용</p>
```

## 🛠️ 기술 스택

- **TailwindCSS v4**: CSS 프레임워크
- **Tokens Studio**: Figma 디자인 토큰 플러그인
- **Style Dictionary**: 토큰 변환 엔진
- **Nuxt.js 3**: 웹 프레임워크
- **Vue.js 3**: UI 프레임워크

## 📋 협업 원칙

### ✅ 권장사항

- 브랜드 고유 색상만 토큰으로 관리
- TailwindCSS 기본 클래스와 중복 피하기
- 일관된 명명 규칙 적용 (kebab-case)
- Git을 통한 토큰 파일 공유

### ❌ 금지사항

- TailwindCSS 기본 색상(`red`, `blue`, `green` 등) 중복 등록
- 하드코딩된 값과 토큰 혼용
- 불일치하는 명명 규칙 사용

## 🔧 토큰 빌드 프로세스

1. **token-transformer**: Tokens Studio JSON → Style Dictionary 형식 변환
2. **Style Dictionary**: 플랫폼별 토큰 파일 생성
3. **CSS 변수 생성**: TailwindCSS v4 `@theme` 지시어 형식으로 변환
4. **API 파일 생성**: 정적 토큰 데이터 JSON 파일 생성

## 🚨 문제해결

### 토큰이 적용되지 않을 때

```bash
# 1. 토큰 빌드 확인
npm run tokens:build

# 2. CSS 파일 생성 확인
ls -la assets/css/design-tokens.css

# 3. 개발 서버 재시작
npm run dev
```

### 토큰 네이밍 오류

- camelCase → kebab-case 자동 변환 확인
- 특수문자 사용 피하기
- TailwindCSS 예약어와 중복 확인

---

## 📞 지원

문제가 발생하거나 기능 요청이 있으시면 이슈를 생성해 주세요.

- **Tokens Studio 문서**: [docs.tokens.studio](https://docs.tokens.studio/)
- **TailwindCSS v4 문서**: [tailwindcss.com](https://tailwindcss.com/docs/theme)
