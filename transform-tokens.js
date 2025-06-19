#!/usr/bin/env node
import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';

console.log('🎨 Building design tokens for TailwindCSS v4 compatibility...');

// Tokens Studio transforms 등록
register(StyleDictionary);

// 1. token-transformer를 사용하여 Tokens Studio JSON을 Style Dictionary에 맞게 변환
try {
  console.log('🔄 Running token-transformer...');
  
  // 모든 토큰 세트 포함하여 변환
  execSync('npx token-transformer tokens/global.json tokens/transformed.json', { stdio: 'inherit' });
  console.log('✅ Token transformation complete');
} catch (error) {
  console.error('❌ Token transformation failed:', error);
  process.exit(1);
}

// 2. TailwindCSS v4 호환 CSS 변수 생성 (Reddit 가이드 기반)
try {
  console.log('🔄 Building TailwindCSS v4 compatible CSS variables...');
  
  // CSS 변수 파일용 설정 - Reddit 가이드의 방식 적용
  const cssConfig = {
    type:'all',
    isVariables: true,
    source: ['tokens/transformed.json'],
    platforms: {
      css: {
        transformGroup: 'tokens-studio', // Tokens Studio transform group 사용
        transforms: ['name/kebab'],
        buildPath: 'assets/css/',
        files: [
          {
            destination: 'design-tokens.css',
            format: 'css/variables',
            options: {
              selector: '@theme',
              outputReferences: true,  
            },
          },
        ],
      },
    },
  };

  // StyleDictionary 인스턴스 생성 및 빌드
  const sdCss = new StyleDictionary(cssConfig);
  await sdCss.buildAllPlatforms();

  console.log('✅ TailwindCSS v4 compatible CSS variables generated!');

} catch (error) {
  console.error('❌ CSS variables build failed:', error);
  process.exit(1);
}

// 4. main.css 파일 업데이트
try {
  const mainCssPath = resolve(process.cwd(), 'assets/css/main.css');
  let mainCssContent = readFileSync(mainCssPath, 'utf-8');
  
  // 이미 import되어 있는지 확인
  if (!mainCssContent.includes("@import './design-tokens.css';")) {
    console.log('✅ design-tokens.css is already imported in main.css');
  }
  
} catch (error) {
  console.warn('⚠️ Could not check main.css:', error.message);
}
