<template>
  <div class="library-view">
    <div class="library-header">
      <h1>💾 Библиотека палитр</h1>
      <p>Управляйте вашими сохраненными палитрами и коллекциями</p>
    </div>
    
    <div class="library-container">
      <!-- Панель управления -->
      <div class="library-controls">
        <div class="search-box">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Поиск палитр..."
            class="search-input"
          />
          <span class="search-icon">🔍</span>
        </div>
        
        <div class="filter-section">
          <h3>Теги</h3>
          <div class="tags-filter">
            <button
              v-for="tag in allTags"
              :key="tag"
              class="tag-filter"
              :class="{ active: selectedTags.includes(tag) }"
              @click="toggleTagFilter(tag)"
            >
              {{ tag }}
            </button>
          </div>
        </div>
        
        <div class="view-options">
          <h3>Вид</h3>
          <div class="view-buttons">
            <button
              class="view-btn"
              :class="{ active: viewMode === 'grid' }"
              @click="viewMode = 'grid'"
            >
              📱 Сетка
            </button>
            <button
              class="view-btn"
              :class="{ active: viewMode === 'list' }"
              @click="viewMode = 'list'"
            >
              📋 Список
            </button>
          </div>
        </div>
      </div>
      
      <!-- Список палитр -->
      <div class="palettes-section">
        <div class="section-header">
          <h2>Мои палитры ({{ filteredPalettes.length }})</h2>
          <button class="btn btn-new-collection" @click="showNewCollectionModal = true">
            📁 Новая коллекция
          </button>
        </div>
        
        <!-- Избранное -->
        <div v-if="favoritePalettes.length > 0" class="favorites-section">
          <h3>⭐ Избранное</h3>
          <div class="palettes-grid" :class="{ 'list-view': viewMode === 'list' }">
            <PaletteCard
              v-for="palette in favoritePalettes"
              :key="palette.id"
              :palette="palette"
              :view-mode="viewMode"
              @select="selectPalette"
              @edit="editPalette"
              @delete="deletePalette"
              @toggle-favorite="toggleFavorite"
            />
          </div>
        </div>
        
        <!-- Все палитры -->
        <div class="all-palettes-section">
          <h3>Все палитры</h3>
          <div v-if="filteredPalettes.length === 0" class="empty-state">
            <div class="empty-icon">🎨</div>
            <p>Палитры не найдены</p>
            <p class="empty-subtext">Создайте новую палитру или измените параметры поиска</p>
          </div>
          
          <div v-else class="palettes-grid" :class="{ 'list-view': viewMode === 'list' }">
            <PaletteCard
              v-for="palette in filteredPalettes"
              :key="palette.id"
              :palette="palette"
              :view-mode="viewMode"
              @select="selectPalette"
              @edit="editPalette"
              @delete="deletePalette"
              @toggle-favorite="toggleFavorite"
            />
          </div>
        </div>
      </div>
      
      <!-- Коллекции -->
      <div class="collections-section">
        <h2>Коллекции</h2>
        <div v-if="collections.length === 0" class="empty-collections">
          <p>Коллекций пока нет</p>
          <button class="btn" @click="showNewCollectionModal = true">
            Создать коллекцию
          </button>
        </div>
        
        <div v-else class="collections-grid">
          <div
            v-for="collection in collections"
            :key="collection.id"
            class="collection-card"
          >
            <div class="collection-header">
              <h4>{{ collection.name }}</h4>
              <button class="collection-menu" @click="openCollectionMenu(collection)">
                ⋮
              </button>
            </div>
            <p class="collection-description">{{ collection.description }}</p>
            <div class="collection-palettes">
              <div
                v-for="paletteId in collection.paletteIds.slice(0, 4)"
                :key="paletteId"
                class="collection-palette-preview"
                :style="{ backgroundColor: getPaletteColor(paletteId) }"
                :title="getPaletteName(paletteId)"
              />
              <div v-if="collection.paletteIds.length > 4" class="more-palettes">
                +{{ collection.paletteIds.length - 4 }}
              </div>
            </div>
            <div class="collection-footer">
              <span class="palette-count">
                {{ collection.paletteIds.length }} палитр
              </span>
              <button
                class="btn btn-small"
                @click="openCollection(collection)"
              >
                Открыть
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Модальное окно редактирования -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
      <div class="modal-content">
        <h2>Редактировать палитру</h2>
        <div v-if="editingPalette" class="edit-form">
          <div class="form-group">
            <label>Название:</label>
            <input
              type="text"
              v-model="editingPalette.name"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label>Описание:</label>
            <textarea
              v-model="editingPalette.description"
              class="form-input"
              rows="3"
            />
          </div>
          
          <div class="form-group">
            <label>Теги:</label>
            <div class="tags-input">
              <div class="tags-list">
                <span
                  v-for="tag in editingPalette.tags"
                  :key="tag"
                  class="tag"
                >
                  {{ tag }}
                  <button @click="removeEditTag(tag)" class="tag-remove">×</button>
                </span>
              </div>
              <input
                type="text"
                v-model="newEditTag"
                placeholder="Добавить тег"
                @keyup.enter="addEditTag"
                class="tag-input"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label>Цвета:</label>
            <div class="edit-colors">
              <div
                v-for="(color, index) in editingPalette.colors"
                :key="index"
                class="edit-color"
              >
                <input
                  type="color"
                  v-model="editingPalette.colors[index]"
                  class="color-input"
                />
                <input
                  type="text"
                  v-model="editingPalette.colors[index]"
                  class="color-text-input"
                />
                <button
                  @click="removeColor(index)"
                  class="remove-color-btn"
                  :disabled="editingPalette.colors.length <= 2"
                >
                  ×
                </button>
              </div>
              <button @click="addColor" class="add-color-btn">
                + Добавить цвет
              </button>
            </div>
          </div>
          
          <div class="modal-actions">
            <button class="btn btn-cancel" @click="closeEditModal">
              Отмена
            </button>
            <button class="btn btn-save" @click="saveEditedPalette">
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Модальное окно новой коллекции -->
    <div v-if="showNewCollectionModal" class="modal-overlay" @click.self="showNewCollectionModal = false">
      <div class="modal-content">
        <h2>Новая коллекция</h2>
        <div class="new-collection-form">
          <div class="form-group">
            <label>Название коллекции:</label>
            <input
              type="text"
              v-model="newCollection.name"
              class="form-input"
              placeholder="Моя коллекция"
            />
          </div>
          
          <div class="form-group">
            <label>Описание:</label>
            <textarea
              v-model="newCollection.description"
              class="form-input"
              rows="3"
              placeholder="Описание коллекции..."
            />
          </div>
          
          <div class="form-group">
            <label>Выберите палитры:</label>
            <div class="palettes-select">
              <div
                v-for="palette in savedPalettes"
                :key="palette.id"
                class="palette-select-item"
              >
                <label>
                  <input
                    type="checkbox"
                    :value="palette.id"
                    v-model="newCollection.selectedPalettes"
                  />
                  <span class="palette-select-name">{{ palette.name }}</span>
                  <div class="palette-select-colors">
                    <div
                      v-for="color in palette.colors.slice(0, 3)"
                      :key="color"
                      class="palette-select-color"
                      :style="{ backgroundColor: color }"
                    />
                  </div>
                </label>
              </div>
            </div>
          </div>
          
          <div class="modal-actions">
            <button class="btn btn-cancel" @click="showNewCollectionModal = false">
              Отмена
            </button>
            <button class="btn btn-save" @click="createNewCollection">
              Создать коллекцию
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePaletteLibrary } from '../composables/usePaletteLibrary'
import PaletteCard from '../components/PaletteCard.vue'

