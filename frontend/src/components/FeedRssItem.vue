<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface FeedItem {
  titolo: string;
  link: string;
}

const feedItems = ref<FeedItem[]>([]);
const currentIndex = ref(0);
let autoScrollInterval: number;

const loadFeed = async () => {
  try {
    // Usa rss2json che converte RSS in JSON e supporta CORS
    const feedUrl = 'https://www.regione.lazio.it/rss-news-regione';
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (data.items) {
      feedItems.value = data.items.map((item: any) => ({
        titolo: item.title || '',
        link: item.link || ''
      }));
    }
  } catch (error) {
    console.error('Errore nel caricamento del feed RSS:', error);
  }
};

const startAutoScroll = () => {
  autoScrollInterval = window.setInterval(() => {
    if (feedItems.value.length > 0) {
      currentIndex.value = (currentIndex.value + 1) % feedItems.value.length;
    }
  }, 5000);
};

onMounted(() => {
  loadFeed().then(() => startAutoScroll());
  
  return () => clearInterval(autoScrollInterval);
});
</script>

<template>  
  <div class="feed-container">
    <div class="fade-container">
      <div v-if="feedItems.length > 0" :key="currentIndex" class="fade-item active">
        <h3 class="info-title">{{ feedItems[currentIndex].titolo }}</h3>
        <a :href="feedItems[currentIndex].link" target="_blank" class="info-description">
          Leggi di più →
        </a>
      </div>
      <div v-else class="fade-item active">
        <p class="info-title">Caricamento feed...</p>
      </div>
    </div>
    
    <div class="indicator-container" v-if="feedItems.length > 0">
      <span v-for="(item, index) in feedItems" 
            :key="index"
            :class="['indicator', { active: index === currentIndex }]"
            @click="currentIndex = index"></span>
    </div>
  </div>
</template>

<style scoped>
.feed-container {
  width: 100%;
  padding: 2rem;
}

.fade-container {
  position: relative;
  min-height: 150px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.fade-item {
  width: 100%;
  padding: 1.5rem;
  opacity: 0;
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(10px);
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.fade-item.active {
  opacity: 1;
  transform: translateY(0);
}
    
    .info-title {
      font-size: 1.4rem;
      font-weight: 700;
      margin-bottom: 0.8rem;
      color: #1a1a1a;
      line-height: 1.4;
      letter-spacing: -0.3px;
    }
    
    .info-description {
      font-size: 0.95rem;
      color: #0066cc;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: inline-block;
    }
    
    .info-description:hover {
      color: #0052a3;
      transform: translateX(4px);
    }
    
    .indicator-container {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 1rem;      
    }
    
    .indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.4);
      cursor: pointer;
      transition: all 0.3s;
      background-color: #1a1a1a;
    }
    
    .indicator.active {
      background: #0052a3;
      width: 30px;
      border-radius: 6px;
    }
    
    .controls {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 1.5rem;
    }
    
    .btn-custom {
      background: white;
      color: #0066cc;
      border: none;
      padding: 0.5rem 1.5rem;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .btn-custom:hover {
      background: #f0f0f0;
      transform: translateY(-2px);
    }
</style>
