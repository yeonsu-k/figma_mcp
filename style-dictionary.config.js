import StyleDictionary from 'style-dictionary'

console.log('📋 Loading Style Dictionary configuration...')

// Tailwind v4 @theme 포맷 등록 (유일하게 필요한 포맷)
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
            'fontFamily': 'font',
            'fontFamilies': 'font'
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

// Style Dictionary 설정 - TailwindCSS v4만 지원
const config = {
  source: ['tokens/**/*.json'],
  platforms: {
    tailwind: {
      transformGroup: 'css',
      buildPath: 'assets/css/',
      files: [{
        destination: 'theme-tokens.css',
        format: 'tailwind/v4-theme'
      }]
    }
  }
}

console.log('✅ Style Dictionary configuration loaded successfully (TailwindCSS v4 only)')
export default config