const router = useRouter()
const {
  savedPalettes,
  collections,
  favorites,
  tags,
  favoritePalettes,
  updatePalette,
  deletePalette,
  toggleFavorite,
  createCollection
} = usePaletteLibrary()

const searchQuery = ref('')
const selectedTags = ref([])
const viewMode = ref('grid')
const showEditModal = ref(false)
const showNewCollectionModal = ref(false)
const editingPalette = ref(null)
const newEditTag = ref('')
const newCollection = ref({
  name: '',
  description: '',
  selectedPalettes: []
})

const allTags = computed(() => {
  const allTagsSet = new Set()
  savedPalettes.value.forEach(palette => {
    palette.tags.forEach(tag => allTagsSet.add(tag))
  })
  return Array.from(allTagsSet)
})

const filteredPalettes = computed(() => {
  let filtered = savedPalettes.value
  
  // Поиск по названию и описанию
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(palette =>
      palette.name.toLowerCase().includes(query) ||
      palette.description.toLowerCase().includes(query)
    )
  }
  
  // Фильтрация по тегам
  if (selectedTags.value.length > 0) {
    filtered = filtered.filter(palette =>
      selectedTags.value.every(tag => palette.tags.includes(tag))
    )
  }
  
  return filtered
})

const toggleTagFilter = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index === -1) {
    selectedTags.value.push(tag)
  } else {
    selectedTags.value.splice(index, 1)
  }
}

const selectPalette = (palette) => {
  router.push({
    path: '/generator',
    query: { palette: JSON.stringify(palette.colors) }
  })
}

const editPalette = (palette) => {
  editingPalette.value = JSON.parse(JSON.stringify(palette))
  showEditModal.value = true
}

const deletePaletteConfirm = (paletteId) => {
  if (confirm('Вы уверены, что хотите удалить эту палитру?')) {
    deletePalette(paletteId)
  }
}

