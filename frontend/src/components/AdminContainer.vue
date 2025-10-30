<script setup lang="ts">
import ReportsList from './ReportsList.vue';
import GroupsList from './GroupsList.vue';

</script>

<template>
<ul class="nav nav-tabs auto" id="myTab" role="tablist">
  <li class="nav-item"><a class="nav-link active" id="tab1-tab" data-bs-toggle="tab" href="#tab-reports" role="tab" aria-controls="tab1" aria-selected="true">Segnalazioni</a></li>
  <li class="nav-item"><a class="nav-link" id="tab2-tab" data-bs-toggle="tab" href="#tab-gruppi" role="tab" aria-controls="tab2" aria-selected="false">Gruppi</a></li>
</ul>
<div class="tab-content" id="myTabContent">
  <div class="tab-pane p-4 fade show active" id="tab-reports" role="tabpanel" aria-labelledby="tab1-tab"> <ReportsList/></div>
  <div class="tab-pane p-4 fade" id="tab-gruppi" role="tabpanel" aria-labelledby="tab2-tab"><GroupsList/></div>
</div>

</template>
<style scoped>


</style>
