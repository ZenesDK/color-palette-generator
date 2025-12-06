<template>
  <div class="export-view">
    <div class="export-header">
      <h1>📤 Экспорт палитры</h1>
      <p>Экспортируйте вашу палитру в различные форматы для использования в проектах</p>
    </div>
    
    <div class="export-container">
      <!-- Предпросмотр палитры -->
      <div class="palette-preview-section">
        <h2>Текущая палитра</h2>
        <div class="palette-display">
          <div
            v-for="(color, index) in colors"
            :key="index"
            class="preview-color"
            :style="{ backgroundColor: color }"
          >
            <span class="color-label">{{ color }}</span>
          </div>
        </div>
      </div>
      
      <!-- Выбор формата экспорта -->
      <div class="format-selection">
        <h2>Форматы экспорта</h2>
        <div class="format-grid">
          <button
            v-for="format in exportFormats"
            :key="format.id"
            class="format-btn"
            :class="{ active: selectedFormat === format.id }"
            @click="selectFormat(format.id)"
          >
            <span class="format-icon">{{ format.icon }}</span>
            <span class="format-name">{{ format.name }}</span>
          </button>
        </div>
      </div>
      
      <!-- Редактор кода -->
      <div class="code-editor-section">
        <div class="editor-header">
          <h3>{{ selectedFormatName }} код</h3>
          <div class="editor-actions">
            <button class="action-btn" @click="copyCode">
              📋 Копировать
            </button>
            <button class="action-btn" @click="downloadCode">
              💾 Скачать
            </button>
          </div>
        </div>
        
        <div class="code-editor">
          <pre><code>{{ generatedCode }}</code></pre>
        </div>
        
        <div class="editor-options">
          <div class="option-group">
            <label for="prefix">Префикс переменных:</label>
            <input
              id="prefix"
              type="text"
              v-model="variablePrefix"
              class="prefix-input"
              placeholder="color"
            />
          </div>
          
          <div class="option-group">
            <label for="includeComments">
              <input
                id="includeComments"
                type="checkbox"
                v-model="includeComments"
              />
              Включать комментарии
            </label>
          </div>
        </div>
      </div>
      
      <!-- Превью UI компонентов -->
      <div class="ui-preview-section">
        <h2>Превью UI компонентов</h2>
        <div class="ui-components">
          <div class="ui-component">
            <h4>Кнопки</h4>
            <div class="component-preview">
              <button
                v-for="(color, index) in colors.slice(0, 3)"
                :key="index"
                class="ui-button"
                :style="{
                  backgroundColor: color,
                  color: getAccessibleTextColor(color)
                }"
              >
                Кнопка {{ index + 1 }}
              </button>
            </div>
          </div>
          
          <div class="ui-component">
            <h4>Карточки</h4>
            <div class="component-preview">
              <div
                class="ui-card"
                :style="{
                  borderTopColor: colors[0]
                }"
              >
                <h5>Заголовок карточки</h5>
                <p>Пример текста в карточке с использованием цветов палитры</p>
                <button
                  class="card-action"
                  :style="{
                    backgroundColor: colors[1],
                    color: getAccessibleTextColor(colors[1])
                  }"
                >
                  Действие
                </button>
              </div>
            </div>
          </div>
          
          <div class="ui-component">
            <h4>Формы</h4>
            <div class="component-preview">
              <div class="ui-form">
                <input
                  type="text"
                  placeholder="Введите текст"
                  class="form-input"
                  :style="{
                    borderColor: colors[2]
                  }"
                />
                <button
                  class="form-button"
                  :style="{
                    backgroundColor: colors[3],
                    color: getAccessibleTextColor(colors[3])
                  }"
                >
                  Отправить
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Шаринг -->
      <div class="sharing-section">
        <h2>Поделиться палитрой</h2>
        <div class="sharing-options">
          <div class="share-link">
            <input
              type="text"
              :value="shareableLink"
              readonly
              class="link-input"
              ref="linkInput"
            />
            <button class="copy-link-btn" @click="copyLink">
              📋 Копировать ссылку
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useColorPalette } from '../composables/useColorPalette'
import { useContrastChecker } from '../composables/useContrastChecker'
import { useExportFormats } from '../composables/useExportFormats'

const { colors } = useColorPalette()
const { getAccessibleTextColor } = useContrastChecker()
const {
  generateCSSVariables,
  generateSCSSVariables,
  generateTailwindConfig,
  generateJSON,
  generateUtilityCSS,
  generateShareableLink,
  copyToClipboard
} = useExportFormats()

const exportFormats = ref([
  { id: 'css', name: 'CSS Variables', icon: '🎨' },
  { id: 'scss', name: 'SCSS Variables', icon: '💅' },
  { id: 'tailwind', name: 'Tailwind Config', icon: '🎯' },
  { id: 'json', name: 'JSON', icon: '📊' },
  { id: 'utility', name: 'Utility CSS', icon: '⚡' }
])

