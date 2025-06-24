# Tokens Studio for Figma → TailwindCSS 디자인 시스템 가이드

> **목표**: Tokens Studio for Figma 플러그인(무료 버전)을 사용하여 디자인 토큰을 관리하고, 이를 TailwindCSS v4 프로젝트에 효과적으로 적용하는 개발자 협업 가이드

## 📋 기본 원칙

### 1. TailwindCSS 기본 색상 활용 원칙

**🚫 금지사항**: TailwindCSS에서 기본 제공하는 색상은 플러그인에 등록하지 않습니다.

- `red`, `blue`, `green`, `gray`, `slate`, `zinc` 등의 기본 팔레트
- `black`, `white`, `transparent`, `current` 등의 기본 색상

**✅ 권장사항**: 브랜드 고유 색상만 Tokens Studio에서 관리합니다.

```json
// ✅ 좋은 예: 브랜드 색상
{
  "global": {
    "spring": {
      "100": { "value": "#ffbfc0", "type": "color" },
      "500": { "value": "#FFD6BA", "type": "color" }
    },
    "brand-primary": {
      "value": "#eb4859",
      "type": "color"
    }
  }
}

// ❌ 나쁜 예: TailwindCSS 기본 색상 중복
{
  "red": {
    "500": { "value": "#ef4444", "type": "color" } // TailwindCSS 기본값과 중복
  }
}
```

### 2. 토큰 명명 규칙

Figma 디자이너와 개발자 간의 일관성을 위해 다음 규칙을 따릅니다:

#### Color 토큰

```
브랜드명-용도-강도
└── spring-100, spring-500
└── brand-primary, brand-secondary
└── semantic-error, semantic-success
```

#### Spacing 토큰

```
크기명
└── xs (4px), sm (8px), md (16px), lg (24px), xl (32px)
```

#### Typography 토큰

```
폰트패밀리-변형
└── Pretendard (폰트패밀리)
└── heading-xl, body-sm (조합형 토큰)
```

## 🎨 토큰 타입별 가이드

### Colors (색상)

- **Figma 설정**: Tokens Studio → Color 섹션
- **TailwindCSS 출력**: `color-{token-name}`
- **사용법**: `text-color-spring-100`, `bg-color-brand-primary`
- **시각화**: 색상 칩, Hex 코드, TailwindCSS 클래스명 표시

### Spacing (간격)

- **Figma 설정**: Tokens Studio → Spacing 섹션
- **TailwindCSS 출력**: `spacing-{token-name}`
- **사용법**: `p-spacing-md`, `m-spacing-lg`
- **시각화**: 박스 모델을 통한 실제 크기 미리보기

### Font Families (폰트)

- **Figma 설정**: Tokens Studio → Typography → Font Families
- **TailwindCSS 출력**: `font-{token-name}`
- **사용법**: `font-pretendard`
- **시각화**: 다국어 텍스트 샘플로 폰트 미리보기

### Assets (에셋)

- **Figma 설정**: Tokens Studio → Assets 섹션
- **TailwindCSS 출력**: `asset-{token-name}` (커스텀 사용)
- **사용법**: CSS에서 `url(var(--asset-{token-name}))`
- **시각화**: 실제 이미지 미리보기, 로드 실패 시 fallback

### Borders (테두리)

- **Figma 설정**: Tokens Studio → Border 섹션
- **TailwindCSS 출력**: `border-{token-name}` (커스텀 사용)
- **사용법**: CSS에서 `border: var(--border-{token-name})`
- **시각화**: 실제 테두리 스타일이 적용된 박스
- **복합 속성**: `{ width: "2px", style: "dashed", color: "#f01" }`

### Typography (타이포그래피)

- **Figma 설정**: Tokens Studio → Typography 섹션
- **TailwindCSS 출력**: `text-{token-name}` (커스텀 사용)
- **사용법**: CSS에서 복합 스타일 적용
- **시각화**: 실제 텍스트에 전체 스타일 적용
- **복합 속성**: `{ fontFamily, fontSize, fontWeight, lineHeight }`

### 기타 토큰 (Other)

- **대상**: Font Sizes, Line Heights, Letter Spacing, Border Radius, Box Shadow, Opacity 등
- **시각화**: 상위 타입에 포함되지 않는 모든 토큰들을 텍스트로 표시

## 🔄 워크플로우

### 디자이너 워크플로우

1. **Figma에서 토큰 생성**

   - Tokens Studio 플러그인 열기
   - 브랜드 색상/스페이싱 등 정의
   - TailwindCSS 기본값 피하기

2. **토큰 내보내기**

   - JSON 형태로 내보내기
   - `tokens/global.json`에 저장

3. **개발자에게 전달**
   - Git을 통한 토큰 파일 공유
   - 변경사항 커밋 메시지에 상세 기록

### 개발자 워크플로우

1. **토큰 빌드**

   ```bash
   npm run tokens:build
   ```

2. **생성된 파일 확인**

   - `assets/css/design-tokens.css`: TailwindCSS v4 호환 CSS 변수
   - `public/api/tokens.json`: API용 정적 파일

