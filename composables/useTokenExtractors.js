/**
 * 토큰 추출 및 변환 유틸리티를 위한 Composable
 * 다양한 타입의 토큰을 추출하고 포맷팅하는 기능 제공
 */
export const useTokenExtractors = () => {
  /**
   * 토큰 이름에서 토큰 세트 접두사를 제거하는 유틸리티 함수
   * @param {string} tokenName - 원본 토큰 이름
   * @returns {string} 정리된 토큰 이름
   */
  const removeTokenSetPrefix = tokenName => {
    return tokenName.replace(/^[^.]+\./, '').replace(/\./g, '-')
  }

  /**
   * Spacing 값을 CSS에 적합하게 변환하는 유틸리티 함수
   * @param {string|number} value - 원본 spacing 값
   * @returns {string} CSS에 적합한 spacing 값
   */
  const formatSpacingValue = value => {
    // 이미 문자열이고 단위가 포함된 경우 그대로 반환
    if (typeof value === 'string' && /\D/.test(value)) {
      return value
    }

    // 숫자만 있는 경우 px 단위 추가
    const numericValue = typeof value === 'string' ? parseFloat(value) : value
    if (!isNaN(numericValue)) {
      return `${numericValue}px`
    }

    // 기타 경우 원본 값 반환
    return String(value)
  }

  /**
   * Spacing 토큰들을 추출하는 함수
   * @param {Object} otherTokens - 기타 토큰 객체
   * @returns {Array} spacing 토큰 배열
   */
  const getSpacingTokens = (otherTokens = {}) => {
    const spacingTokens = []

    Object.entries(otherTokens).forEach(([tokenName, tokenData]) => {
      if (tokenData.type === 'spacing') {
        spacingTokens.push({
          name: removeTokenSetPrefix(tokenName),
          value: formatSpacingValue(tokenData.value), // CSS 적합한 값으로 변환
          originalValue: tokenData.value, // 원본 값도 보존
          type: tokenData.type
        })
      }
    })

    return spacingTokens
  }

  /**
   * Font 토큰들을 추출하는 함수
   * @param {Object} otherTokens - 기타 토큰 객체
   * @returns {Array} font 토큰 배열
   */
  const getFontTokens = (otherTokens = {}) => {
    const fontTokens = []

    Object.entries(otherTokens).forEach(([tokenName, tokenData]) => {
      if (tokenData.type === 'fontFamilies' || tokenData.type === 'fontFamily') {
        fontTokens.push({
          name: removeTokenSetPrefix(tokenName),
          value: tokenData.value,
          type: tokenData.type
        })
      }
    })

    return fontTokens
  }

  /**
   * Asset 토큰들을 추출하는 함수
   * @param {Object} otherTokens - 기타 토큰 객체
   * @returns {Array} asset 토큰 배열
   */
  const getAssetTokens = (otherTokens = {}) => {
    const assetTokens = []

    Object.entries(otherTokens).forEach(([tokenName, tokenData]) => {
      if (tokenData.type === 'asset') {
        assetTokens.push({
          name: removeTokenSetPrefix(tokenName),
          value: tokenData.value,
          type: tokenData.type
        })
      }
    })

    return assetTokens
  }

  /**
   * Border 토큰들을 추출하는 함수
   * @param {Object} otherTokens - 기타 토큰 객체
   * @returns {Array} border 토큰 배열
   */
  const getBorderTokens = (otherTokens = {}) => {
    const borderTokens = []

    Object.entries(otherTokens).forEach(([tokenName, tokenData]) => {
      if (tokenData.type === 'border') {
        borderTokens.push({
          name: removeTokenSetPrefix(tokenName),
          value: tokenData.value,
          type: tokenData.type
        })
      }
    })

    return borderTokens
  }

  /**
   * Typography 토큰들을 추출하는 함수
   * @param {Object} otherTokens - 기타 토큰 객체
   * @returns {Array} typography 토큰 배열
   */
  const getTypographyTokens = (otherTokens = {}) => {
    const typographyTokens = []

    Object.entries(otherTokens).forEach(([tokenName, tokenData]) => {
      if (tokenData.type === 'typography') {
        typographyTokens.push({
          name: removeTokenSetPrefix(tokenName),
          value: tokenData.value,
          type: tokenData.type
        })
      }
    })

    return typographyTokens
  }

  /**
   * 시각화되지 않는 기타 토큰들을 추출하는 함수
   * @param {Object} otherTokens - 기타 토큰 객체
   * @returns {Array} 기타 토큰 배열
   */
  const getOtherNonVisualTokens = (otherTokens = {}) => {
    const otherNonVisualTokens = []
    const visualizedTypes = ['spacing', 'fontFamilies', 'fontFamily', 'asset', 'border', 'typography']

    Object.entries(otherTokens).forEach(([tokenName, tokenData]) => {
      // 이미 시각화된 타입들을 제외한 나머지 토큰들
      if (!visualizedTypes.includes(tokenData.type)) {
        otherNonVisualTokens.push({
          name: removeTokenSetPrefix(tokenName),
          value: tokenData.value || JSON.stringify(tokenData),
          type: tokenData.type || 'unknown'
        })
      }
    })

    return otherNonVisualTokens
  }

  return {
    // Utility functions
    removeTokenSetPrefix,
    formatSpacingValue,

    // Token extraction functions
    getSpacingTokens,
    getFontTokens,
    getAssetTokens,
    getBorderTokens,
    getTypographyTokens,
    getOtherNonVisualTokens
  }
}
