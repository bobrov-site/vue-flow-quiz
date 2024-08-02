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
        <button @click="addLicense" class="node-button" type="button" :disabled="process === 'loading'">+ Добавить лицензию</button>
        <hr class="node-hr">
        <button @click="addQuestion" class="node-button node-button-green mb-12">Добавить вопрос</button>
        <button @click="addResult" class="node-button node-button-green">Результат</button>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref, shallowRef} from 'vue';
import { useVueFlow, Position } from '@vue-flow/core'
import type { NodeProps, Edge, Node } from '@vue-flow/core';
import type { License } from '../types.ts';
import api from '../api';

const { getNodes, getEdges, addNodes, addEdges } = useVueFlow();
const answer = ref<string>('');
const props = defineProps<NodeProps>()
const licenses = shallowRef<License[] | []>()
const resultLicenses = shallowRef<License[] | []>()
const selectedLicenses = shallowRef<License[]>([]);
const disabledLicenses = ref<License[]>([]);
const process = ref('loading');
onMounted(async() => {
    answer.value = props.data.text;
    await fetchLicenses();
})

const fetchLicenses = async() => {
    process.value = 'loading';
    const response = await api.fetchLicenses();
    licenses.value = response.map((licence: License) => {
        const newLicense = {
            id: licence.id,
            name: licence.name,
            weight: '0'
        }
        return newLicense;
    })
    if (props.data.licenses.length !== 0) {
        const filtred = props.data.licenses[0].filter((license: License) => license.weight !== 'null')
        selectedLicenses.value.push(...filtred)
        disabledLicenses.value.push(...filtred)
    }
    else {
        selectedLicenses.value.push(licenses.value[0])
    }
    process.value = 'loaded';
}

const isDisabled = (license: License): boolean => {
    return disabledLicenses.value.some((item) => item.name === license.name)
}

const addLicense = () => {
    disabledLicenses.value.push(selectedLicenses.value[selectedLicenses.value.length - 1])
    const selectedLicensesNames = selectedLicenses.value.map((item) => item.name)
    const newLicense = licenses.value?.filter((item) => !selectedLicensesNames.includes(item.name))[0]
    if (!newLicense) {
     return   
    }
    selectedLicenses.value.push(newLicense);
}

const addQuestion = () => {
    const id = String(getNodes.value.length + 1);
    const numberQuestion = getNodes.value.filter(node => node.type === 'question').length + 1;
    const countChildrenQuestions = getEdges.value.filter(edge => edge.source === props.id).length
    const currentNode = getNodes.value.find(node => node.id === props.id)
    currentNode.data.licenses = selectedLicenses.value
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

const calculateTotalLicencesWeight = (nodeId:string) => {
    const allLicenses = []
    const allNodes = []
    const parentEdges = []
    const currentNode = getNodes.value.find((node) => node.id === nodeId)
    const getParentsNodes = (id:string) => {
        const parentEdge = getEdges.value.find((edge) => edge.target === id);
        if (parentEdge) {
            parentEdges.push(parentEdge);
            getParentsNodes(parentEdge.source);
        }
        return
    }
    getParentsNodes(nodeId)
    const parentNodes = parentEdges.map((edge) => {
        return getNodes.value.find((node) => node.id === edge.source)
    })
    allNodes.push(...parentNodes, currentNode)
    const answerNodes = allNodes.filter((node) => node.type === 'answer')
    answerNodes.forEach((node) => {
        allLicenses.push(...node?.data.licenses);
    })
    const uniqueObjects = allLicenses.filter((obj, index, self) =>
    index === self.findIndex((t) => t.id === obj.id)
    );
    const result = uniqueObjects.map((license) => {
        let weight = 0;
        allLicenses.forEach((l) => {
          if (l.name === license.name) {
            weight += Number(l.weight);
          }
        })
        license.weight = String(weight);
        return license
    })
    resultLicenses.value = result.filter((license) => license.weight !== 'NaN');
}
const addResult = () => {
    const id = String(getNodes.value.length + 1);
    const currentNode = getNodes.value.find(node => node.id === props.id)
    currentNode.data.licenses = selectedLicenses.value;
    calculateTotalLicencesWeight(props.id);
    console.log(currentNode.data.licenses)
    const data = {
        text: 'Пояснительный текст',
        licenses: resultLicenses.value
    }
    const edge: Edge = {
        id: `e${props.id}-${id}`,
        source: props.id,
        target: id,
    }
    const node: Node = {
        id,
        data,
        type: 'result',
        position: { x: 0, y: 400 },
        sourcePosition: Position.Bottom
    }
    addNodes(node);
    addEdges(edge);
}
</script>

<style scoped>

</style>