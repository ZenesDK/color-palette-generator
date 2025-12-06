<template>
  <div class="palette-preview">
    <h3>Предпросмотр</h3>
    
    <div class="theme-toggle">
      <button 
        class="theme-btn"
        :class="{ active: !darkMode }"
        @click="darkMode = false"
      >
        🌞 Светлая тема
      </button>
      <button 
        class="theme-btn"
        :class="{ active: darkMode }"
        @click="darkMode = true"
      >
        🌙 Тёмная тема
      </button>
    </div>
    
    <div class="preview-container" :class="{ 'dark': darkMode }">
      <div class="preview-content">
        <!-- Кнопка -->
        <div class="preview-section">
          <h4>Кнопка</h4>
          <button 
            class="preview-btn"
            :style="{
              backgroundColor: colors[0],
              color: getContrastColor(colors[0])
            }"
          >
            Нажми меня
          </button>
        </div>
        
        <!-- Карточка -->
        <div class="preview-section">
          <h4>Карточка</h4>
          <div 
            class="preview-card"
            :style="{
              backgroundColor: colors[1],
              color: getContrastColor(colors[1])
            }"
          >
            <div class="card-header">
              <h5>Заголовок карточки</h5>
            </div>
            <div class="card-body">
              <p>Пример текста в карточке с использованием цвета палитры</p>
              <button 
                class="card-btn"
                :style="{
                  backgroundColor: colors[2],
                  color: getContrastColor(colors[2])
                }"
              >
                Действие
              </button>
            </div>
          </div>
        </div>
        
        <!-- Заголовок -->
        <div class="preview-section">
          <h4>Заголовок</h4>
          <h1 
            class="preview-heading"
            :style="{
              color: colors[3]
            }"
          >
            Основной заголовок
          </h1>
          <h3 
            class="preview-subheading"
            :style="{
              color: colors[4]
            }"
          >
            Подзаголовок
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  colors: {
    type: Array,
    required: true
  }
})

const darkMode = ref(false)

const getContrastColor = (hexColor) => {
  // Простой расчет контраста
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128 ? '#000000' : '#FFFFFF'
}
</script>

<style scoped>
.palette-preview {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.theme-toggle {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.theme-btn {
  flex: 1;
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.theme-btn.active {
  border-color: #4a90e2;
  background: #f0f7ff;
}

.preview-container {
  padding: 20px;
  border-radius: 8px;
  background: #f8f9fa;
}

.preview-container.dark {
  background: #1a1a1a;
}

.preview-container.dark h4 {
  color: #fff;
}

.preview-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.preview-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

h4 {
  margin: 0;
  color: #666;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.preview-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
}

.preview-btn:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

.preview-card {
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  margin-bottom: 15px;
}

.card-header h5 {
  margin: 0;
  font-size: 18px;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.card-body p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

.card-btn {
  align-self: flex-start;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.card-btn:hover {
  opacity: 0.8;
}

.preview-heading {
  margin: 0;
  font-size: 32px;
}

.preview-subheading {
  margin: 10px 0 0 0;
  font-size: 20px;
  font-weight: 400;
  opacity: 0.8;
}
</style>