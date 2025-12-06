<template>
  <div id="app">
    <nav class="app-nav">
      <router-link to="/" class="nav-brand">
        🎨 Генератор палитр
      </router-link>
      <div class="nav-links">
        <router-link to="/" class="nav-link">Главная</router-link>
        <router-link to="/generator" class="nav-link">Генератор</router-link>
        <router-link to="/library" class="nav-link">Библиотека</router-link>
        <router-link to="/analyze" class="nav-link">Анализ</router-link>
        <router-link to="/export" class="nav-link">Экспорт</router-link>
      </div>
    </nav>

    <main class="app-main">
      <router-view />
    </main>

    <footer class="app-footer">
      <div class="footer-content">
        <p>🎨 Генератор цветовых палитр | Практика 28</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const globalNotification = ref('')
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
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-nav {
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #666;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.nav-link:hover {
  color: #667eea;
  background: #f5f7fa;
}

.nav-link.router-link-active {
  color: #667eea;
  background: #f0f7ff;
  font-weight: 600;
}

.app-main {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.app-footer {
  background: white;
  padding: 2rem;
  border-top: 1px solid #e0e0e0;
  text-align: center;
}

.footer-content p {
  margin: 0.5rem 0;
  color: #666;
}
</style>