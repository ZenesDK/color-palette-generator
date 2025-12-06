<template>
  <div class="palette-controls">
    <div class="controls-row">
      <button class="btn generate-btn" @click="generatePalette">
        🎨 Новая палитра
      </button>
      
      <div class="control-group">
        <label for="colorCount">Количество цветов:</label>
        <select id="colorCount" v-model="colorCount" class="select">
          <option value="3">3</option>
          <option value="5">5</option>
          <option value="7">7</option>
        </select>
      </div>
      
      <div class="control-group">
        <label for="colorFormat">Формат:</label>
        <select id="colorFormat" v-model="colorFormat" class="select">
          <option value="hex">HEX</option>
          <option value="rgb">RGB</option>
        </select>
      </div>
    </div>
    
    <div class="locked-info" v-if="hasLockedColors">
      🔒 Закреплено {{ lockedCount }} цветов
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  colorCount: {
    type: Number,
    required: true
  },
  colorFormat: {
    type: String,
    required: true
  },
  lockedColors: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:colorCount', 'update:colorFormat', 'generate'])

const colorCount = computed({
  get: () => props.colorCount,
  set: (value) => emit('update:colorCount', parseInt(value))
})

const colorFormat = computed({
  get: () => props.colorFormat,
  set: (value) => emit('update:colorFormat', value)
})

const hasLockedColors = computed(() => {
  return Object.values(props.lockedColors).some(Boolean)
})

const lockedCount = computed(() => {
  return Object.values(props.lockedColors).filter(Boolean).length
})

const generatePalette = () => {
  emit('generate')
}
</script>

<style scoped>
.palette-controls {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.controls-row {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

label {
  font-size: 14px;
  color: #666;
}

.select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

.select:focus {
  outline: none;
  border-color: #4a90e2;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.generate-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.generate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.locked-info {
  margin-top: 15px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>