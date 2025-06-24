/**
 * 토큰 데이터 관리를 위한 Composable
 * 토큰 로딩, 새로고침, 상태 관리 기능 제공
 */
export const useTokens = () => {
  // Reactive state
  const lastUpdated = ref(new Date().toLocaleString('ko-KR'))
  const colorPalettes = ref({})
  const singleColors = ref({})
  const otherTokens = ref({})
  const isRefreshing = ref(false)
  const loadingError = ref('')

  /**
   * 토큰을 동적으로 로드하는 함수
   * GitHub Pages 호환성을 위해 정적 JSON 파일 사용
   * @returns {Promise<void>}
   */
  const loadTokens = async () => {
    try {
      loadingError.value = ''

      // 우선 API 엔드포인트 시도 (로컬 개발용)
      let response
      try {
        response = await $fetch('/api/tokens', {method: 'GET'})
        console.log('📡 API 엔드포인트에서 토큰 로드 성공')
      } catch (apiError) {
        console.log('📄 API 엔드포인트 실패, 정적 파일 사용 중...')

        // API 실패 시 정적 JSON 파일 사용 (GitHub Pages용)
        const {$config} = useNuxtApp()
        const baseURL = $config.public.baseURL || '/figma_mcp'
        const staticResponse = await fetch(`${baseURL}/api/tokens.json`)
        if (!staticResponse.ok) {
          throw new Error(`정적 파일 로드 실패: ${staticResponse.status}`)
        }
        response = await staticResponse.json()
        console.log('📄 정적 JSON 파일에서 토큰 로드 성공')
      }

      if (response.success && response.data) {
        // 색상 팔레트 (slate, sky 등)
        const {single, ...palettes} = response.data.colors
        colorPalettes.value = palettes

        // 단일 색상 (black, white, primary, secondary)
        singleColors.value = single || {}

        // 기타 토큰들
        otherTokens.value = response.data.other || {}

        console.log('🎨 토큰 로드 완료:', {
          팔레트: Object.keys(colorPalettes.value).length,
          단일색상: Object.keys(singleColors.value).length,
          기타: Object.keys(otherTokens.value).length,
          소스: response.data.statistics?.buildTime ? '정적 파일' : 'API 엔드포인트'
        })
      } else {
        throw new Error(response.error?.message || '응답 형식이 올바르지 않습니다')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류'
      loadingError.value = errorMessage
      console.error('🚨 토큰 로드 실패:', errorMessage)

      // 기본값 설정
      colorPalettes.value = {
        slate: {
          50: {value: '#f8fafc', type: 'color'},
          500: {value: '#64748b', type: 'color'},
          900: {value: '#0f172a', type: 'color'}
        }
      }
      singleColors.value = {
        black: {value: '#000000', type: 'color'},
        white: {value: '#ffffff', type: 'color'}
      }
      otherTokens.value = {}
    }
  }

  /**
   * 토큰을 새로고침하는 함수
   * @returns {Promise<void>}
   */
  const refreshTokens = async () => {
    isRefreshing.value = true
    try {
      await loadTokens()
      lastUpdated.value = new Date().toLocaleString('ko-KR')
      console.log('토큰 새로고침 완료')
    } catch (error) {
      console.error('토큰 새로고침 실패:', error)
    } finally {
      isRefreshing.value = false
    }
  }

  /**
   * 전체 색상 개수를 계산하는 함수
   * @returns {number} 총 색상 개수
   */
  const getTotalColorsCount = () => {
    const paletteCount = Object.values(colorPalettes.value).reduce((total, group) => total + Object.keys(group).length, 0)
    const singleCount = Object.keys(singleColors.value).length
    return paletteCount + singleCount
  }

  return {
    // State
    lastUpdated: readonly(lastUpdated),
    colorPalettes: readonly(colorPalettes),
    singleColors: readonly(singleColors),
    otherTokens: readonly(otherTokens),
    isRefreshing: readonly(isRefreshing),
    loadingError: readonly(loadingError),

    // Methods
    loadTokens,
    refreshTokens,
    getTotalColorsCount
  }
}
