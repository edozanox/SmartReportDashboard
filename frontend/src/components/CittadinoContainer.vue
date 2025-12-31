<script setup lang="ts">
import ReportsList from './ReportsList.vue';
import ReportFormItem from './ReportFormItem.vue';
import { onMounted, ref } from 'vue';

const reportsListRef = ref();
const reportFormRef = ref();

onMounted(() => {
  const tabElement = document.getElementById('admin-tab');
  
  tabElement?.addEventListener('shown.bs.tab', (event) => {
    const target = (event.target as HTMLElement).getAttribute('href');
    
    if (target === '#tab-reports') {
      reportsListRef.value?.initializeComponent();
    } else if (target === '#tab-nuova-segnalazione') {
      reportFormRef.value?.initializeComponent();
    }
  });
});

</script>

<template>
<ul class="nav nav-tabs auto" id="myTab" role="tablist">   
  <li class="nav-item"><a class="nav-link" id="tab3-tab" data-bs-toggle="tab" href="#tab-nuova-segnalazione" role="tab" aria-controls="tab3" aria-selected="false">Nuova segnalazione</a></li>
  <li class="nav-item"><a class="nav-link active" id="tab1-tab" data-bs-toggle="tab" href="#tab-reports" role="tab" aria-controls="tab1" aria-selected="true">Le mie segnalazioni</a></li>
</ul>
<div class="tab-content" id="myTabContent">
  <div class="tab-pane p-4 fade" id="tab-nuova-segnalazione" role="tabpanel" aria-labelledby="tab3-tab"><ReportFormItem ref="reportFormRef"/></div>
  <div class="tab-pane p-4 fade show active" id="tab-reports" role="tabpanel" aria-labelledby="tab1-tab"> <ReportsList ref="reportsListRef"/></div>  
</div>

</template>
<style scoped>


</style>
