# Tokens Studio for Figma 플러그인 설정 가이드

> Figma 디자이너를 위한 Tokens Studio 플러그인 무료 버#### 시스템 폰트 등록

```
1. "Font Family" 섹션 선택
2. 토큰명: Pretendard
3. 값: "Pretendard Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

#### 웹폰트 등록

```
1. 토큰명: Brand-font
2. 값: "Custom Font Name", fallback-font
3. CSS에서 @font-face 별도 정의 필요
```

### 7. Typography (조합형) 설정기 설정

### 1. 플러그인 설치

1. Figma에서 **Plugins** → **Browse plugins in Community**
2. **"Tokens Studio for Figma"** 검색
3. **Install** 클릭

### 2. 플러그인 실행

1. Figma 파일에서 **Plugins** → **Tokens Studio for Figma**
2. 플러그인 패널이 오른쪽에 표시됨

## 무료 버전으로 가능한 것 ✅

- **기본 토큰 생성 및 관리** (Color, Spacing, Typography 등)
- **단일 파일 Git 동기화** (GitHub, GitLab 등)
- **로컬 JSON 파일 저장/로드**
- **기본 토큰 참조 (References)**
- **Figma Styles와 연동**
- **읽기 전용 테마 접근** (Pro 사용자가 공유한 경우)

## 🎨 토큰 카테고리별 설정 가이드

### 1. Color (색상) 설정

#### 단일 색상 등록

```
1. Tokens Studio 패널에서 "Color" 섹션 클릭
2. "+" 버튼으로 새 토큰 추가
3. 토큰명 입력: brand-primary
4. 색상값 설정: #eb4859
5. Description(선택): 브랜드 메인 컬러
```

#### 색상 팔레트 등록

```
1. "Color" 섹션에서 폴더 생성: spring
2. 하위 토큰들 생성:
   - spring.100: #ffbfc0
   - spring.200: #FFDCDC
   - spring.300: #FFF2EB
   - spring.400: #FFE8CD
   - spring.500: #FFD6BA
```

#### ⚠️ 주의사항

- TailwindCSS 기본 색상(`red`, `blue`, `green` 등) 피하기
- 숫자 기반 팔레트는 50-950 범위 권장 (TailwindCSS 규칙)
- HEX 코드로 입력 (#ffffff 형식)

### 2. Spacing (간격) 설정

#### 기본 스페이싱 스케일

```
1. "Spacing" 섹션 선택
2. 8px 기반 스케일로 토큰 생성:
   - xs: 4 (4px)
   - sm: 8 (8px)
   - md: 16 (16px)
   - lg: 24 (24px)
   - xl: 32 (32px)
```

#### 수치 입력 방법

- **단위 없이 숫자만 입력**: `16` (px로 자동 변환)
- **rem 단위 사용 시**: `1rem` (명시적 입력)

### 3. Font Family (폰트) 설정

#### 시스템 폰트 등록

```
1. "Font Family" 섹션 선택
2. 토큰명: Pretendard
3. 값: "Pretendard Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

#### 웹폰트 등록

```
1. 토큰명: Brand-font
2. 값: "Custom Font Name", fallback-font
3. CSS에서 @font-face 별도 정의 필요
```

### 4. Border Radius (모서리 둥글기) 설정

#### 기본 라운드 값

```
1. "Border Radius" 섹션 선택
2. 모서리 둥글기 토큰 생성:
   - radius-none: 0    (각진 모서리)
   - radius-sm: 4      (미세한 둥글기)
   - radius-md: 8      (기본 둥글기)
   - radius-lg: 12     (큰 둥글기)
   - radius-xl: 16     (매우 큰 둥글기)
   - radius-2xl: 24    (매우 큰 둥글기)
   - radius-3xl: 32    (극도로 큰 둥글기)
   - radius-full: 9999 (완전한 원형/타원)
```

#### 컴포넌트별 Border Radius

```
component/
├── button-radius: 8     (버튼 모서리)
├── card-radius: 12      (카드 모서리)
├── input-radius: 6      (입력 필드)
├── avatar-radius: 9999  (프로필 이미지)
└── badge-radius: 4      (뱃지/태그)
```

#### 활용 예시

