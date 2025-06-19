// tailwind.config.js
import { defineConfig } from 'tailwindcss';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

// 테마 파일을 동적으로 불러오는 함수
function loadThemeFile() {
  const themePath = resolve(process.cwd(), 'tailwind.theme.js');
  if (existsSync(themePath)) {
    try {
      // ESM 환경에서는 동적으로 JSON으로 파싱
      // 주의: 실제 JS 모듈이 아닌 객체로 취급
      const content = readFileSync(themePath, 'utf-8');
      // export default { ... } 형식에서 객체 부분만 추출
      const objectMatch = content.match(/export\s+default\s+({[\s\S]*})/);
      if (objectMatch && objectMatch[1]) {
        return JSON.parse(objectMatch[1].replace(/,\s*}/g, '}'));
      }
      return {};
    } catch (e) {
      console.warn('tailwind.theme.js 파일을 불러오는데 실패했습니다:', e);
      return {};
    }
  }
  console.warn('tailwind.theme.js 파일이 없습니다. transform-tokens.js를 실행하여 생성하세요.');
  return {};
}

/** @type {import('tailwindcss').Config} */
export default defineConfig({
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      // 생성된 테마 설정 로드
      ...loadThemeFile(),
    },
  },
  plugins: [],
});
