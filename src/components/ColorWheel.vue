<template>
  <div class="color-wheel-container">
    <h3>Цветовой круг</h3>
    <div class="color-wheel-wrapper">
      <svg 
        :width="size" 
        :height="size" 
        viewBox="0 0 200 200" 
        class="color-wheel"
      >
        <!-- Цветовой круг -->
        <defs>
          <radialGradient id="wheelGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="white" stop-opacity="1"/>
            <stop offset="100%" stop-color="white" stop-opacity="0"/>
          </radialGradient>
        </defs>
        
        <!-- Секторы цветового круга -->
        <g v-for="(sector, index) in sectors" :key="index">
          <path
            :d="sector.path"
            :fill="sector.color"
            stroke="#fff"
            stroke-width="0.5"
          />
        </g>
        
        <!-- Градиент для плавности -->
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="url(#wheelGradient)"
        />
        
        <!-- Точки цветов палитры -->
        <circle
          v-for="(point, index) in colorPoints"
          :key="`point-${index}`"
          :cx="point.x"
          :cy="point.y"
          r="4"
          :fill="colors[index]"
          stroke="#fff"
          stroke-width="2"
        />
        
        <!-- Центр -->
        <circle
          cx="100"
          cy="100"
          r="5"
          fill="#333"
        />
      </svg>
      
      <div class="color-legend">
        <div
          v-for="(color, index) in colors"
          :key="index"
          class="legend-item"
        >
          <div
            class="legend-color"
            :style="{ backgroundColor: color }"
          />
          <span class="legend-hex">{{ color }}</span>
          <span class="legend-hsl">({{ getHslString(color) }})</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useColorTheory } from '../composables/useColorTheory'

const props = defineProps({
  colors: {
    type: Array,
    required: true
  },
  size: {
    type: Number,
    default: 200
  }
})

const { hexToHsl } = useColorTheory()

// Создание цветового круга
const sectors = computed(() => {
  const sectors = []
  const steps = 360
  const radius = 90
  const centerX = 100
  const centerY = 100
  
  for (let i = 0; i < steps; i++) {
    const angle1 = (i / steps) * 2 * Math.PI
    const angle2 = ((i + 1) / steps) * 2 * Math.PI
    
    const x1 = centerX + radius * Math.cos(angle1)
    const y1 = centerY + radius * Math.sin(angle1)
    const x2 = centerX + radius * Math.cos(angle2)
    const y2 = centerY + radius * Math.sin(angle2)
    
    // HSL цвет для сектора
    const hue = (i / steps) * 360
    const color = `hsl(${hue}, 100%, 50%)`
    
    sectors.push({
      color,
      path: `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`
    })
  }
  
  return sectors
})

// Позиции цветов на круге
const colorPoints = computed(() => {
  const points = []
  const radius = 70
  const centerX = 100
  const centerY = 100
  
  props.colors.forEach((color, index) => {
    const hsl = hexToHsl(color)
    const angle = (hsl.h / 360) * 2 * Math.PI
    
    points.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      color,
      hue: hsl.h
    })
  })
  
  return points
})

const getHslString = (hex) => {
  const hsl = hexToHsl(hex)
  return `${hsl.h}°, ${hsl.s}%, ${hsl.l}%`
}
</script>

<style scoped>
.color-wheel-container {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.color-wheel-container h3 {
  margin-bottom: 1rem;
  color: #333;
}

.color-wheel-wrapper {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.color-wheel {
  border-radius: 50%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.color-legend {
  flex: 1;
  min-width: 200px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.legend-color {
  width: 30px;
  height: 30px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.legend-hex {
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 12px;
  color: #333;
}

.legend-hsl {
  font-size: 11px;
  color: #666;
  margin-left: auto;
}

@media (max-width: 768px) {
  .color-wheel-wrapper {
    flex-direction: column;
  }
  
  .color-legend {
    width: 100%;
  }
}
</style>