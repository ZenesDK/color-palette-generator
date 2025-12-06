import { ref, computed, watch } from 'vue'

export function useColorPalette() {
  // Состояние
  const colors = ref([])
  const colorCount = ref(5)
  const colorFormat = ref('hex')
  const lockedColors = ref({})
  const savedPalettes = ref([])
  
  // Генерация случайного цвета
  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }
  
  // Генерация гармоничной палитры
  const generateHarmonicPalette = () => {
    const baseHue = Math.floor(Math.random() * 360)
    const newColors = []
    
    for (let i = 0; i < colorCount.value; i++) {
      // Сохраняем закрепленные цвета
      if (lockedColors.value[i]) {
        newColors.push(colors.value[i])
        continue
      }
      
      // Генерируем гармоничные цвета на основе цветового круга
      const hue = (baseHue + (i * (360 / colorCount.value))) % 360
      const saturation = 60 + Math.random() * 30
      const lightness = 40 + Math.random() * 30
      
      newColors.push(hslToHex(hue, saturation, lightness))
    }
    
    colors.value = newColors
    saveToLocalStorage()
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
  
  // Конвертация HEX в RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }
  
  // Форматирование цвета
  const formatColor = (color) => {
    if (colorFormat.value === 'rgb') {
      const rgb = hexToRgb(color)
      return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
    }
    return color
  }
  
  // Копирование в буфер обмена
  const copyToClipboard = async (color) => {
    try {
      await navigator.clipboard.writeText(formatColor(color))
      return true
    } catch (err) {
      console.error('Failed to copy:', err)
      return false
    }
  }
  
  // Переключение закрепления цвета
  const toggleLockColor = (index) => {
    lockedColors.value = {
      ...lockedColors.value,
      [index]: !lockedColors.value[index]
    }
  }
  
  // Обновление цвета
  const updateColor = (index, newColor) => {
    const newColors = [...colors.value]
    newColors[index] = newColor
    colors.value = newColors
    saveToLocalStorage()
  }
  
  // Сохранение в localStorage
  const saveToLocalStorage = () => {
    const data = {
      colors: colors.value,
      lockedColors: lockedColors.value,
      colorCount: colorCount.value,
      colorFormat: colorFormat.value
    }
    localStorage.setItem('colorPalette', JSON.stringify(data))
  }
  
  // Загрузка из localStorage
  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('colorPalette')
    if (saved) {
      const data = JSON.parse(saved)
      colors.value = data.colors || []
      lockedColors.value = data.lockedColors || {}
      colorCount.value = data.colorCount || 5
      colorFormat.value = data.colorFormat || 'hex'
    } else {
      generateHarmonicPalette()
    }
  }
  
  // Вычисляемые свойства
  const formattedColors = computed(() => 
    colors.value.map(color => formatColor(color))
  )
  
  // Наблюдатели
  watch(colorCount, (newCount) => {
    if (colors.value.length < newCount) {
      // Добавляем новые цвета
      const newColors = [...colors.value]
      while (newColors.length < newCount) {
        newColors.push(generateRandomColor())
      }
      colors.value = newColors
    } else if (colors.value.length > newCount) {
      // Убираем лишние цвета
      colors.value = colors.value.slice(0, newCount)
      // Обновляем закрепленные цвета
      const newLocked = {}
      Object.keys(lockedColors.value).forEach(key => {
        if (parseInt(key) < newCount) {
          newLocked[key] = lockedColors.value[key]
        }
      })
      lockedColors.value = newLocked
    }
    saveToLocalStorage()
  })
  
  watch(colorFormat, saveToLocalStorage)
  
  // Инициализация
  loadFromLocalStorage()
  
  return {
    colors,
    colorCount,
    colorFormat,
    lockedColors,
    formattedColors,
    generateHarmonicPalette,
    copyToClipboard,
    toggleLockColor,
    updateColor,
    generateRandomColor,
    hexToRgb
  }
}