- **버튼**: `radius-md` (8px) - 친근하면서 모던한 느낌
- **카드**: `radius-lg` (12px) - 부드럽고 세련된 외관
- **이미지**: `radius-full` - 원형 프로필 이미지
- **입력 필드**: `radius-sm` (4px) - 깔끔하고 정돈된 느낌

### 5. Opacity (투명도) 설정

#### 기본 투명도 스케일

```
1. "Opacity" 섹션 선택
2. 투명도 토큰 생성:
   - opacity-0: 0      (완전 투명)
   - opacity-5: 0.05   (거의 투명)
   - opacity-10: 0.1   (매우 흐림)
   - opacity-20: 0.2   (흐림)
   - opacity-25: 0.25  (1/4 불투명)
   - opacity-30: 0.3   (흐림)
   - opacity-40: 0.4   (중간 흐림)
   - opacity-50: 0.5   (반투명)
   - opacity-60: 0.6   (중간 불투명)
   - opacity-70: 0.7   (불투명)
   - opacity-75: 0.75  (3/4 불투명)
   - opacity-80: 0.8   (거의 불투명)
   - opacity-90: 0.9   (매우 불투명)
   - opacity-95: 0.95  (거의 완전 불투명)
   - opacity-100: 1    (완전 불투명)
```

#### 시맨틱 투명도 토큰

```
semantic/
├── overlay-light: 0.1    (밝은 오버레이)
├── overlay-medium: 0.5   (중간 오버레이)
├── overlay-dark: 0.8     (어두운 오버레이)
├── disabled: 0.4         (비활성화 상태)
├── hover: 0.8            (호버 상태)
└── focus: 0.9            (포커스 상태)
```

#### 활용 예시

- **오버레이**: `opacity-50` - 모달 배경, 드롭다운 뒤 영역
- **비활성화**: `opacity-40` - 클릭할 수 없는 버튼이나 요소
- **호버 효과**: `opacity-80` - 마우스 올렸을 때 살짝 투명하게
- **로딩 상태**: `opacity-60` - 데이터 로딩 중인 콘텐츠
- **워터마크**: `opacity-10` - 배경에 보이는 로고나 텍스트

### 6. Font Family (폰트) 설정

#### Heading 스타일

```
1. "Typography" 섹션 선택
2. 토큰명: heading-xl
3. 조합 설정:
   - Font Family: {Pretendard}
   - Font Size: 32
   - Font Weight: 700
   - Line Height: 1.2
```

#### Body 텍스트 스타일

```
토큰명: body-regular
- Font Family: {Pretendard}
- Font Size: 16
- Font Weight: 400
- Line Height: 1.5
```

### 팀 공유 워크플로우

```
디자이너 → 개발자:
1. 토큰 수정 후 JSON 파일 저장
2. Git에 커밋 & 푸시
3. 개발자에게 변경사항 알림

개발자 → 디자이너:
1. 토큰 요청사항 이슈 생성
2. 디자이너가 토큰 추가/수정
3. JSON 파일 업데이트 확인
```

## 🎯 토큰 설계 모범사례

### 1. 색상 토큰 구조화

#### 브랜드 색상 (Brand Colors)

```
brand/
├── primary: #eb4859
├── secondary: #3674B5
└── accent: #FFD6BA
```

#### 시맨틱 색상 (Semantic Colors)

```
semantic/
├── success: #10b981
├── warning: #f59e0b
├── error: #ef4444
└── info: #3b82f6
```

#### 중성 색상 (Neutral Colors)

```
// TailwindCSS 기본 gray 대신 브랜드 중성색 사용
neutral/
├── 50: #fafafa
├── 100: #f5f5f5
├── 500: #737373
└── 900: #171717
```

### 2. 스페이싱 시스템 설계

#### 4px 그리드 시스템

```
spacing/
├── xs: 4    (0.25rem)
├── sm: 8    (0.5rem)
├── md: 16   (1rem)
├── lg: 24   (1.5rem)
├── xl: 32   (2rem)
├── 2xl: 48  (3rem)
└── 3xl: 64  (4rem)
```

#### 컴포넌트별 전용 간격

```
component/
├── button-padding-x: 16
├── button-padding-y: 8
├── card-padding: 24
└── section-margin: 48
```

### 3. 타이포그래피 스케일

#### 폰트 크기 스케일

