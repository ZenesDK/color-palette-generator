<template>
  <div id="app">
    <header class="app-header">
      <h1>🎨 Генератор цветовых палитр</h1>
      <p class="subtitle">Создавайте гармоничные цветовые схемы для ваших проектов</p>
    </header>
    
    <main class="app-main">
      <PaletteControls
        :color-count="colorCount"
        :color-format="colorFormat"
        :locked-colors="lockedColors"
        @update:color-count="colorCount = $event"
        @update:color-format="colorFormat = $event"
        @generate="generateHarmonicPalette"
      />
      
      <PaletteDisplay
        :colors="colors"
        :formatted-colors="formattedColors"
        :locked-colors="lockedColors"
        @copy="copyToClipboard"
        @toggle-lock="toggleLockColor"
      />
      
      <PalettePreview :colors="colors" />
      
      <div class="app-info">
        <p>💡 Подсказка: Кликните на цвет, чтобы скопировать его значение. Нажмите 🔒 чтобы закрепить цвет при генерации новой палитры.</p>
        <p>🔄 Палитра автоматически сохраняется в вашем браузере</p>
      </div>
    </main>
    
    <footer class="app-footer">
      <p>Генератор цветовых палитр | Практика 27</p>
    </footer>
    
    <!-- Глобальное уведомление -->
    <transition name="fade">
      <div v-if="globalNotification" class="global-notification">
        {{ globalNotification }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useColorPalette } from './composables/useColorPalette'
import PaletteControls from './components/PaletteControls.vue'
import PaletteDisplay from './components/PaletteDisplay.vue'
import PalettePreview from './components/PalettePreview.vue'

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

const globalNotification = ref('')
let globalNotificationTimeout = null

const copyToClipboard = async (color) => {
  const success = await copyColor(color)
  if (success) {
    showGlobalNotification('Цвет скопирован в буфер обмена!')
  } else {
    showGlobalNotification('Не удалось скопировать цвет', 'error')
  }
  return success
}

const toggleLockColor = (index) => {
  toggleLock(index)
  const isNowLocked = lockedColors.value[index]
  showGlobalNotification(
    isNowLocked ? 'Цвет закреплен 🔒' : 'Цвет разблокирован 🔓'
  )
}

const showGlobalNotification = (message, type = 'success') => {
  globalNotification.value = message
  if (globalNotificationTimeout) {
    clearTimeout(globalNotificationTimeout)
  }
  globalNotificationTimeout = setTimeout(() => {
    globalNotification.value = ''
  }, 3000)
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 20px;
}

#app {
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
}

.app-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
}

.app-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.app-info {
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid #4a90e2;
  font-size: 14px;
  color: #666;
}

.app-info p {
  margin: 5px 0;
}

.app-footer {
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 14px;
  margin-top: 30px;
  border-top: 1px solid #e0e0e0;
}

.global-notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #4caf50;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .app-header h1 {
    font-size: 2rem;
  }
  
  .palette-container {
    flex-direction: column;
    height: auto;
  }
  
  .color-card {
    min-height: 120px;
  }
  
  .controls-row {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>