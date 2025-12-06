import { computed } from 'vue'

export function useContrastChecker() {
  // Конвертация HEX в относительную яркость
  const getLuminance = (hex) => {
    const rgb = hexToRgb(hex)
    
    const sRGB = [rgb.r / 255, rgb.g / 255, rgb.b / 255]
    
    const adjusted = sRGB.map(val => {
      return val <= 0.03928 
        ? val / 12.92 
        : Math.pow((val + 0.055) / 1.055, 2.4)
    })
    
    return 0.2126 * adjusted[0] + 0.7152 * adjusted[1] + 0.0722 * adjusted[2]
  }

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    }
  }

  // Расчет контрастности
  const getContrastRatio = (color1, color2) => {
    const lum1 = getLuminance(color1)
    const lum2 = getLuminance(color2)
    const brightest = Math.max(lum1, lum2)
    const darkest = Math.min(lum1, lum2)
    return (brightest + 0.05) / (darkest + 0.05)
  }

  // Проверка соответствия WCAG
  const checkWCAGCompliance = (color1, color2) => {
    const ratio = getContrastRatio(color1, color2)
    
    return {
      ratio: ratio.toFixed(2),
      aaNormal: ratio >= 4.5,
      aaLarge: ratio >= 3,
      aaaNormal: ratio >= 7,
      aaaLarge: ratio >= 4.5,
      level: ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'Недостаточно'
    }
  }

  // Проверка доступности текста на фоне
  const getAccessibleTextColor = (backgroundColor) => {
    const luminance = getLuminance(backgroundColor)
    return luminance > 0.179 ? '#000000' : '#FFFFFF'
  }

  // Анализ всей палитры
  const analyzePaletteContrast = (colors) => {
    const analysis = []
    
    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const contrast = checkWCAGCompliance(colors[i], colors[j])
        analysis.push({
          color1: colors[i],
          color2: colors[j],
          ...contrast
        })
      }
    }
    
    return analysis
  }

  return {
    getContrastRatio,
    checkWCAGCompliance,
    getAccessibleTextColor,
    analyzePaletteContrast,
    getLuminance
  }
}