```
text/
├── xs: 12
├── sm: 14
├── base: 16
├── lg: 18
├── xl: 20
├── 2xl: 24
├── 3xl: 30
└── 4xl: 36
```

#### 폰트 두께

```
weight/
├── light: 300
├── regular: 400
├── medium: 500
├── semibold: 600
└── bold: 700
```

### 4. Border Radius 시스템 설계

#### 크기별 Border Radius

```
radius/
├── none: 0
├── xs: 2
├── sm: 4
├── md: 8
├── lg: 12
├── xl: 16
├── 2xl: 24
└── full: 9999
```

#### 컴포넌트별 Border Radius 적용

```
component/
├── button: 8
├── card: 12
├── input: 6
├── badge: 12
├── avatar: 9999
├── modal: 16
└── tooltip: 4
```

### 5. Opacity 시스템 설계

#### 기능별 Opacity 토큰

```
opacity/
├── subtle: 0.05
├── soft: 0.1
├── light: 0.2
├── medium: 0.5
├── strong: 0.8
└── solid: 1
```

#### 상태별 Opacity 적용

```
state/
├── disabled: 0.4
├── loading: 0.6
├── hover: 0.8
├── focus: 0.9
├── overlay: 0.5
└── watermark: 0.1
```

## 🔧 고급 활용 팁

### 1. 토큰 참조 (References)

무료 버전에서도 제한적으로 사용 가능:

```
기본 색상 정의:
base-red: #ef4444

참조 토큰:
error-color: {base-red}  // 중괄호로 참조
```

### 2. 조건부 토큰 (Conditional Tokens) - Pro 전용

```
// 라이트/다크 모드 대응 (Pro 버전 필요)
background-primary:
  - light: #ffffff
  - dark: #1f2937

// 무료 버전 대안: 명시적 토큰명 사용
background-light: #ffffff
background-dark: #1f2937
```

### 3. 수식 계산 (Math Operations)

```
// 기본값의 배수로 계산
spacing-2x: {spacing.md} * 2  // 32px
spacing-half: {spacing.md} / 2  // 8px
```

## 🚨 일반적인 실수 및 해결방법

### 1. 토큰명 중복

**문제**: TailwindCSS 기본 클래스와 동일한 이름 사용

```
❌ 잘못된 예:
red-500: #ef4444  // TailwindCSS 기본값과 충돌

✅ 올바른 예:
brand-red-500: #eb4859  // 고유한 브랜드 색상
```

### 2. 일관성 없는 네이밍

**문제**: 팀원마다 다른 명명 규칙 사용

```
❌ 일관성 없음:
ButtonPrimary, button_secondary, btn-accent

✅ 일관된 규칙:
button-primary, button-secondary, button-accent
```

### 3. 너무 세분화된 토큰

**문제**: 과도하게 많은 토큰 생성

```
❌ 과도한 세분화:
spacing-1, spacing-2, spacing-3, ... spacing-100

✅ 적절한 스케일:
xs, sm, md, lg, xl (5-7개 수준)
```

### 4. 토큰 이름의 의미 불명확

**문제**: 용도를 알 수 없는 추상적 이름 사용

```
❌ 불명확한 이름:
opacity-weird, radius-special, color-thing

✅ 명확한 이름:
opacity-disabled, radius-button, color-error
```

## 🔗 추가 리소스

### Figma 커뮤니티 리소스

- [Tokens Studio 공식 문서](https://docs.tokens.studio/)
- [TailwindCSS Color Palette](https://tailwindcss.com/docs/customizing-colors)

### 유용한 도구

- [Coolors.co](https://coolors.co/) - 색상 팔레트 생성
- [Type Scale](https://type-scale.com/) - 타이포그래피 스케일 계산
- [Modular Scale](https://www.modularscale.com/) - 수학적 스케일 계산

### 디자인 시스템 참고 자료

- [Material Design](https://material.io/design/shape/shape-as-expression.html) - Border radius 가이드라인
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) - 투명도 사용 원칙
- [Atlassian Design System](https://atlassian.design/) - 토큰 네이밍 컨벤션

---

이 가이드를 통해 Tokens Studio for Figma 플러그인을 효과적으로 활용하여 일관성 있는 디자인 시스템을 구축할 수 있습니다. 무료 버전의 기능만으로도 충분히 강력한 디자인 토큰 시스템을 만들 수 있습니다.