const saveEditedPalette = () => {
  if (editingPalette.value) {
    updatePalette(editingPalette.value.id, {
      name: editingPalette.value.name,
      description: editingPalette.value.description,
      tags: editingPalette.value.tags,
      colors: editingPalette.value.colors
    })
    closeEditModal()
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  editingPalette.value = null
  newEditTag.value = ''
}

const addEditTag = () => {
  if (newEditTag.value.trim() && editingPalette.value) {
    if (!editingPalette.value.tags.includes(newEditTag.value.trim())) {
      editingPalette.value.tags.push(newEditTag.value.trim())
    }
    newEditTag.value = ''
  }
}

const removeEditTag = (tag) => {
  if (editingPalette.value) {
    editingPalette.value.tags = editingPalette.value.tags.filter(t => t !== tag)
  }
}

const addColor = () => {
  if (editingPalette.value) {
    editingPalette.value.colors.push('#000000')
  }
}

const removeColor = (index) => {
  if (editingPalette.value && editingPalette.value.colors.length > 2) {
    editingPalette.value.colors.splice(index, 1)
  }
}

const getPaletteColor = (paletteId) => {
  const palette = savedPalettes.value.find(p => p.id === paletteId)
  return palette ? palette.colors[0] : '#cccccc'
}

const getPaletteName = (paletteId) => {
  const palette = savedPalettes.value.find(p => p.id === paletteId)
  return palette ? palette.name : 'Неизвестно'
}

const openCollectionMenu = (collection) => {
  // Реализация меню коллекции
  console.log('Open collection menu:', collection)
}

const openCollection = (collection) => {
  // Реализация открытия коллекции
  console.log('Open collection:', collection)
}

const createNewCollection = () => {
  if (newCollection.value.name.trim()) {
    createCollection(
      newCollection.value.name,
      newCollection.value.description,
      newCollection.value.selectedPalettes
    )
    showNewCollectionModal.value = false
    resetNewCollection()
  }
}

const resetNewCollection = () => {
  newCollection.value = {
    name: '',
    description: '',
    selectedPalettes: []
  }
}

onMounted(() => {
  // Загрузка данных из localStorage
})
</script>

<style scoped>
.library-view {
  max-width: 1400px;
  margin: 0 auto;
}

.library-header {
  text-align: center;
  margin-bottom: 2rem;
}

.library-header h1 {
  color: #333;
  margin-bottom: 0.5rem;
}

.library-header p {
  color: #666;
}

.library-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
}

.library-controls {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.search-box {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 40px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.filter-section h3,
.view-options h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.tags-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-filter {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: white;
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tag-filter:hover {
  border-color: #667eea;
  color: #667eea;
}

.tag-filter.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.view-buttons {
  display: flex;
  gap: 0.5rem;
}

.view-btn {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
}

.view-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.palettes-section {
  grid-column: 2;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  margin: 0;
}

.btn-new-collection {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-new-collection:hover {
  transform: translateY(-2px);
}

.favorites-section,
.all-palettes-section {
  margin-bottom: 3rem;
}

.favorites-section h3,
.all-palettes-section h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.palettes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.palettes-grid.list-view {
  grid-template-columns: 1fr;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border: 2px dashed #ddd;
  border-radius: 12px;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state p {
  color: #666;
  margin: 0.5rem 0;
}

.empty-subtext {
  font-size: 0.9rem;
  color: #999;
}

.collections-section {
  grid-column: 1 / -1;
  margin-top: 2rem;
}

.empty-collections {
  text-align: center;
  padding: 2rem;
  background: white;
  border: 2px dashed #ddd;
  border-radius: 12px;
}

.collections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.collection-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.collection-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.collection-header h4 {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
}

.collection-menu {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 1.5rem;
  line-height: 1;
}

.collection-description {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 1rem;
  min-height: 40px;
}

.collection-palettes {
  display: flex;
  gap: 4px;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.collection-palette-preview {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.more-palettes {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 0.8rem;
}

.collection-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.palette-count {
  color: #666;
  font-size: 0.9rem;
}

.btn-small {
  padding: 6px 12px;
  font-size: 0.9rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
}

.edit-form,
.new-collection-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #333;
}

.form-input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.tags-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

.tag-input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.edit-colors {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.edit-color {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.color-input {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.color-text-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 0.9rem;
}

.remove-color-btn {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  color: #666;
  cursor: pointer;
}

.remove-color-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-color-btn {
  padding: 10px;
  border: 2px dashed #ddd;
  border-radius: 6px;
  background: white;
  color: #666;
  cursor: pointer;
  text-align: center;
}

.add-color-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.palettes-select {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1rem;
}

.palette-select-item {
  margin-bottom: 0.5rem;
}

.palette-select-item label {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background 0.2s;
}

.palette-select-item label:hover {
  background: #f5f7fa;
}

.palette-select-name {
  flex: 1;
}

.palette-select-colors {
  display: flex;
  gap: 2px;
}

.palette-select-color {
  width: 20px;
  height: 20px;
  border-radius: 2px;
  border: 1px solid #ddd;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cancel {
  background: #f5f5f5;
  color: #333;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-save {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}

@media (max-width: 1024px) {
  .library-container {
    grid-template-columns: 1fr;
  }
  
  .palettes-section {
    grid-column: 1;
  }
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .modal-content {
    padding: 1rem;
  }
}
</style>