<template>
  <div class="home-view">
    <div class="hero">
      <h1>🎨 Генератор цветовых палитр</h1>
      <p class="subtitle">Профессиональный инструмент для создания гармоничных цветовых схем</p>
      
      <div class="hero-actions">
        <router-link to="/generator" class="btn btn-primary">
          Создать палитру
        </router-link>
        <router-link to="/library" class="btn btn-secondary">
          Моя библиотека
        </router-link>
      </div>
    </div>
    
    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">🎨</div>
        <h3>Умная генерация</h3>
        <p>Создавайте палитры по типу, настроению или на основе базового цвета</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">📊</div>
        <h3>Анализ доступности</h3>
        <p>Проверяйте контрастность по стандартам WCAG AA/AAA</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">💾</div>
        <h3>Библиотека палитр</h3>
        <p>Сохраняйте, организуйте и редактируйте свои палитры</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">📤</div>
        <h3>Экспорт во все форматы</h3>
        <p>CSS, SCSS, Tailwind, JSON и готовый CSS код</p>
      </div>
    </div>
    
    <div class="quick-start">
      <h2>Быстрый старт</h2>
      <div class="quick-actions">
        <button class="quick-btn" @click="generateRandomPalette">
          🎲 Случайная палитра
        </button>
        <button class="quick-btn" @click="generateCalmPalette">
          😌 Спокойные тона
        </button>
        <button class="quick-btn" @click="generateEnergeticPalette">
          ⚡ Энергичные цвета
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useColorPalette } from '../composables/useColorPalette'
import { useColorTheory } from '../composables/useColorTheory'

const router = useRouter()
const { generateHarmonicPalette, colors } = useColorPalette()
const { moods } = useColorTheory()

const generateRandomPalette = () => {
  generateHarmonicPalette()
  router.push('/generator')
}

const generateCalmPalette = () => {
  const calmPalette = moods.value.find(m => m.id === 'calm')
  if (calmPalette) {
    colors.value = [...calmPalette.colors]
  }
  router.push('/generator')
}

const generateEnergeticPalette = () => {
  const energeticPalette = moods.value.find(m => m.id === 'energetic')
  if (energeticPalette) {
    colors.value = [...energeticPalette.colors]
  }
  router.push('/generator')
}
</script>

<style scoped>
.home-view {
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  padding: 3rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  color: white;
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary {
  background: white;
  color: #667eea;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: #666;
  line-height: 1.5;
}

.quick-start {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
}

.quick-start h2 {
  margin-bottom: 2rem;
  color: #333;
}

.quick-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.quick-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: #f5f7fa;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-btn:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 100%;
    max-width: 300px;
  }
}
</style>