/**
 * 토큰 카테고리 관리를 위한 Composable
 * 카테고리 분류, 키워드 생성, 네비게이션 기능 제공
 */
export const useTokenCategories = () => {
  /**
   * 전체 색상 개수를 계산하는 함수
   * @param {Object} colorPalettes - 색상 팔레트 객체
   * @param {Object} singleColors - 단일 색상 객체
   * @returns {number} 총 색상 개수
   */
  const getTotalColorsCount = (colorPalettes = {}, singleColors = {}) => {
    const paletteCount = Object.values(colorPalettes).reduce((total, group) => total + Object.keys(group).length, 0)
    const singleCount = Object.keys(singleColors).length
    return paletteCount + singleCount
  }

  /**
   * 사용 가능한 키워드 목록을 생성하는 함수
   * @param {Object} options - 옵션 객체
   * @param {Object} options.colorPalettes - 색상 팔레트
   * @param {Object} options.singleColors - 단일 색상
   * @param {Array} options.spacingTokens - 간격 토큰
   * @param {Array} options.typographyTokens - 타이포그래피 토큰
   * @param {Array} options.fontTokens - 폰트 토큰
   * @param {Array} options.assetTokens - 에셋 토큰
   * @param {Array} options.borderTokens - 테두리 토큰
   * @param {Array} options.opacityTokens - 투명도 토큰
   * @param {Array} options.borderRadiusTokens - 모서리 둥글기 토큰
   * @param {Array} options.otherTokens - 기타 토큰
   * @returns {Array} 키워드 배열
   */
  const generateAvailableKeywords = ({
    colorPalettes = {},
    singleColors = {},
    spacingTokens = [],
    typographyTokens = [],
    fontTokens = [],
    assetTokens = [],
    borderTokens = [],
    opacityTokens = [],
    borderRadiusTokens = [],
    otherTokens = []
  } = {}) => {
    const keywords = [
      {
        id: 'colors',
        label: 'Colors',
        icon: '🎨',
        count: getTotalColorsCount(colorPalettes, singleColors)
      },
      {
        id: 'spacing',
        label: 'Spacing',
        icon: '📏',
        count: spacingTokens.length
      },
      {
        id: 'typography',
        label: 'Typography',
        icon: '✏️',
        count: typographyTokens.length + fontTokens.length
      },
      {
        id: 'assets',
        label: 'Assets',
        icon: '🖼️',
        count: assetTokens.length
      },
      {
        id: 'borders',
        label: 'Borders',
        icon: '🔲',
        count: borderTokens.length
      },
      {
        id: 'opacity',
        label: 'Opacity',
        icon: '🌫️',
        count: opacityTokens.length
      },
      {
        id: 'borderRadius',
        label: 'Border Radius',
        icon: '📐',
        count: borderRadiusTokens.length
      },
      {
        id: 'other',
        label: 'Other',
        icon: '📋',
        count: otherTokens.length
      }
    ]

    // 토큰이 있는 카테고리만 필터링
    return keywords.filter(keyword => keyword.count > 0)
  }

  /**
   * 첫 번째 사용 가능한 카테고리 ID를 반환하는 함수
   * @param {Array} availableKeywords - 사용 가능한 키워드 배열
   * @returns {string|null} 첫 번째 카테고리 ID 또는 null
   */
  const getDefaultCategory = (availableKeywords = []) => {
    return availableKeywords.length > 0 ? availableKeywords[0].id : null
  }

  /**
   * 특정 카테고리의 정보를 반환하는 함수
   * @param {Array} availableKeywords - 사용 가능한 키워드 배열
   * @param {string} categoryId - 카테고리 ID
   * @returns {Object|null} 카테고리 정보 또는 null
   */
  const getCategoryInfo = (availableKeywords = [], categoryId) => {
    return availableKeywords.find(keyword => keyword.id === categoryId) || null
  }

  /**
   * 카테고리 변경 가능 여부를 확인하는 함수
   * @param {Array} availableKeywords - 사용 가능한 키워드 배열
   * @param {string} categoryId - 카테고리 ID
   * @returns {boolean} 변경 가능 여부
   */
  const isCategoryAvailable = (availableKeywords = [], categoryId) => {
    return availableKeywords.some(keyword => keyword.id === categoryId)
  }

  return {
    // Utility functions
    getTotalColorsCount,
    generateAvailableKeywords,
    getDefaultCategory,
    getCategoryInfo,
    isCategoryAvailable
  }
}
