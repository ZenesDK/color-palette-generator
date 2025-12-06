import { computed } from 'vue'

export function useExportFormats() {
  // Генерация CSS переменных
  const generateCSSVariables = (colors, prefix = 'color') => {
    let css = `:root {\n`
    
    colors.forEach((color, index) => {
      css += `  --${prefix}-${index + 1}: ${color};\n`
    })
    
    css += `}\n\n`
    css += `/* Использование */\n`
    css += `.element {\n`
    css += `  background-color: var(--${prefix}-1);\n`
    css += `  color: var(--${prefix}-2);\n`
    css += `}`
    
    return css
  }

  // Генерация SCSS переменных
  const generateSCSSVariables = (colors, prefix = 'color') => {
    let scss = `// SCSS переменные\n`
    
    colors.forEach((color, index) => {
      scss += `$${prefix}-${index + 1}: ${color};\n`
    })
    
    scss += `\n// Использование\n`
    scss += `.element {\n`
    scss += `  background-color: $${prefix}-1;\n`
    scss += `  color: $${prefix}-2;\n`
    scss += `}`
    
    return scss
  }

  // Генерация конфигурации Tailwind
  const generateTailwindConfig = (colors, prefix = 'palette') => {
    let config = `// tailwind.config.js\n`
    config += `module.exports = {\n`
    config += `  theme: {\n`
    config += `    extend: {\n`
    config += `      colors: {\n`
    config += `        '${prefix}': {\n`
    
    colors.forEach((color, index) => {
      config += `          '${index + 1}': '${color}',\n`
    })
    
    config += `        }\n`
    config += `      }\n`
    config += `    }\n`
    config += `  }\n`
    config += `}\n\n`
    config += `/* Использование в HTML */\n`
    config += `<!-- bg-palette-1 text-palette-2 -->`
    
    return config
  }

  // Генерация JSON
  const generateJSON = (colors, name = 'palette') => {
    const data = {
      name,
      colors,
      generatedAt: new Date().toISOString()
    }
    
    return JSON.stringify(data, null, 2)
  }

  // Генерация готового CSS
  const generateUtilityCSS = (colors, prefix = 'color') => {
    let css = `/* Utility classes for color palette */\n\n`
    
    // Background colors
    colors.forEach((color, index) => {
      css += `.bg-${prefix}-${index + 1} {\n`
      css += `  background-color: ${color} !important;\n`
      css += `}\n\n`
    })
    
    // Text colors
    colors.forEach((color, index) => {
      css += `.text-${prefix}-${index + 1} {\n`
      css += `  color: ${color} !important;\n`
      css += `}\n\n`
    })
    
    // Border colors
    colors.forEach((color, index) => {
      css += `.border-${prefix}-${index + 1} {\n`
      css += `  border-color: ${color} !important;\n`
      css += `}\n\n`
    })
    
    return css
  }

  // Создание шаринговой ссылки
  const generateShareableLink = (colors) => {
    const colorsString = colors.join('-').replace(/#/g, '')
    const baseUrl = window.location.origin
    return `${baseUrl}/palette/${colorsString}`
  }

  // Копирование в буфер обмена
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (err) {
      console.error('Failed to copy:', err)
      return false
    }
  }

  return {
    generateCSSVariables,
    generateSCSSVariables,
    generateTailwindConfig,
    generateJSON,
    generateUtilityCSS,
    generateShareableLink,
    copyToClipboard
  }
}