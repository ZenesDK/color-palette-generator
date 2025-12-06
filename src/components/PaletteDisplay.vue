<template>
  <div class="palette-display">
    <div class="palette-container">
      <ColorCard
        v-for="(color, index) in colors"
        :key="index"
        :color="color"
        :formatted-color="formattedColors[index]"
        :index="index"
        :is-locked="lockedColors[index]"
        @copy="handleCopy"
        @toggle-lock="handleToggleLock"
      />
    </div>
  </div>
</template>

<script setup>
import ColorCard from './ColorCard.vue'

const props = defineProps({
  colors: {
    type: Array,
    required: true
  },
  formattedColors: {
    type: Array,
    required: true
  },
  lockedColors: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['copy', 'toggle-lock'])

const handleCopy = async (color) => {
  const success = await emit('copy', color)
  return success
}

const handleToggleLock = (index) => {
  emit('toggle-lock', index)
}
</script>

<style scoped>
.palette-display {
  margin: 20px 0;
}

.palette-container {
  display: flex;
  gap: 8px;
  height: 240px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
</style>