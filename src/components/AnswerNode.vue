<template>
    <div class="node-answer node">
        <h4 class="node-title">Ответ</h4>
        <input v-model="answer" class="node-input" placeholder="Да" type="text"/>
        <div class="node-licenses-wrapper">
            <div class="node-license-header">
                <span class="node-license-title">Лицензия</span>
                <span class="node-license-title">Значение</span>
            </div>
        </div>
        <div class="node-licenses-list">
            <select class="node-license-select">
                <option>MIT</option>
                <option>Apache2</option>
                <option>Apache3</option>
            </select>
            <select class="node-license-select">
                <option value="1">1</option>
                <option value="0">0</option>
                <option value="null">null</option>
            </select>
        </div>
        <button class="node-button" type="button">+ Добавить лицензию</button>
        <hr class="node-hr">
        <button class="node-button node-button-green mb-12">Добавить вопрос</button>
        <button class="node-button node-button-green">Результат</button>
    </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';

const answer = ref<string>('');
</script>

<style scoped>

</style>