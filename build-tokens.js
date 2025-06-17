#!/usr/bin/env node
import StyleDictionary from 'style-dictionary'
import config from './style-dictionary.config.js'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

console.log('🎨 Building design tokens...')

try {
  // Style Dictionary 빌드 실행
  const sd = new StyleDictionary(config)
  await sd.buildAllPlatforms()
  
  console.log('✅ Design tokens built successfully!')
  console.log('🎨 Tokens converted to TailwindCSS v4 format with proper namespaces')
  
  // API 데이터 생성 (GitHub Pages용)
  console.log('📡 Generating static API data...')
  
  // tokens/global.json 파일 읽기
  const tokensPath = resolve(process.cwd(), 'tokens/global.json')
  const tokensContent = readFileSync(tokensPath, 'utf-8')
  const tokensData = JSON.parse(tokensContent)

  // 토큰 분석 (API와 동일한 로직)
  const analyzeTokens = (data) => {
    const colorPalettes = {}
    const singleColors = {}
    const otherTokens = {}

    const isNumericShade = (key) => {
      return /^\d+$/.test(key)
    }

    const isPalette = (obj) => {
      const keys = Object.keys(obj)
      return keys.length > 1 && 
             keys.every(key => isNumericShade(key)) && 
             keys.every(key => obj[key]?.type === 'color' && obj[key]?.value)
    }

    const processTokens = (obj, path = []) => {
      for (const [key, value] of Object.entries(obj)) {
        if (value && typeof value === 'object') {
          if (value.type === 'color' && value.value) {
            if (path.length === 2 && isNumericShade(key)) {
              // 팔레트 색상
              const groupName = path[1]
              const shadeName = key
              
              if (!colorPalettes[groupName]) {
                colorPalettes[groupName] = {}
              }
              colorPalettes[groupName][shadeName] = {
                value: value.value,
                type: value.type
              }
            } else if (path.length === 2 && path[1] === 'colors') {
              // colors 그룹 내 단일 색상
              const colorName = key
              singleColors[colorName] = {
                value: value.value,
                type: value.type
              }
            } else if (path.length === 1) {
              // 루트 레벨 단일 색상
              const colorName = key
              singleColors[colorName] = {
                value: value.value,
                type: value.type
              }
            }
          } else if (!value.type && !value.value) {
            if (path.length === 1 && isPalette(value)) {
              processTokens(value, [...path, key])
            } else {
              processTokens(value, [...path, key])
            }
          } else {
            const tokenPath = [...path, key].join('.')
            otherTokens[tokenPath] = value
          }
        }
      }
    }

    if (data['global'] || data['\bglobal']) {
      processTokens(data['global'] || data['\bglobal'], ['global'])
    }

    return { colorPalettes, singleColors, otherTokens }
  }

  const analyzedTokens = analyzeTokens(tokensData)

  // 통계 정보 생성
  const statistics = {
    totalColorPalettes: Object.keys(analyzedTokens.colorPalettes).length,
    totalSingleColors: Object.keys(analyzedTokens.singleColors).length,
    totalColors: Object.values(analyzedTokens.colorPalettes).reduce(
      (total, palette) => total + Object.keys(palette).length, 
      0
    ) + Object.keys(analyzedTokens.singleColors).length,
    totalOtherTokens: Object.keys(analyzedTokens.otherTokens).length,
    lastModified: new Date().toISOString(),
    buildTime: new Date().toISOString()
  }

  // API 응답 형태로 데이터 구성
  const apiData = {
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
  }

  // public/api/tokens.json 파일로 저장
  const apiDir = resolve(process.cwd(), 'public/api')
  const fs = await import('fs')
  
  // 디렉토리가 없으면 생성
  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true })
  }
  
  const apiFilePath = resolve(apiDir, 'tokens.json')
  writeFileSync(apiFilePath, JSON.stringify(apiData, null, 2), 'utf-8')
  
  console.log('✅ Static API data generated:', apiFilePath)
  console.log('📊 Statistics:')
  console.log(`   - Color palettes: ${statistics.totalColorPalettes}`)
  console.log(`   - Single colors: ${statistics.totalSingleColors}`)
  console.log(`   - Total colors: ${statistics.totalColors}`)
  console.log(`   - Other tokens: ${statistics.totalOtherTokens}`)
  
  console.log('\n📁 Generated files:')
  console.log('   - assets/css/design-tokens.css')
  console.log('   - assets/css/theme-tokens.css')
  console.log('   - composables/useDesignTokens.ts')
  console.log('   - public/api/tokens.json')
  
  // 생성된 파일 통계
  const files = [
    'assets/css/design-tokens.css',
    'assets/css/theme-tokens.css',
    'composables/useDesignTokens.ts',
    'public/api/tokens.json'
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