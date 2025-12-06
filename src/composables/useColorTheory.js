import { ref, computed } from 'vue'

export function useColorTheory() {
  const paletteTypes = ref([
    { id: 'analogous', name: 'Аналогичная', description: 'Соседние цвета на цветовом круге' },
    { id: 'monochromatic', name: 'Монохромная', description: 'Оттенки одного цвета' },
    { id: 'triadic', name: 'Триада', description: 'Три равноудаленных цвета' },
    { id: 'complementary', name: 'Комплементарная', description: 'Противоположные цвета' },
    { id: 'splitComplementary', name: 'Разделенная комплементарная', description: 'Основной цвет + два соседних к противоположному' },
    { id: 'tetradic', name: 'Тетрада', description: 'Четыре цвета в виде прямоугольника' },
    { id: 'square', name: 'Квадратная', description: 'Четыре равноудаленных цвета' }
  ])

  const moods = ref([
    { id: 'calm', name: 'Спокойная', colors: ['#4A90E2', '#7ED321', '#50E3C2', '#B8E986', '#F5A623'] },
    { id: 'energetic', name: 'Энергичная', colors: ['#FF6B6B', '#FFD93D', '#6BCF7F', '#4D96FF', '#9D4EDD'] },
    { id: 'professional', name: 'Профессиональная', colors: ['#2C3E50', '#34495E', '#7F8C8D', '#BDC3C7', '#ECF0F1'] },
    { id: 'vibrant', name: 'Яркая', colors: ['#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE'] },
    { id: 'pastel', name: 'Пастельная', colors: ['#FFB6C1', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA'] }
  ])

  // Конвертация HEX в HSL
  const hexToHsl = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    let r = parseInt(result[1], 16)
    let g = parseInt(result[2], 16)
    let b = parseInt(result[3], 16)
    
    r /= 255
    g /= 255
    b /= 255
    
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h, s, l = (max + min) / 2
    
    if (max === min) {
      h = s = 0
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }
    
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    }
  }

  // Конвертация HSL в HEX
  const hslToHex = (h, s, l) => {
    h /= 360
    s /= 100
    l /= 100
    
    let r, g, b
    
    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }
    
    const toHex = x => {
      const hex = Math.round(x * 255).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
  }

  // Генерация палитры по типу
  const generatePaletteByType = (baseColor, type, count = 5) => {
    const baseHsl = hexToHsl(baseColor)
    const colors = []
    
    switch (type) {
      case 'analogous':
        // Соседние цвета (±30 градусов)
        for (let i = 0; i < count; i++) {
          const hue = (baseHsl.h + (i - Math.floor(count / 2)) * 30 + 360) % 360
          const s = Math.min(100, baseHsl.s + (Math.random() * 20 - 10))
          const l = Math.min(100, baseHsl.l + (Math.random() * 20 - 10))
          colors.push(hslToHex(hue, s, l))
        }
        break
        
      case 'monochromatic':
        // Оттенки одного цвета
        for (let i = 0; i < count; i++) {
          const hue = baseHsl.h
          const s = Math.max(20, Math.min(100, baseHsl.s + (Math.random() * 40 - 20)))
          const l = Math.max(20, Math.min(80, baseHsl.l + (i - Math.floor(count / 2)) * 15))
          colors.push(hslToHex(hue, s, l))
        }
        break
        
      case 'triadic':
        // Три равноудаленных цвета
        for (let i = 0; i < count; i++) {
          const hue = (baseHsl.h + i * 120) % 360
          const s = Math.min(100, baseHsl.s + (Math.random() * 20 - 10))
          const l = Math.min(100, baseHsl.l + (Math.random() * 20 - 10))
          colors.push(hslToHex(hue, s, l))
        }
        break
        
      case 'complementary':
        // Противоположные цвета
        for (let i = 0; i < count; i++) {
          const hue = i % 2 === 0 ? baseHsl.h : (baseHsl.h + 180) % 360
          const s = Math.min(100, baseHsl.s + (Math.random() * 20 - 10))
          const l = Math.min(100, baseHsl.l + (Math.random() * 20 - 10))
          colors.push(hslToHex(hue, s, l))
        }
        break
        
      case 'splitComplementary':
        // Основной + два соседних к противоположному
        colors.push(baseColor)
        colors.push(hslToHex((baseHsl.h + 150) % 360, baseHsl.s, baseHsl.l))
        colors.push(hslToHex((baseHsl.h + 210) % 360, baseHsl.s, baseHsl.l))
        break
        
      default:
        // По умолчанию аналогичная
        for (let i = 0; i < count; i++) {
          const hue = (baseHsl.h + i * 72) % 360
          colors.push(hslToHex(hue, baseHsl.s, baseHsl.l))
        }
    }
    
    return colors
  }

  // Генерация акцентных цветов
  const generateAccentColors = (baseColors, count = 3) => {
    const accents = []
    const usedHues = new Set()
    
    // Собираем все оттенки из базовых цветов
    baseColors.forEach(color => {
      const hsl = hexToHsl(color)
      usedHues.add(hsl.h)
    })
    
    // Ищем свободные оттенки для акцентов
    for (let i = 0; i < count; i++) {
      let hue
      let attempts = 0
      
      do {
        hue = Math.floor(Math.random() * 360)
        attempts++
        
        // Проверяем, что цвет достаточно отличается
        const isDifferent = Array.from(usedHues).every(usedHue => {
          const diff = Math.abs(hue - usedHue)
          return Math.min(diff, 360 - diff) > 30
        })
        
        if (isDifferent || attempts > 100) break
      } while (true)
      
      const saturation = 70 + Math.random() * 20
      const lightness = 50 + Math.random() * 20
      accents.push(hslToHex(hue, saturation, lightness))
      usedHues.add(hue)
    }
    
    return accents
  }

  return {
    paletteTypes,
    moods,
    hexToHsl,
    hslToHex,
    generatePaletteByType,
    generateAccentColors
  }
}