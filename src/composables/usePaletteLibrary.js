import { ref, computed, watch } from 'vue'

export function usePaletteLibrary() {
  const savedPalettes = ref([])
  const collections = ref([])
  const favorites = ref(new Set())
  const tags = ref(['веб', 'мобильное', 'бренд', 'интерьер', 'искусство', 'природа', 'технологии', 'образование'])

  // Загрузка из localStorage
  const loadLibrary = () => {
    const saved = localStorage.getItem('paletteLibrary')
    if (saved) {
      const data = JSON.parse(saved)
      savedPalettes.value = data.palettes || []
      collections.value = data.collections || []
      favorites.value = new Set(data.favorites || [])
    }
  }

  // Сохранение в localStorage
  const saveLibrary = () => {
    const data = {
      palettes: savedPalettes.value,
      collections: collections.value,
      favorites: Array.from(favorites.value)
    }
    localStorage.setItem('paletteLibrary', JSON.stringify(data))
  }

  // Сохранение палитры
  const savePalette = (palette, name, description = '', tags = []) => {
    const newPalette = {
      id: Date.now().toString(),
      name,
      description,
      colors: [...palette.colors],
      tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    savedPalettes.value.unshift(newPalette)
    saveLibrary()
    
    return newPalette.id
  }

  // Обновление палитры
  const updatePalette = (id, updates) => {
    const index = savedPalettes.value.findIndex(p => p.id === id)
    if (index !== -1) {
      savedPalettes.value[index] = {
        ...savedPalettes.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      saveLibrary()
    }
  }

  // Удаление палитры
  const deletePalette = (id) => {
    const index = savedPalettes.value.findIndex(p => p.id === id)
    if (index !== -1) {
      savedPalettes.value.splice(index, 1)
      favorites.value.delete(id)
      saveLibrary()
    }
  }

  // Добавление в избранное
  const toggleFavorite = (id) => {
    if (favorites.value.has(id)) {
      favorites.value.delete(id)
    } else {
      favorites.value.add(id)
    }
    saveLibrary()
  }

  // Создание коллекции
  const createCollection = (name, description = '', paletteIds = []) => {
    const newCollection = {
      id: Date.now().toString(),
      name,
      description,
      paletteIds,
      createdAt: new Date().toISOString()
    }
    
    collections.value.push(newCollection)
    saveLibrary()
    
    return newCollection.id
  }

  // Поиск палитр
  const searchPalettes = (query) => {
    if (!query.trim()) return savedPalettes.value
    
    const searchLower = query.toLowerCase()
    return savedPalettes.value.filter(palette => 
      palette.name.toLowerCase().includes(searchLower) ||
      palette.description.toLowerCase().includes(searchLower) ||
      palette.tags.some(tag => tag.toLowerCase().includes(searchLower))
    )
  }

  // Фильтрация по тегам
  const filterByTags = (selectedTags) => {
    if (selectedTags.length === 0) return savedPalettes.value
    
    return savedPalettes.value.filter(palette =>
      selectedTags.every(tag => palette.tags.includes(tag))
    )
  }

  // Получение избранных палитр
  const favoritePalettes = computed(() => {
    return savedPalettes.value.filter(p => favorites.value.has(p.id))
  })

  // Инициализация
  loadLibrary()

  // Автосохранение при изменениях
  watch(savedPalettes, saveLibrary, { deep: true })
  watch(collections, saveLibrary, { deep: true })

  return {
    savedPalettes,
    collections,
    favorites,
    tags,
    favoritePalettes,
    savePalette,
    updatePalette,
    deletePalette,
    toggleFavorite,
    createCollection,
    searchPalettes,
    filterByTags,
    loadLibrary
  }
}