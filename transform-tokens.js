#!/usr/bin/env node
import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';

console.log('🎨 Building design tokens for TailwindCSS v4 compatibility...');

// Tokens Studio transforms 등록
register(StyleDictionary);

// TailwindCSS v4 호환을 위한 커스텀 name transform 등록
StyleDictionary.registerTransform({
  name: 'name/cti/tailwind',
  type: 'name',
  transform: function(token) {
    const type = token.type;
    let prefix = '';
    
    // Tokens Studio 타입을 TailwindCSS v4 namespace에 매핑
    switch (type) {
      case 'color':
        prefix = 'color';
        break;
      case 'fontFamilies':
        prefix = 'font';
        break;
      case 'fontSizes':
        prefix = 'text';
        break;
      case 'fontWeights':
        prefix = 'font-weight';
        break;
      case 'letterSpacing':
        prefix = 'tracking';
        break;
      case 'lineHeights':
        prefix = 'leading';
        break;
      case 'sizing':
      case 'spacing':
      case 'dimension':
        prefix = 'spacing';
        break;
      case 'borderRadius':
        prefix = 'radius';
        break;
      case 'borderWidth':
        prefix = 'border';
        break;
      case 'boxShadow':
        prefix = 'shadow';
        break;
      case 'opacity':
        prefix = 'opacity';
        break;
      case 'typography':
        // Typography는 여러 속성을 포함하므로 기본 남겨둔음
        prefix = '';
        break;
      default:
        // 알 수 없는 타입은 prefix 없이 그대로 사용
        prefix = '';
        break;
    }
    
    // token.path 배열을 사용하여 전체 경로를 kebab-case로 변환
    const pathSegments = token.path.map(segment => 
      segment
        .replace(/\s+/g, '-')        // 공백을 하이펀으로
        .replace(/[A-Z]/g, (match, offset) => 
          offset > 0 ? '-' + match.toLowerCase() : match.toLowerCase()  // camelCase를 kebab-case로
        )
        .toLowerCase()
    );
    const name = pathSegments.join('-');
    
    // prefix가 있으면 추가, 없으면 그대로
    return prefix ? `${prefix}-${name}` : name;
  }
});

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
        // transformGroup: 'tokens-studio', // 커스텀 transforms 사용을 위해 비활성화
        transforms: [
          'ts/descriptionToComment',
          'ts/size/px',
          'ts/opacity',
          'ts/size/lineheight',
          'ts/typography/fontWeight',
          'ts/resolveMath',
          'ts/color/modifiers',
          'name/cti/tailwind'  // 커스텀 transform 사용
        ],
        buildPath: 'assets/css/',
        files: [
          {
            destination: 'design-tokens.css',
            format: 'css/variables',
            filter: function(token) {
              // tokenSetOrder와 같은 메타데이터 토큰 제외
              return token.name !== 'tokenSetOrder' && 
                     !token.path.includes('tokenSetOrder') &&
                     token.type !== 'other';
            },
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

// 3. API용 정적 JSON 파일 생성 (GitHub Pages 호환)
try {
  console.log('🔄 Generating static API JSON files...');
  
  // public/api 디렉토리 생성
  const apiDir = resolve(process.cwd(), 'public/api');
  if (!existsSync(apiDir)) {
    mkdirSync(apiDir, { recursive: true });
  }
  
  // tokens/global.json 파일 읽기
  const tokensPath = resolve(process.cwd(), 'tokens/global.json');
  const tokensContent = readFileSync(tokensPath, 'utf-8');
  const tokensData = JSON.parse(tokensContent);
  
  // 토큰 분석 함수 (server/api/tokens.get.ts와 동일)
  const analyzeTokens = (data) => {
    const colorPalettes = {};
    const singleColors = {};
    const otherTokens = {};

    const isNumericShade = (key) => {
      return /^\d+$/.test(key);
    };

    const isPalette = (obj) => {
      const keys = Object.keys(obj);
      return keys.length > 1 && 
             keys.every(key => isNumericShade(key)) && 
             keys.every(key => obj[key]?.type === 'color' && obj[key]?.value);
    };

    const processTokens = (obj, path = []) => {
      for (const [key, value] of Object.entries(obj)) {
        if (value && typeof value === 'object') {
          if (value.type === 'color' && value.value) {
            if (path.length === 2 && isNumericShade(key)) {
              const groupName = path[1];
              const shadeName = key;
              
              if (!colorPalettes[groupName]) {
                colorPalettes[groupName] = {};
              }
              colorPalettes[groupName][shadeName] = {
                value: value.value,
                type: value.type
              };
            } else if (path.length === 2 && path[1] === 'colors') {
              const colorName = key;
              singleColors[colorName] = {
                value: value.value,
                type: value.type
              };
            } else if (path.length === 1) {
              const colorName = key;
              singleColors[colorName] = {
                value: value.value,
                type: value.type
              };
            }
          } else if (!value.type && !value.value) {
            if (path.length === 1 && isPalette(value)) {
              processTokens(value, [...path, key]);
            } else {
              processTokens(value, [...path, key]);
            }
          } else {
            const tokenPath = [...path, key].join('.');
            otherTokens[tokenPath] = value;
          }
        }
      }
    };

    if (data['global'] || data['\bglobal']) {
      processTokens(data['global'] || data['\bglobal'], ['global']);
    } else {
      processTokens(data);
    }

    return {
      colorPalettes,
      singleColors,
      otherTokens
    };
  };
  
  const analyzedTokens = analyzeTokens(tokensData);
  
  // 통계 정보 생성
  const statistics = {
    totalColorPalettes: Object.keys(analyzedTokens.colorPalettes).length,
    totalSingleColors: Object.keys(analyzedTokens.singleColors).length,
    totalColors: Object.values(analyzedTokens.colorPalettes).reduce(
      (total, palette) => total + Object.keys(palette).length, 
      0
    ) + Object.keys(analyzedTokens.singleColors).length,
    totalOtherTokens: Object.keys(analyzedTokens.otherTokens).length,
    lastModified: new Date().toISOString()
  };
  
  // API 응답 형태로 데이터 구성
  const apiResponse = {
    success: true,
    data: {
      colors: {
        ...analyzedTokens.colorPalettes,
        single: analyzedTokens.singleColors
      },
      other: analyzedTokens.otherTokens,
      statistics,
      raw: tokensData
    }
  };
  
  // 정적 API 파일들 생성
  writeFileSync(
    resolve(apiDir, 'tokens.json'),
    JSON.stringify(apiResponse, null, 2)
  );
  
  // 개별 엔드포인트들도 생성
  writeFileSync(
    resolve(apiDir, 'tokens-colors.json'),
    JSON.stringify({
      success: true,
      data: apiResponse.data.colors
    }, null, 2)
  );
  
  writeFileSync(
    resolve(apiDir, 'tokens-statistics.json'),
    JSON.stringify({
      success: true,
      data: statistics
    }, null, 2)
  );
  
  console.log('✅ Static API JSON files generated!');
  console.log(`   📁 public/api/tokens.json`);
  console.log(`   📁 public/api/tokens-colors.json`);
  console.log(`   📁 public/api/tokens-statistics.json`);
  
} catch (error) {
  console.error('❌ Static API generation failed:', error);
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
