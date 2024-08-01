<template>
    <div class="node-result node">
        <h4 class="node-title">Результат</h4>
        <input v-model="result" class="node-input" placeholder="Текст результата" type="text"/>
        <div class="node-licenses-wrapper">
            <div class="node-license-header">
                <span class="node-license-title">Лицензия</span>
                <span class="node-license-title">Значение</span>
            </div>
        </div>
        <div class="node-licenses-list">
            <div class="node-license-item">
                <div class="node-license-item-data">MIT</div>
                <div class="node-license-item-data">null</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
const result = ref<string>('');
</script>

<style scoped>

</style>