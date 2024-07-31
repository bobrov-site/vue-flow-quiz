<template>
    <h4 class="question-node-question">Вопрос 1</h4>
    <input v-model="question" type="text"/>
    <hr>
    <button type="button">Добавить ответ</button>
</template>

<script setup lang="ts">
const question = ref<string>('');
</script>

<style scoped>

</style>