3. **TailwindCSS에서 사용**
   ```css
   /* 자동 생성된 CSS 변수 */
   @theme {
     --color-spring-100: #ffbfc0;
     --spacing-md: 16px;
     --font-pretendard: Pretendard Variable;
   }
   ```

## 📝 코드 사용 예시

### HTML/Vue 템플릿에서 사용

```vue
<template>
  <!-- 색상 토큰 사용 -->
  <div class="bg-color-spring-100 text-color-brand-primary">
    <!-- 간격 토큰 사용 -->
    <p class="p-spacing-md m-spacing-lg">Hello Design System</p>
  </div>

  <!-- 커스텀 토큰 조합 사용 -->
  <button class="bg-color-spring-500 px-spacing-md py-spacing-sm radius-md text-white shadow-sm">Button</button>

  <!-- 폰트 토큰 사용 -->
  <h1 class="font-pretendard text-2xl font-bold">Brand Typography</h1>
</template>
```

### CSS에서 직접 사용

```css
/* 기본 토큰 사용 */
.custom-component {
  background-color: var(--color-spring-100);
  padding: var(--spacing-md);
  font-family: var(--font-pretendard);
  border-radius: var(--radius-md);
}

/* 복합 토큰 사용 */
.border-component {
  border: var(--border-divide); /* 2px dashed #f01 */
}

.typography-component {
  /* 타이포그래피 토큰 사용 */
  font-family: var(--typography-h1-fontFamily);
  font-size: var(--typography-h1-fontSize);
  font-weight: var(--typography-h1-fontWeight);
  line-height: var(--typography-h1-lineHeight);
}

.asset-component {
  background-image: url(var(--asset-zzang-gu));
  background-size: cover;
  background-position: center;
}
```

### 동적 토큰 접근 (JavaScript/TypeScript)

```typescript
// 토큰 값 동적 접근
const getTokenValue = (tokenName: string) => {
  return getComputedStyle(document.documentElement).getPropertyValue(`--${tokenName}`).trim()
}

// 예시 사용
const springColor = getTokenValue('color-spring-100') // #ffbfc0
const mediumSpacing = getTokenValue('spacing-md') // 16px
const brandFont = getTokenValue('font-pretendard') // Pretendard Variable

// 동적 스타일 적용
const element = document.querySelector('.dynamic-element')
element.style.backgroundColor = `var(--color-spring-500)`
element.style.padding = `var(--spacing-lg)`
```

## 🚨 주의사항 및 제한

### Tokens Studio 무료 버전 제한

- ✅ 로컬 파일 저장 및 수동 JSON 파일 공유 가능
- ✅ Git 저장소(GitHub/GitLab 등) 동기화 가능
- ❌ 고급 테마 기능(Multi-dimensional theming) 불가
- ❌ 브랜치 전환 기능 불가
- ❌ Token Flow, Second Screen 등 고급 시각화 도구 불가

### TailwindCSS 호환성

- **v4 전용**: 현재 설정은 TailwindCSS v4용입니다
- **CSS 변수**: `@theme` 지시어를 통한 커스텀 변수 정의
- **클래스 접두사**: 토큰 타입에 따른 자동 접두사 적용

### 개발 환경 요구사항

- Node.js 18+
- TailwindCSS v4
- Tokens Studio for Figma 플러그인

## 🔧 문제해결

### 토큰이 적용되지 않을 때

1. **빌드 확인**

   ```bash
   npm run tokens:build
   ```

2. **CSS 파일 생성 확인**

   ```bash
   ls -la assets/css/design-tokens.css
   ```

3. **main.css import 확인**
   ```css
   @import './design-tokens.css';
   ```

### 토큰 네이밍 오류

- camelCase → kebab-case 자동 변환 확인
- 공백이 하이픈(-)으로 변환되는지 확인
- 특수문자 사용 피하기

## 📚 참고 자료

- [TailwindCSS v4 Theme Configuration](https://tailwindcss.com/docs/theme)
- [Tokens Studio Documentation](https://docs.tokens.studio/)
- [Style Dictionary Documentation](https://styledictionary.com/getting-started/installation/)

---

## 🤝 협업 체크리스트

### 디자이너 체크리스트

- [ ] TailwindCSS 기본 색상 중복 확인
- [ ] 일관된 명명 규칙 적용
- [ ] 적절한 카테고리에 분류
- [ ] 팀원과 사전 협의
- [ ] 개발자와 토큰 변경사항 공유
- [ ] 영향받는 컴포넌트 확인

### 개발자 체크리스트

- [ ] 토큰 빌드 스크립트 실행
- [ ] CSS 변수 생성 확인
- [ ] TailwindCSS 클래스 동작 테스트
- [ ] 테스트 환경에서 검증

### 공통 체크리스트

- [ ] 디자인-개발 간 토큰명 일치 확인
- [ ] 브라우저 호환성 테스트
- [ ] 성능 영향도 검토
- [ ] 문서화 업데이트

### 정기 점검

- [ ] 사용되지 않는 토큰 정리
- [ ] 중복 토큰 통합
- [ ] 네이밍 일관성 점검
- [ ] 문서 업데이트
