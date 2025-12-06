<template>
  <div class="analyze-view">
    <div class="analyze-header">
      <h1>📊 Анализ доступности</h1>
      <p>Проверьте контрастность вашей палитры по стандартам WCAG</p>
    </div>
    
    <div class="analyze-container">
      <!-- Текущая палитра -->
      <div class="current-palette-section">
        <h2>Текущая палитра</h2>
        <div class="palette-preview">
          <div
            v-for="(color, index) in colors"
            :key="index"
            class="color-swatch"
            :style="{ backgroundColor: color }"
          >
            <span class="color-hex">{{ color }}</span>
          </div>
        </div>
      </div>
      
      <!-- Проверка контраста -->
      <div class="contrast-checker-section">
        <h2>Проверка контрастности</h2>
        <div class="contrast-grid">
          <div
            v-for="(item, index) in contrastAnalysis"
            :key="index"
            class="contrast-item"
          >
            <div class="contrast-colors">
              <div
                class="contrast-color"
                :style="{ backgroundColor: item.color1 }"
              >
                <span>{{ item.color1 }}</span>
              </div>
              <div class="contrast-vs">vs</div>
              <div
                class="contrast-color"
                :style="{ backgroundColor: item.color2 }"
              >
                <span>{{ item.color2 }}</span>
              </div>
            </div>
            
            <div class="contrast-results">
              <div class="contrast-ratio">
                Контраст: <strong>{{ item.ratio }}:1</strong>
              </div>
              
              <div class="wcag-levels">
                <div
                  class="wcag-level"
                  :class="{ passed: item.aaNormal }"
                >
                  AA (normal): {{ item.aaNormal ? '✅' : '❌' }}
                </div>
                <div
                  class="wcag-level"
                  :class="{ passed: item.aaLarge }"
                >
                  AA (large): {{ item.aaLarge ? '✅' : '❌' }}
                </div>
                <div
                  class="wcag-level"
                  :class="{ passed: item.aaaNormal }"
                >
                  AAA (normal): {{ item.aaaNormal ? '✅' : '❌' }}
                </div>
                <div
                  class="wcag-level"
                  :class="{ passed: item.aaaLarge }"
                >
                  AAA (large): {{ item.aaaLarge ? '✅' : '❌' }}
                </div>
              </div>
              
              <div class="contrast-level" :class="getLevelClass(item.level)">
                Уровень: {{ item.level }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Рекомендации по доступности -->
      <div class="accessibility-recommendations">
        <h2>Рекомендации по доступности</h2>
        <div class="recommendations-grid">
          <div class="recommendation-card">
            <div class="rec-icon">🔤</div>
            <h3>Текст на фоне</h3>
            <p v-if="bestTextContrast">
              Лучшее сочетание для текста: {{ bestTextContrast.color1 }} на {{ bestTextContrast.color2 }}
              (контраст {{ bestTextContrast.ratio }}:1)
            </p>
          </div>
          
          <div class="recommendation-card">
            <div class="rec-icon">🎯</div>
            <h3>Акцентные элементы</h3>
            <p>Используйте цвета с контрастом не менее 3:1 для интерактивных элементов</p>
          </div>
          
          <div class="recommendation-card">
            <div class="rec-icon">👁️</div>
            <h3>Для слабовидящих</h3>
            <p>Рекомендуемый минимальный контраст: 4.5:1 для нормального текста</p>
          </div>
        </div>
      </div>
      
      <!-- Тестирование текста -->
      <div class="text-test-section">
        <h2>Тестирование текста</h2>
        <div class="text-test-container">
          <div
            v-for="color in colors"
            :key="color"
            class="text-test-item"
            :style="{
              backgroundColor: color,
              color: getAccessibleTextColor(color)
            }"
          >
            <p class="text-normal">
              Нормальный текст (16px) на фоне {{ color }}
            </p>
            <p class="text-large">
              Крупный текст (24px) на фоне {{ color }}
            </p>
            <button
              class="test-button"
              :style="{
                backgroundColor: getAccessibleTextColor(color),
                color: color
              }"
            >
              Пример кнопки
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useColorPalette } from '../composables/useColorPalette'
import { useContrastChecker } from '../composables/useContrastChecker'

const { colors } = useColorPalette()
const {
  analyzePaletteContrast,
  getAccessibleTextColor,
  checkWCAGCompliance
} = useContrastChecker()

const contrastAnalysis = computed(() => {
  return analyzePaletteContrast(colors.value)
})

const bestTextContrast = computed(() => {
  if (!contrastAnalysis.value.length) return null
  
  return contrastAnalysis.value.reduce((best, current) => {
    return parseFloat(current.ratio) > parseFloat(best.ratio) ? current : best
  })
})

const getLevelClass = (level) => {
  switch (level) {
    case 'AAA': return 'level-aaa'
    case 'AA': return 'level-aa'
    default: return 'level-insufficient'
  }
}
</script>

<style scoped>
.analyze-view {
  max-width: 1200px;
  margin: 0 auto;
}

.analyze-header {
  text-align: center;
  margin-bottom: 2rem;
}

.analyze-header h1 {
  color: #333;
  margin-bottom: 0.5rem;
}

.analyze-header p {
  color: #666;
}

.analyze-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.current-palette-section,
.contrast-checker-section,
.accessibility-recommendations,
.text-test-section {
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

.palette-preview {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.color-swatch {
  flex: 1;
  min-width: 100px;
  height: 80px;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.color-hex {
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 12px;
  text-align: center;
}

.contrast-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contrast-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.contrast-colors {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 300px;
}

.contrast-color {
  flex: 1;
  height: 60px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.contrast-color span {
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.contrast-vs {
  color: #666;
  font-weight: 600;
}

.contrast-results {
  flex: 2;
  min-width: 300px;
}

.contrast-ratio {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.wcag-levels {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.wcag-level {
  padding: 0.5rem;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 0.9rem;
}

.wcag-level.passed {
  background: #e8f5e9;
  color: #2e7d32;
}

.contrast-level {
  padding: 0.5rem;
  border-radius: 4px;
  font-weight: 600;
  text-align: center;
}

.level-aaa {
  background: #c8e6c9;
  color: #1b5e20;
}

.level-aa {
  background: #fff3e0;
  color: #e65100;
}

.level-insufficient {
  background: #ffebee;
  color: #c62828;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.recommendation-card {
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  text-align: center;
}

.rec-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.recommendation-card h3 {
  margin-bottom: 0.5rem;
  color: #333;
}

.recommendation-card p {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}

.text-test-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.text-test-item {
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.text-normal {
  font-size: 16px;
  margin: 0;
}

.text-large {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.test-button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  align-self: flex-start;
}

.test-button:hover {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .contrast-colors,
  .contrast-results {
    min-width: 100%;
  }
  
  .wcag-levels {
    grid-template-columns: 1fr;
  }
}
</style>