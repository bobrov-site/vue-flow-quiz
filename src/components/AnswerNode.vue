<template>
    <div class="node-answer node">
        <h4 class="node-title">{{ props.data.title }}</h4>
        <input v-model="answer" class="node-input" type="text"/>
        <div class="node-licenses-wrapper">
            <div class="node-license-header">
                <span class="node-license-title">Лицензия</span>
                <span class="node-license-title">Значение</span>
            </div>
        </div>
        <div class="node-licenses-list">
            <div v-for="license in selectedLicenses" :key="license.id" class="node-license-item">
                <select v-model="license.name" class="node-license-select">
                    <option v-for="item in licenses" :key="item.id" :value="item.name" :disabled="isDisabled(item)">{{ item.name}}</option>
                </select>
                <select v-model="license.weight" class="node-license-select">
                    <option value="1">1</option>
                    <option value="0">0</option>
                    <option value="null">null</option>
                </select>
            </div>
        </div>
        <button @click="addLicense" class="node-button" type="button">+ Добавить лицензию</button>
        <hr class="node-hr">
        <button @click="addQuestion" class="node-button node-button-green mb-12">Добавить вопрос</button>
        <button class="node-button node-button-green">Результат</button>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import { useVueFlow, Position } from '@vue-flow/core'
import type { NodeProps, Edge, Node } from '@vue-flow/core';
import type { License } from '../types.ts';
import api from '../api';

const { getNodes, getEdges, addNodes, addEdges} = useVueFlow();
const answer = ref<string>('');
const props = defineProps<NodeProps>()
const licenses = ref<License[] | []>()
const selectedLicenses = ref<License[]>([]);
const disabledLicenses = ref<License[]>([]);
onMounted(async() => {
    answer.value = props.data.text;
    await fetchLicenses();
})

const fetchLicenses = async() => {
    const response = await api.fetchLicenses();
    licenses.value = response.map((licence: License) => {
        const newLicense = {
            id: licence.id,
            name: licence.name,
            weight: '0'
        }
        return newLicense;
    })
    selectedLicenses.value.push(licenses.value[0])
}

const isDisabled = (license: License): boolean => {
    return disabledLicenses.value.some((item) => item.name === license.name)
}

const addLicense = () => {
    disabledLicenses.value.push(selectedLicenses.value[selectedLicenses.value.length - 1])
    const newLicense: License = {
        id: 0,
        name: '',
        weight: '0'
    }
    selectedLicenses.value.push(newLicense);
}

const addQuestion = () => {
    const id = String(getNodes.value.length + 1);
    const numberQuestion = getNodes.value.filter(node => node.type === 'question').length + 1;
    const countChildrenQuestions = getEdges.value.filter(edge => edge.source === props.id).length
    if (countChildrenQuestions > 0) {
        return
    }
    const data = {
        title: `Вопрос ${numberQuestion}`,
        question: 'Является ли ваше произведение ПО',
        licenses: selectedLicenses.value
    }
    const edge: Edge = {
        id: `e${props.id}-${id}`,
        source: props.id,
        target: id,
    }
    const node: Node = {
        id,
        data,
        type: 'question',
        position: { x: 0, y: 400 },
        sourcePosition: Position.Bottom
    }
    addNodes(node);
    addEdges(edge);
}
</script>

<style scoped>

</style>