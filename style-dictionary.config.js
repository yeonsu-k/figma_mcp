import StyleDictionary from 'style-dictionary'

console.log('📋 Loading Style Dictionary configuration...')

// CSS Variables 포맷 등록
StyleDictionary.registerFormat({
  name: 'css/variables',
  format: ({ dictionary }) => {
    const header = `/**\n * Do not edit directly, this file was auto-generated.\n */\n\n`
    const variables = dictionary.allTokens.map(token => 
      `  --${token.name}: ${token.value};`
    ).join('\n')
    
    return `${header}:root {\n${variables}\n}`
  }
})

// Tailwind v4 @theme 포맷 등록
StyleDictionary.registerFormat({
  name: 'tailwind/v4-theme',
  format: ({ dictionary }) => {
    const header = `/* Tailwind v4 Theme Tokens - Auto-generated */\n`
    
    const themeTokens = dictionary.allTokens.map(token => {
      let namespacedName = token.name;
      let processedValue = token.value;
      
      // 토큰 타입에 따라 TailwindCSS v4 네임스페이스 매핑
      if (token.type === 'color') {
        // global-slate-50 → color-slate-50
        namespacedName = token.name.replace(/^global-/, 'color-');
      } else if (token.type === 'spacing') {
        // global-xs → spacing-xs
        namespacedName = token.name.replace(/^global-/, 'spacing-');
        
        // 간격 토큰에 단위 추가 (px가 없다면)
        const value = token.value.toString();
        const hasUnit = /\d+(px|rem|em|%|vh|vw)/.test(value);
        processedValue = hasUnit ? value : `${value}px`;
      } else {
        // 기타 토큰들의 네임스페이스 처리
        if (token.name.startsWith('global-')) {
          // 토큰 타입에 따른 네임스페이스 매핑
          const typeToNamespace = {
            'borderRadius': 'radius',
            'borderWidth': 'border-width',
            'boxShadow': 'shadow',
            'opacity': 'opacity',
            'fontSize': 'text',
            'fontWeight': 'font-weight',
            'lineHeight': 'leading',
            'letterSpacing': 'tracking',
            'fontFamily': 'font'
          };
          
          const namespace = typeToNamespace[token.type] || token.type;
          namespacedName = token.name.replace(/^global-/, `${namespace}-`);
        }
      }
      
      return `  --${namespacedName}: ${processedValue};`
    }).join('\n')
    
    return `${header}@theme {\n${themeTokens}\n}`
  }
})

// TypeScript 포맷 등록
StyleDictionary.registerFormat({
  name: 'typescript/es6-declarations',
  format: ({ dictionary }) => {
    const header = `// Design Tokens - Auto-generated\n// Do not edit directly\n\n`
    
    const interfaceContent = dictionary.allTokens.map(token => 
      `  '${token.name}': string`
    ).join('\n')
    
    const tokenContent = dictionary.allTokens.map(token => 
      `  '${token.name}': '${token.value}'`
    ).join(',\n')
    
    // 동적으로 색상 토큰 분석
    const analyzeColorTokens = () => {
      const colorTokens = {}
      const singleColors = {}
      
      dictionary.allTokens.forEach(token => {
        if (token.type === 'color') {
          const pathParts = token.path
          
          if (pathParts.length >= 3) {
            // 팔레트 색상 (예: global.slate.50)
            const groupName = pathParts[1] // slate, sky 등
            const shadeName = pathParts[2] // 50, 100, 500 등
            
            if (!colorTokens[groupName]) {
              colorTokens[groupName] = {}
            }
            colorTokens[groupName][shadeName] = {
              token: token.name,
              value: token.value
            }
          } else if (pathParts.length === 2 || (pathParts.length === 3 && pathParts[1] === 'colors')) {
            // 단일 색상 (예: global.black, global.colors.primary)
            const colorName = pathParts[pathParts.length - 1]
            singleColors[colorName] = {
              token: token.name,
              value: token.value
            }
          }
        }
      })
      
      return { colorTokens, singleColors }
    }
    
    const composableContent = `export const useDesignTokens = () => {
  const getCSSToken = (tokenName: string): string => {
    if (typeof window !== 'undefined') {
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue(\`--\${tokenName}\`)
        .trim()
      return value || tokens[tokenName as keyof DesignTokens] || 'undefined'
    }
    return tokens[tokenName as keyof DesignTokens] || 'undefined'
  }
  
  // 동적으로 색상 토큰 분석
  const getColorTokensByType = () => {
    const colorPalettes = {}
    const singleColors = {}
    
    Object.entries(tokens).forEach(([tokenName, value]) => {
      if (tokenName.startsWith('global')) {
        // 토큰 이름에서 경로 추출 (예: GlobalSlate50 → ["Global", "Slate", "50"])
        const parts = tokenName.replace('global', '').match(/[A-Z][a-z]*|\d+/g) || []
        
        if (parts.length >= 2) {
          const lastPart = parts[parts.length - 1]
          const isNumericShade = /^\d+$/.test(lastPart)
          
          if (isNumericShade && parts.length >= 2) {
            // 팔레트 색상 (예: GlobalSlate50 → slate.50)
            const colorGroup = parts[0].toLowerCase()
            const shade = lastPart
            
            if (!colorPalettes[colorGroup]) {
              colorPalettes[colorGroup] = {}
            }
            colorPalettes[colorGroup][shade] = {
              token: tokenName,
              value: value as string
            }
          } else {
            // 단일 색상 처리
            let colorName
            if (parts.includes('Colors')) {
              // GlobalColorsPrimary → primary
              colorName = parts[parts.indexOf('Colors') + 1]?.toLowerCase() || parts.join('').toLowerCase()
            } else {
              // GlobalBlack → black
              colorName = parts.join('').toLowerCase()
            }
            
            singleColors[colorName] = {
              token: tokenName,
              value: value as string
            }
          }
        }
      }
    })
    
    return { colorPalettes, singleColors }
  }
  
  // 간격 토큰들 (향후 확장 가능)
  const getSpacingTokens = () => {
    const spacingTokens = {}
    Object.entries(tokens).forEach(([tokenName, value]) => {
      if (tokenName.includes('spacing') || tokenName.includes('Spacing')) {
        const spacingName = tokenName.replace(/.*spacing/i, '').toLowerCase()
        spacingTokens[spacingName] = {
          token: tokenName,
          value: value as string
        }
      }
    })
    return spacingTokens
  }
  
  return {
    tokens,
    getCSSToken,
    getColorTokensByType,
    getSpacingTokens
  }
}`
    
    return `${header}export interface DesignTokens {\n${interfaceContent}\n}\n\nexport const tokens: DesignTokens = {\n${tokenContent}\n}\n\n${composableContent}`
  }
})

// Style Dictionary 설정 내보내기
const config = {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'assets/css/',
      files: [{
        destination: 'design-tokens.css',
        format: 'css/variables'
      }]
    },
    tailwind: {
      transformGroup: 'css',
      buildPath: 'assets/css/',
      files: [{
        destination: 'theme-tokens.css',
        format: 'tailwind/v4-theme'
      }]
    },
    js: {
      transformGroup: 'js',
      buildPath: 'composables/',
      files: [{
        destination: 'useDesignTokens.ts',
        format: 'typescript/es6-declarations'
      }]
    }
  }
}

console.log('✅ Style Dictionary configuration loaded successfully')
export default config