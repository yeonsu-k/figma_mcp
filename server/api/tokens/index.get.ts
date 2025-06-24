import fs from 'fs'
import path from 'path'

/**
 * 디자인 토큰 데이터를 반환하는 API 엔드포인트
 * Figma에서 변경된 토큰을 동적으로 표시하기 위해 사용
 */
export default defineEventHandler(async event => {
  try {
    // 토큰 파일 경로
    const tokensPath = path.resolve(process.cwd(), 'tokens/global.json')

    // 파일 존재 여부 확인
    if (!fs.existsSync(tokensPath)) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Tokens file not found'
      })
    }

    // 파일 읽기
    const tokensData = fs.readFileSync(tokensPath, 'utf-8')
    const tokens = JSON.parse(tokensData)

    // 색상 토큰만 필터링하여 반환
    interface ColorToken {
      value: string
      type: string
    }
    const colorTokens: Record<string, Record<string, ColorToken>> = {}

    if (tokens.colors) {
      // 중첩된 색상 구조 처리
      for (const [groupName, group] of Object.entries(tokens.colors)) {
        if (typeof group === 'object' && group !== null) {
          colorTokens[groupName] = {}

          for (const [shadeName, shade] of Object.entries(group)) {
            if (shade && typeof shade === 'object' && shade.type === 'color') {
              colorTokens[groupName][shadeName] = {
                value: shade.value,
                type: shade.type
              }
            }
          }
        }
      }
    }

    return {
      success: true,
      data: {
        colors: colorTokens,
        lastModified: fs.statSync(tokensPath).mtime,
        totalColorGroups: Object.keys(colorTokens).length,
        totalColors: Object.values(colorTokens).reduce((total, group) => total + Object.keys(group).length, 0)
      }
    }
  } catch (error) {
    console.error('Token API Error:', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load design tokens',
      data: {
        error: error instanceof Error ? error.message : String(error)
      }
    })
  }
})
