<script setup lang="ts">
import { ref } from 'vue';
import DiagramInit from './components/DiagramInit.vue'
const diagram = ref();

const fullWidth = () => {
  if (!document.fullscreenElement) {
    if (diagram.value.requestFullscreen) {
      diagram.value.requestFullscreen();
    } else if (diagram.value.webkitRequestFullscreen) { // для Safari
      diagram.value.webkitRequestFullscreen();
    } else if (diagram.value.msRequestFullscreen) { // для IE/Edge
      diagram.value.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { // для Safari
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // для IE/Edge
      document.msExitFullscreen();
    }
  }
}
</script>

<template>
  <main ref="diagram" class="diagram-parent">
    <DiagramInit @full-width="fullWidth"/>
  </main>
</template>

<style scoped>
.diagram-parent {
  width: 100%;
  height: 100vh;
  border: 1px solid #3e8cf3;
  background: white;
}
</style>
