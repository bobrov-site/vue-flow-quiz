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
            <div v-for="license in licenses" :key="license.id" class="node-license-item">
                <div class="node-license-item-data">{{ license.name }}</div>
                <div class="node-license-item-data node-license-item-count">{{ license.weight }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import type { NodeProps } from '@vue-flow/core';
import type { License } from '@/types';
const props = defineProps<NodeProps>()
const licenses = ref<License[] | []>()
const result = ref<string>('');
onMounted(() => {
    result.value = props.data.text;
    licenses.value = props.data.licenses;
})
</script>

<style scoped>

</style>