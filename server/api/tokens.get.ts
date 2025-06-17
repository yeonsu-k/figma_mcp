import { readFileSync } from 'fs'
import { resolve } from 'path'

export default defineEventHandler(async (event) => {
  try {
    // tokens/global.json 파일 읽기
    const tokensPath = resolve(process.cwd(), 'tokens/global.json')
    const tokensContent = readFileSync(tokensPath, 'utf-8')
    const tokensData = JSON.parse(tokensContent)

    // 색상 토큰 분석 및 구조화 - 완전 동적 처리
    const analyzeTokens = (data: any) => {
      const colorPalettes: Record<string, Record<string, { value: string; type: string }>> = {}
      const singleColors: Record<string, { value: string; type: string }> = {}
      const otherTokens: Record<string, any> = {}

      // 숫자인지 확인하는 헬퍼 함수 (팔레트 shade 감지용)
      const isNumericShade = (key: string): boolean => {
        return /^\d+$/.test(key) // 순수 숫자 (50, 100, 500 등)
      }

      // 객체가 팔레트인지 확인하는 함수
      const isPalette = (obj: any): boolean => {
        const keys = Object.keys(obj)
        // 모든 키가 숫자이고, 모든 값이 색상 토큰인 경우 팔레트로 판단
        return keys.length > 1 && 
               keys.every(key => isNumericShade(key)) && 
               keys.every(key => obj[key]?.type === 'color' && obj[key]?.value)
      }

      const processTokens = (obj: any, path: string[] = []) => {
        for (const [key, value] of Object.entries(obj)) {
          if (value && typeof value === 'object') {
            if (value.type === 'color' && value.value) {
              // 직접적인 색상 토큰
              if (path.length === 2 && isNumericShade(key)) {
                // 팔레트 색상 (예: global.slate.50, global.emerald.200)
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
                // colors 그룹 내 단일 색상 (예: global.colors.primary)
                const colorName = key
                singleColors[colorName] = {
                  value: value.value,
                  type: value.type
                }
              } else if (path.length === 1) {
                // 루트 레벨 단일 색상 (예: global.black)
                const colorName = key
                singleColors[colorName] = {
                  value: value.value,
                  type: value.type
                }
              }
            } else if (!value.type && !value.value) {
              // 중첩 객체 처리
              if (path.length === 1 && isPalette(value)) {
                // 팔레트 그룹 감지 (어떤 이름이든 상관없이)
                processTokens(value, [...path, key])
              } else {
                // 일반 중첩 객체 재귀 처리
                processTokens(value, [...path, key])
              }
            } else {
              // 기타 토큰 (spacing, typography 등)
              const tokenPath = [...path, key].join('.')
              otherTokens[tokenPath] = value
            }
          }
        }
      }

      if (data['global'] || data['\bglobal']) {
        processTokens(data['global'] || data['\bglobal'], ['global'])
      } else {
        processTokens(data)
      }

      return {
        colorPalettes,
        singleColors,
        otherTokens
      }
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
      lastModified: new Date().toISOString()
    }

    return {
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
  } catch (error) {
    console.error('토큰 API 오류:', error)
    
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : '알 수 없는 오류',
        code: 'TOKEN_READ_ERROR'
      }
    }
  }
})
