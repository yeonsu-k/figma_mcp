#!/usr/bin/env node
import StyleDictionary from 'style-dictionary'
import config from './style-dictionary.config.js'

console.log('🎨 Building design tokens...')

try {
  // Style Dictionary 인스턴스 생성
  const sd = new StyleDictionary(config)
  
  // 빌드 실행
  await sd.buildAllPlatforms()
  
  console.log('✅ Design tokens built successfully!')
  console.log('📁 Generated files:')
  console.log('   - assets/css/design-tokens.css')
  console.log('   - assets/css/theme-tokens.css')
  console.log('   - composables/useDesignTokens.ts')
  
  // 생성된 파일 통계
  const fs = await import('fs')
  
  const files = [
    'assets/css/design-tokens.css',
    'assets/css/theme-tokens.css',
    'composables/useDesignTokens.ts'
  ]
  
  console.log('\n📊 File statistics:')
  for (const file of files) {
    try {
      const stats = fs.statSync(file)
      console.log(`   ${file}: ${stats.size} bytes`)
    } catch (e) {
      console.log(`   ${file}: ❌ not found`)
    }
  }
  
} catch (error) {
  console.error('❌ Build failed:', error)
  process.exit(1)
}