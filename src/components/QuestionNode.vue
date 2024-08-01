<template>
    <div class="node-question node">
        <h4 class="node-title">Вопрос 1</h4>
        <input v-model="question" class="node-input" placeholder="Является ли ваше произведение ПО?" type="text"/>
        <button class="node-button node-button-green" type="button">Добавить ответ</button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const question = ref<string>('');
</script>

<style lang="scss" scoped>

</style>