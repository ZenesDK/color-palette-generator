<template>
  <div class="generator-view">
    <div class="generator-header">
      <h1>🎨 Генератор палитр</h1>
      <p>Создавайте гармоничные цветовые схемы различными способами</p>
    </div>
    
    <div class="generator-container">
      <!-- Левая панель - управление -->
      <div class="control-panel">
        <PaletteControls
          :color-count="colorCount"
          :color-format="colorFormat"
          :locked-colors="lockedColors"
          @update:color-count="colorCount = $event"
          @update:color-format="colorFormat = $event"
          @generate="generateHarmonicPalette"
        />
        
        <!-- Выбор типа палитры -->
        <div class="control-section">
          <h3>Тип палитры</h3>
          <div class="palette-types">
            <button
              v-for="type in paletteTypes"
              :key="type.id"
              class="type-btn"
              :class="{ active: selectedType === type.id }"
              @click="generateByType(type.id)"
            >
              {{ type.name }}
            </button>
          </div>
        </div>
        
        <!-- Выбор базового цвета -->
        <div class="control-section">
          <h3>Базовый цвет</h3>
          <div class="color-picker-container">
            <input
              type="color"
              v-model="baseColor"
              class="color-picker"
              @change="generateFromBaseColor"
            />
            <span class="color-value">{{ baseColor }}</span>
          </div>
        </div>
        
        <!-- Настроения -->
        <div class="control-section">
          <h3>По настроению</h3>
          <div class="mood-grid">
            <button
              v-for="mood in moods"
              :key="mood.id"
              class="mood-btn"
              @click="applyMood(mood)"
            >
              {{ mood.name }}
            </button>
          </div>
        </div>
        
        <!-- Акцентные цвета -->
        <div class="control-section">
          <h3>Акцентные цвета</h3>
          <button class="btn" @click="generateAccents">
            🎯 Сгенерировать акценты
          </button>
          <div v-if="accentColors.length" class="accent-colors">
            <div
              v-for="(color, index) in accentColors"
              :key="index"
              class="accent-color"
              :style="{ backgroundColor: color }"
              @click="addAccentColor(color)"
            >
              <span class="accent-hex">{{ color }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Правая панель - отображение -->
      <div class="display-panel">
        <PaletteDisplay
          :colors="colors"
          :formatted-colors="formattedColors"
          :locked-colors="lockedColors"
          @copy="handleCopy"
          @toggle-lock="toggleLockColor"
        />
        
        <!-- Сохранение палитры -->
        <div class="save-section">
          <input
            type="text"
            v-model="paletteName"
            placeholder="Название палитры"
            class="palette-name-input"
          />
          <div class="tags-input">
            <input
              type="text"
              v-model="newTag"
              placeholder="Добавить тег"
              @keyup.enter="addTag"
              class="tag-input"
            />
            <div class="tags-list">
              <span v-for="tag in selectedTags" :key="tag" class="tag">
                {{ tag }}
                <button @click="removeTag(tag)" class="tag-remove">×</button>
              </span>
            </div>
          </div>
          <button class="btn btn-save" @click="saveCurrentPalette">
            💾 Сохранить в библиотеку
          </button>
        </div>
        
        <ColorWheel :colors="colors" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PaletteControls from '../components/PaletteControls.vue'
import PaletteDisplay from '../components/PaletteDisplay.vue'
import ColorWheel from '../components/ColorWheel.vue'
import { useColorPalette } from '../composables/useColorPalette'
import { useColorTheory } from '../composables/useColorTheory'
import { usePaletteLibrary } from '../composables/usePaletteLibrary'
import { useExportFormats } from '../composables/useExportFormats'

const {
  colors,
  colorCount,
  colorFormat,
  lockedColors,
  formattedColors,
  generateHarmonicPalette,
  copyToClipboard: copyColor,
  toggleLockColor: toggleLock
} = useColorPalette()

const {
  paletteTypes,
  moods,
  generatePaletteByType,
  generateAccentColors: generateAccentsTheory
} = useColorTheory()

const { savePalette } = usePaletteLibrary()
const { copyToClipboard } = useExportFormats()

const selectedType = ref('analogous')
const baseColor = ref('#667EEA')
const accentColors = ref([])
const paletteName = ref('')
const selectedTags = ref([])
const newTag = ref('')

const generateByType = (type) => {
  selectedType.value = type
  colors.value = generatePaletteByType(baseColor.value, type, colorCount.value)
}

const generateFromBaseColor = () => {
  generateByType(selectedType.value)
}

const applyMood = (mood) => {
  colors.value = [...mood.colors]
}

const generateAccents = () => {
  accentColors.value = generateAccentsTheory(colors.value, 3)
}

const addAccentColor = (color) => {
  colors.value.push(color)
}

const addTag = () => {
  if (newTag.value.trim() && !selectedTags.value.includes(newTag.value.trim())) {
    selectedTags.value.push(newTag.value.trim())
    newTag.value = ''
  }
}

const removeTag = (tagToRemove) => {
  selectedTags.value = selectedTags.value.filter(tag => tag !== tagToRemove)
}

const handleCopy = async (color) => {
  await copyColor(color)
}

const saveCurrentPalette = () => {
  if (!paletteName.value.trim()) {
    paletteName.value = `Палитра ${new Date().toLocaleDateString()}`
  }
  
  savePalette({
    colors: colors.value,
    format: colorFormat.value
  }, paletteName.value, '', selectedTags.value)
  
  paletteName.value = ''
  selectedTags.value = []
  
  // Показать уведомление через родительский компонент
  const app = document.querySelector('#app')
  if (app && app.__vue_app__) {
    app.__vue_app__.config.globalProperties.$notification?.('Палитра сохранена!', 'success')
  }
}
</script>

<style scoped>
.generator-view {
  max-width: 1400px;
  margin: 0 auto;
}

.generator-header {
  text-align: center;
  margin-bottom: 2rem;
}

.generator-header h1 {
  color: #333;
  margin-bottom: 0.5rem;
}

.generator-header p {
  color: #666;
}

.generator-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
}

.control-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.control-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.control-section h3 {
  margin-bottom: 1rem;
  color: #333;
  font-size: 1.1rem;
}

.palette-types {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.type-btn {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.type-btn:hover {
  border-color: #667eea;
  background: #f0f7ff;
}

.type-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.color-picker-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.color-picker {
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.color-value {
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 14px;
  color: #666;
}

.mood-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.mood-btn {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
}

.mood-btn:hover {
  background: #f5f7fa;
  transform: translateY(-2px);
}

.accent-colors {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}

.accent-color {
  flex: 1;
  height: 60px;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s;
}

.accent-color:hover {
  transform: scale(1.05);
}

.accent-hex {
  position: absolute;
  bottom: 5px;
  left: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 5px;
  border-radius: 4px;
  font-size: 10px;
  text-align: center;
}

.display-panel {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.save-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.palette-name-input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.palette-name-input:focus {
  outline: none;
  border-color: #667eea;
}

.tags-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tag-input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: #f0f7ff;
  color: #667eea;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 4px;
}

.tag-remove {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
}

.btn-save {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-save:hover {
  transform: translateY(-2px);
}

@media (max-width: 1024px) {
  .generator-container {
    grid-template-columns: 1fr;
  }
  
  .control-panel {
    order: 2;
  }
  
  .display-panel {
    order: 1;
  }
}

@media (max-width: 768px) {
  .mood-grid {
    grid-template-columns: 1fr;
  }
}
</style>