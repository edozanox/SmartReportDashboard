<script setup lang="ts">
import { ref } from 'vue'
import Parser from 'rss-parser';
import { onMount } from 'better-auth/vue';

onMount(() => {
  
});
interface Props {
  text: string
  speed?: number // velocità in secondi (default 10)
  pauseOnHover?: boolean // pausa al passaggio del mouse
}

const props = withDefaults(defineProps<Props>(), {
  speed: 10,
  pauseOnHover: true
})

const isHovered = ref(false)
</script>

<template>
  <div 
    class="scrolling-text-container"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    :class="{ paused: pauseOnHover && isHovered }"
  >
    <div class="scrolling-text" :style="{ '--scroll-speed': `${speed}s` }">
      <span class="text-item">{{ text }}</span>
      <span class="text-item">{{ text }}</span>
    </div>
  </div>
</template>

<style scoped>
.scrolling-text-container {
  overflow: hidden;
  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 10%, rgba(255,255,255,1) 90%, rgba(255,255,255,0) 100%);
  padding: 10px 0;
}

.scrolling-text {
  display: flex;
  animation: scroll linear var(--scroll-speed) infinite;
  white-space: nowrap;
}

.scrolling-text-container.paused .scrolling-text {
  animation-play-state: paused;
}

.text-item {
  padding: 0 20px;
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
}

@keyframes scroll {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
