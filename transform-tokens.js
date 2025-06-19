#!/usr/bin/env node
import StyleDictionary from 'style-dictionary';
import { makeSdTailwindConfig } from 'sd-tailwindcss-transformer';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';

console.log('🎨 Building design tokens with sd-tailwindcss-transformer...');

// token-transformer 설치 확인
try {
  execSync('npm list token-transformer || npm install token-transformer', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ token-transformer 설치 확인 실패:', error);
}

// 1. token-transformer를 사용하여 Tokens Studio JSON을 Style Dictionary에 맞게 변환
try {
  console.log('🔄 Running token-transformer...');
  
  // token-transformer 실행
  // tokens/global.json 파일을 tokens/transformed.json으로 변환
  // "\bglobal" 세트만 포함 (토큰 스튜디오의 네이밍 방식)
  execSync('npx token-transformer tokens/global.json tokens/transformed.json "\\\\bglobal"', { stdio: 'inherit' });
  console.log('✅ Token transformation complete');
} catch (error) {
  console.error('❌ Token transformation failed:', error);
  process.exit(1);
}

// 2. TailwindCSS 설정 생성
try {
  // CSS 변수 파일용 설정
  const cssConfig = {
    source: ['tokens/transformed.json'],
    platforms: {
      css: {
        // 기본 transformGroup 사용 (tokens-studio를 사용하지 않음)
        transformGroup: 'css',
        buildPath: 'assets/css/',
        files: [
          {
            destination: 'design-tokens.css',
            format: 'css/variables',
            options: {
              outputReferences: true,
            },
          },
        ],
      },
    },
  };

  // TailwindCSS 설정 파일 생성 설정
  const tailwindConfig = makeSdTailwindConfig({
    type: 'all',
    source: ['tokens/transformed.json'],
    buildPath: './',
  });

  // StyleDictionary 인스턴스 생성 및 빌드
  console.log('🔄 Building CSS variables...');
  const sdCss = new StyleDictionary(cssConfig);
  await sdCss.buildAllPlatforms();

  console.log('🔄 Building Tailwind config...');
  const sdTailwind = new StyleDictionary(tailwindConfig);
  await sdTailwind.buildAllPlatforms();

  console.log('✅ Design tokens built successfully!');
  console.log('📦 Generated files:');
  console.log('   - assets/css/design-tokens.css (CSS 변수)');
  console.log('   - tailwind.theme.js (TailwindCSS 테마 설정)');

  // 3. main.css 파일 업데이트 (design-tokens.css import 주석 해제)
  try {
    const mainCssPath = resolve(process.cwd(), 'assets/css/main.css');
    let mainCssContent = readFileSync(mainCssPath, 'utf-8');
    
    // 주석 처리된 import 문을 찾아 활성화
    mainCssContent = mainCssContent.replace(
      '/* @import \'./design-tokens.css\'; */',
      '@import \'./design-tokens.css\';'
    );
    
    writeFileSync(mainCssPath, mainCssContent, 'utf-8');
    console.log('✅ Updated main.css to import design-tokens.css');
  } catch (error) {
    console.warn('⚠️ Could not update main.css:', error.message);
  }

  // 4. API 데이터 생성 (간소화된 버전)
  console.log('📡 Generating static API data...');
  
  // tokens/transformed.json 파일 읽기
  const tokensPath = resolve(process.cwd(), 'tokens/transformed.json');
  const tokensContent = readFileSync(tokensPath, 'utf-8');
  const tokensData = JSON.parse(tokensContent);

  // API 응답 형태로 데이터 구성
  const apiData = {
    success: true,
    data: {
      tokens: tokensData,
      statistics: {
        lastModified: new Date().toISOString(),
        buildTime: new Date().toISOString()
      }
    }
  };

  // public/api/tokens.json 파일로 저장
  const apiDir = resolve(process.cwd(), 'public/api');
  
  // 디렉토리가 없으면 생성
  if (!existsSync(apiDir)) {
    mkdirSync(apiDir, { recursive: true });
  }
  
  const apiFilePath = resolve(apiDir, 'tokens.json');
  writeFileSync(apiFilePath, JSON.stringify(apiData, null, 2), 'utf-8');
  
  console.log('✅ Static API data generated:', apiFilePath);
  
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}