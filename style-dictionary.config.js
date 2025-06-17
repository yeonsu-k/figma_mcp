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
      const themeName = `--${token.path.join('-')}`
      return `  ${themeName}: ${token.value};`
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
  
  // 색상 토큰들 그룹별로 정리
  const colorTokens = {
    primary: {
      50: getCSSToken('colors-primary-50'),
      100: getCSSToken('colors-primary-100'),
      500: getCSSToken('colors-primary-500'),
      600: getCSSToken('colors-primary-600'),
      900: getCSSToken('colors-primary-900')
    },
    gray: {
      50: getCSSToken('colors-gray-50'),
      100: getCSSToken('colors-gray-100'),
      500: getCSSToken('colors-gray-500'),
      900: getCSSToken('colors-gray-900')
    }
  }
  
  // 간격 토큰들
  const spacingTokens = {
    xs: getCSSToken('spacing-xs'),
    sm: getCSSToken('spacing-sm'),
    md: getCSSToken('spacing-md'),
    lg: getCSSToken('spacing-lg'),
    xl: getCSSToken('spacing-xl')
  }
  
  return {
    tokens,
    colorTokens,
    spacingTokens,
    getCSSToken
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