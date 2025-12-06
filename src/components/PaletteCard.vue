<template>
  <div class="palette-card" :class="{ 'list-view': viewMode === 'list' }">
    <div class="card-header">
      <h4 class="palette-name">{{ palette.name }}</h4>
      <div class="card-actions">
        <button
          class="action-btn"
          :title="isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'"
          @click="$emit('toggle-favorite', palette.id)"
        >
          {{ isFavorite ? '⭐' : '☆' }}
        </button>
        <button
          class="action-btn"
          title="Редактировать"
          @click="$emit('edit', palette)"
        >
          ✏️
        </button>
        <button
          class="action-btn"
          title="Удалить"
          @click="$emit('delete', palette.id)"
        >
          🗑️
        </button>
      </div>
    </div>
    
    <div class="palette-preview">
      <div
        v-for="(color, index) in palette.colors"
        :key="index"
        class="preview-color"
        :style="{ backgroundColor: color }"
        @click="$emit('select', palette)"
      >
        <span class="color-hex">{{ color }}</span>
      </div>
    </div>
    
    <div class="card-footer">
      <div class="palette-info">
        <div class="palette-tags">
          <span
            v-for="tag in palette.tags.slice(0, 3)"
            :key="tag"
            class="tag"
          >
            {{ tag }}
          </span>
          <span v-if="palette.tags.length > 3" class="more-tags">
            +{{ palette.tags.length - 3 }}
          </span>
        </div>
        <div class="palette-date">
          {{ formatDate(palette.createdAt) }}
        </div>
      </div>
      
      <button class="btn btn-select" @click="$emit('select', palette)">
        Использовать
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  palette: {
    type: Object,
    required: true
  },
  viewMode: {
    type: String,
    default: 'grid'
  },
  favorites: {
    type: Set,
    default: () => new Set()
  }
})

const emit = defineEmits(['select', 'edit', 'delete', 'toggle-favorite'])

const isFavorite = computed(() => {
  return props.favorites.has(props.palette.id)
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>

<style scoped>
.palette-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #e0e0e0;
}

.palette-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.palette-card.list-view {
  display: flex;
  align-items: center;
  padding: 1rem;
}

.card-header {
  padding: 1rem 1rem 0.5rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.palette-card.list-view .card-header {
  flex: 1;
  padding: 0;
  margin-right: 1rem;
}

.palette-name {
  margin: 0;
  color: #333;
  font-size: 1rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
}

.action-btn:hover {
  background: #f5f5f5;
}

.palette-preview {
  display: flex;
  height: 100px;
}

.palette-card.list-view .palette-preview {
  width: 200px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
}

.preview-color {
  flex: 1;
  position: relative;
  cursor: pointer;
  transition: flex 0.2s;
}

.preview-color:hover {
  flex: 2;
}

.color-hex {
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 4px;
  border-radius: 4px;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 10px;
  text-align: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.preview-color:hover .color-hex {
  opacity: 1;
}

.card-footer {
  padding: 1rem;
}

.palette-card.list-view .card-footer {
  flex: 1;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.palette-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.palette-card.list-view .palette-info {
  margin-bottom: 0;
}

.palette-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.tag {
  background: #f0f7ff;
  color: #667eea;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
}

.more-tags {
  color: #999;
  font-size: 0.7rem;
}

.palette-date {
  color: #999;
  font-size: 0.8rem;
}

.btn-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #667eea;
  background: white;
  color: #667eea;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-select:hover {
  background: #667eea;
  color: white;
}

.palette-card.list-view .btn-select {
  width: auto;
  padding: 6px 12px;
}
</style>