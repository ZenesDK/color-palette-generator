<template>
  <div 
    class="color-card"
    :style="{ backgroundColor: color }"
    @click="handleClick"
  >
    <div class="color-card-content" :class="{ 'text-light': isDark }">
      <div class="color-info">
        <div class="color-value">{{ formattedColor }}</div>
        <button 
          class="lock-btn"
          @click.stop="toggleLock"
          :class="{ locked: isLocked }"
          :title="isLocked ? 'Разблокировать' : 'Заблокировать'"
        >
          {{ isLocked ? '🔒' : '🔓' }}
        </button>
      </div>
      <div v-if="showNotification" class="copy-notification">
        Скопировано!
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  color: {
    type: String,
    required: true
  },
  formattedColor: {
    type: String,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  isLocked: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['copy', 'toggle-lock'])

const showNotification = ref(false)
let notificationTimeout = null

const isDark = computed(() => {
  // Простой расчет яркости цвета
  const hex = props.color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness < 128
})

const handleClick = async () => {
  const success = await emit('copy', props.color)
  if (success) {
    showNotification.value = true
    if (notificationTimeout) {
      clearTimeout(notificationTimeout)
    }
    notificationTimeout = setTimeout(() => {
      showNotification.value = false
    }, 2000)
  }
}

const toggleLock = () => {
  emit('toggle-lock', props.index)
}
</script>

<style scoped>
.color-card {
  position: relative;
  flex: 1;
  min-height: 200px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.color-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.color-card-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
}

.color-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.color-value {
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 14px;
  font-weight: 600;
}

.text-light {
  color: white;
}

.text-dark {
  color: #333;
}

.lock-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
  backdrop-filter: blur(10px);
  transition: background 0.2s;
}

.lock-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.lock-btn.locked {
  background: rgba(0, 0, 0, 0.3);
}

.copy-notification {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  animation: fadeInOut 2s ease-in-out;
}

@keyframes fadeInOut {
  0%, 100% { opacity: 0; }
  20%, 80% { opacity: 1; }
}
</style>