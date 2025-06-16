import StyleDictionary from 'style-dictionary';

// CSS Variables 포맷 등록
StyleDictionary.registerFormat({
  name: 'css/variables',
  formatter: function(dictionary) {
    return `:root {\n${dictionary.allTokens.map(token => 
      `  --${token.name}: ${token.value};`
    ).join('\n')}\n}`;
  }
});

// Tailwind v4 @theme 포맷 등록
StyleDictionary.registerFormat({
  name: 'tailwind/v4-theme',
  formatter: function(dictionary) {
    const themeTokens = dictionary.allTokens.map(token => {
      // 토큰 이름을 Tailwind v4 형식으로 변환
      const themeName = `--${token.path.join('-')}`;
      return `  ${themeName}: ${token.value};`;
    }).join('\n');
    
    return `@theme {\n${themeTokens}\n}`;
  }
});

// TypeScript 인터페이스 포맷 등록
StyleDictionary.registerFormat({
  name: 'typescript/es6-declarations',
  formatter: function(dictionary) {
    return `export interface DesignTokens {\n${dictionary.allTokens.map(token => 
      `  '${token.name}': '${token.value}';`
    ).join('\n')}\n}\n\nexport const tokens: DesignTokens = {\n${dictionary.allTokens.map(token => 
      `  '${token.name}': '${token.value}'`
    ).join(',\n')}\n};`;
  }
});

export default {
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
};