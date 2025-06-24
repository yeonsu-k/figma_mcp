/**
 * 클립보드 복사 기능을 위한 Composable
 * 텍스트 복사, 토스트 알림, 에러 처리 기능 제공
 */
export const useClipboard = () => {
  // Toast 상태 관리
  const showToast = ref(false)
  const toastMessage = ref('')
  const toastType = ref('success') // 'success' | 'error'

  /**
   * 클립보드에 텍스트를 복사하는 함수
   * @param {string} value - 복사할 값
   * @param {string} customMessage - 사용자 정의 토스트 메시지 (선택적)
   * @returns {Promise<boolean>} 복사 성공 여부
   */
  const copyToClipboard = async (value, customMessage = '') => {
    try {
      // 클립보드 API 지원 여부 확인
      if (!navigator.clipboard) {
        throw new Error('클립보드 API를 지원하지 않는 브라우저입니다.')
      }

      await navigator.clipboard.writeText(value)

      // 성공 토스트 표시
      showSuccessToast(customMessage || `"${value}" 복사됨`)

      console.log('클립보드 복사 성공:', value)
      return true
    } catch (error) {
      console.error('클립보드 복사 실패:', error)

      // 대체 방법 시도 (deprecated이지만 fallback으로 사용)
      try {
        const result = await fallbackCopyToClipboard(value)
        if (result) {
          showSuccessToast(customMessage || `"${value}" 복사됨`)
          return true
        }
      } catch (fallbackError) {
        console.error('대체 복사 방법도 실패:', fallbackError)
      }

      // 에러 토스트 표시
      showErrorToast('복사에 실패했습니다.')
      return false
    }
  }

  /**
   * 대체 클립보드 복사 방법 (구형 브라우저 지원)
   * @param {string} text - 복사할 텍스트
   * @returns {Promise<boolean>} 복사 성공 여부
   */
  const fallbackCopyToClipboard = async text => {
    return new Promise(resolve => {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      try {
        const result = document.execCommand('copy')
        resolve(result)
      } catch (error) {
        console.error('execCommand 복사 실패:', error)
        resolve(false)
      } finally {
        document.body.removeChild(textArea)
      }
    })
  }

  /**
   * 성공 토스트를 표시하는 함수
   * @param {string} message - 토스트 메시지
   * @param {number} duration - 토스트 지속 시간 (밀리초)
   */
  const showSuccessToast = (message, duration = 2000) => {
    toastMessage.value = message
    toastType.value = 'success'
    showToast.value = true

    setTimeout(() => {
      hideToast()
    }, duration)
  }

  /**
   * 에러 토스트를 표시하는 함수
   * @param {string} message - 토스트 메시지
   * @param {number} duration - 토스트 지속 시간 (밀리초)
   */
  const showErrorToast = (message, duration = 3000) => {
    toastMessage.value = message
    toastType.value = 'error'
    showToast.value = true

    setTimeout(() => {
      hideToast()
    }, duration)
  }

  /**
   * 토스트를 숨기는 함수
   */
  const hideToast = () => {
    showToast.value = false
    // 애니메이션 완료 후 메시지 클리어
    setTimeout(() => {
      toastMessage.value = ''
      toastType.value = 'success'
    }, 300)
  }

  /**
   * 토큰 값을 클립보드에 복사하는 특화 함수
   * @param {string} tokenValue - 토큰 값
   * @param {string} tokenName - 토큰 이름 (선택적)
   * @returns {Promise<boolean>} 복사 성공 여부
   */
  const copyTokenValue = async (tokenValue, tokenName = '') => {
    const displayName = tokenName ? `${tokenName}: ${tokenValue}` : tokenValue
    return await copyToClipboard(tokenValue, `${displayName} 복사됨`)
  }

  /**
   * CSS 변수를 클립보드에 복사하는 함수
   * @param {string} tokenName - 토큰 이름
   * @param {string} tokenValue - 토큰 값
   * @returns {Promise<boolean>} 복사 성공 여부
   */
  const copyCssVariable = async (tokenName, tokenValue) => {
    const cssVar = `--${tokenName}: ${tokenValue};`
    return await copyToClipboard(cssVar, `CSS 변수 복사됨`)
  }

  return {
    // State
    showToast: readonly(showToast),
    toastMessage: readonly(toastMessage),
    toastType: readonly(toastType),

    // Methods
    copyToClipboard,
    copyTokenValue,
    copyCssVariable,
    showSuccessToast,
    showErrorToast,
    hideToast
  }
}