const selectedFormat = ref('css')
const variablePrefix = ref('color')
const includeComments = ref(true)
const linkInput = ref(null)
const qrCanvas = ref(null)
const showQRCode = ref(false)

const selectedFormatName = computed(() => {
  const format = exportFormats.value.find(f => f.id === selectedFormat.value)
  return format ? format.name : 'CSS Variables'
})

const generatedCode = computed(() => {
  switch (selectedFormat.value) {
    case 'css':
      return generateCSSVariables(colors.value, variablePrefix.value)
    case 'scss':
      return generateSCSSVariables(colors.value, variablePrefix.value)
    case 'tailwind':
      return generateTailwindConfig(colors.value, variablePrefix.value)
    case 'json':
      return generateJSON(colors.value, 'Color Palette')
    case 'utility':
      return generateUtilityCSS(colors.value, variablePrefix.value)
    default:
      return generateCSSVariables(colors.value, variablePrefix.value)
  }
})

const shareableLink = computed(() => {
  return generateShareableLink(colors.value)
})

const selectFormat = (formatId) => {
  selectedFormat.value = formatId
}

const copyCode = async () => {
  const success = await copyToClipboard(generatedCode.value)
  if (success) {
    alert('Код скопирован в буфер обмена!')
  }
}

const downloadCode = () => {
  const blob = new Blob([generatedCode.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `palette-${new Date().getTime()}.${selectedFormat.value === 'json' ? 'json' : 'css'}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const copyLink = async () => {
  if (linkInput.value) {
    linkInput.value.select()
    const success = await copyToClipboard(shareableLink.value)
    if (success) {
      alert('Ссылка скопирована в буфер обмена!')
    }
  }
}

const generateQRCode = () => {
  showQRCode.value = true
  // В реальном приложении здесь была бы реализация генерации QR-кода
  setTimeout(() => {
    const ctx = qrCanvas.value?.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, 200, 200)
      ctx.fillStyle = '#000000'
      ctx.font = '16px Arial'
      ctx.fillText('QR Code', 70, 100)
      // В реальном приложении здесь был бы настоящий QR-код
    }
  }, 100)
}

const exportAsImage = () => {
  // В реальном приложении здесь была бы реализация экспорта в изображение
  alert('Функция экспорта в изображение будет реализована в следующей версии!')
}
</script>

<style scoped>
.export-view {
  max-width: 1200px;
  margin: 0 auto;
}

.export-header {
  text-align: center;
  margin-bottom: 2rem;
}

.export-header h1 {
  color: #333;
  margin-bottom: 0.5rem;
}

.export-header p {
  color: #666;
}

.export-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.palette-preview-section,
.format-selection,
.code-editor-section,
.ui-preview-section,
.sharing-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.palette-display {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.preview-color {
  flex: 1;
  min-width: 120px;
  height: 100px;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.color-label {
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 12px;
  text-align: center;
}

.format-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.format-btn {
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.format-btn:hover {
  border-color: #667eea;
  transform: translateY(-2px);
}

.format-btn.active {
  border-color: #667eea;
  background: #f0f7ff;
}

.format-icon {
  font-size: 2rem;
}

.format-name {
  font-weight: 600;
  color: #333;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.editor-header h3 {
  color: #333;
  margin: 0;
}

.editor-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f5f7fa;
}

.code-editor {
  background: #1e1e1e;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  overflow-x: auto;
}

.code-editor pre {
  margin: 0;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
}

.code-editor code {
  color: #d4d4d4;
}

.editor-options {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.option-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.prefix-input {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 120px;
}

.option-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #666;
}

.ui-components {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.ui-component h4 {
  color: #333;
  margin-bottom: 1rem;
}

.component-preview {
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f8f9fa;
}

.ui-button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
  transition: opacity 0.2s;
}

.ui-button:hover {
  opacity: 0.9;
}

.ui-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border-top: 4px solid;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ui-card h5 {
  margin: 0 0 1rem 0;
  color: #333;
}

.ui-card p {
  margin: 0 0 1rem 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.card-action {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
}

.ui-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-input {
  padding: 10px;
  border: 2px solid;
  border-radius: 6px;
  font-size: 14px;
}

.form-input:focus {
  outline: none;
}

.form-button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-start;
}

.sharing-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.share-link {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.link-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 14px;
  min-width: 300px;
}

.copy-link-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background: #667eea;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.copy-link-btn:hover {
  opacity: 0.9;
}

.share-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.share-btn {
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
}

.share-btn:hover {
  background: #f5f7fa;
  transform: translateY(-2px);
}

.qr-code-container {
  text-align: center;
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
}

.qr-code-container canvas {
  display: block;
  margin: 0 auto 1rem auto;
}

@media (max-width: 768px) {
  .format-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .editor-options {
    flex-direction: column;
    gap: 1rem;
  }
  
  .link-input {
    min-width: 100%;
  }
  
  .share-link {
    flex-direction: column;
  }
}
</style>