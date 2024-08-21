<template>
    <div class="node-answer node">
        <div class="node-header">
            <h4 class="node-title">{{ props.data.title }}</h4>
            <div @click="deleteNodes" class="node-trash-icon">
                <Icon name="delete"/>
            </div>
        </div>
        <input @change="updateNode" v-model="text" class="node-input" type="text"/>
        <div class="node-licenses-wrapper">
            <div class="node-license-header">
                <span class="node-license-title">Лицензия</span>
                <span class="node-license-title">Значение</span>
            </div>
        </div>
        <div class="node-licenses-list">
            <div v-for="license in selectedLicenses" :key="license.id" class="node-license-item">
                <select @change="updateLicense(license)" disabled v-model="license.name" class="node-license-select">
                    <option v-for="item in licenses" :key="item.id" :value="item.name" :disabled="isDisabled(item)">{{ item.name}}</option>
                </select>
                <select @change="updateLicense(license)" :disabled="isHaveChildren()" v-model="license.weight" class="node-license-select">
                    <option value="1">1</option>
                    <option value="0">0</option>
                    <option value="null">Исключить</option>
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
import { useVueFlow, Position, useNode } from '@vue-flow/core'
import type { NodeProps, Edge, Node } from '@vue-flow/core';
import type { License, NodePositionData } from '../types.ts';
import api from '../api';
import Icon from '@/components/icons/Icon.vue';
import utils from '@/utils.js';

const { getNodes, getEdges, addNodes, addEdges, dimensions, removeNodes } = useVueFlow();
const text = ref<string>('');
const props = defineProps<NodeProps>()
const licenses = shallowRef<License[] | []>()
const resultLicenses = shallowRef<License[] | []>()
const selectedLicenses = shallowRef<License[]>([]);
const disabledLicenses = ref<License[]>([]);
const chilrenNodesIds = ref<string[]>([])
const process = ref('');
const { node } = useNode();
onMounted(async() => {
    text.value = props.data.text;
    await fetchLicenses();
})

const updateNode = () => {
    node.data = {
        title: node.data.title,
        licenses: selectedLicenses.value,
        text: text.value,
    }
}

const updateLicense = (license:License) => {
    selectedLicenses.value = selectedLicenses.value.map((item) => {
        if (item.name === license.name) {
            item.weight = license.weight
        }
        return item
    }) 
}

const fetchLicenses = async() => {
    // TODO надо вынести отдельно и сократить количество запросов
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
    //
    if (props.data.licenses.length !== 0) {
        selectedLicenses.value = node.data.licenses.filter((license:License) => license.weight !== 'null');
        disabledLicenses.value = [...node.data.licenses];
    }
    else {
        selectedLicenses.value.push(...licenses.value)
    }
    // node.data.licenses = selectedLicenses.value
    process.value = 'loaded';
}

const isDisabled = (license: License): boolean => {
    return disabledLicenses.value.some((item) => item.name === license.name)
}

const isHaveChildren = ():boolean => {
    const childrenEdges = getEdges.value.find((edge) => edge.source === props.id)
    if (childrenEdges) {
        return true
    }
    return false
}

const isHaveResult = ():boolean => {
    const myEdges = getEdges.value.filter((edge) => edge.source === props.id)
    const haveResult = myEdges.some((edge: Edge) => {
        const resultsIds = getNodes.value.filter((node: Node) => node.type === 'result').map((node: Node) => node.id);
        return resultsIds.includes(edge.target)
    })
    console.log(haveResult)
    return haveResult
}

const getParentLicenses = (nodeId: string): License[] => {
    const parentEdges = getEdges.value.filter((edge) => edge.target === nodeId);
    let parentLicenses: License[] = [];

    parentEdges.forEach((edge) => {
        const parentNode = getNodes.value.find((node) => node.id === edge.source);
        if (parentNode && parentNode.data.licenses) {
            parentLicenses = parentLicenses.concat(parentNode.data.licenses);
        }
    });

    return parentLicenses;
};


const addLicense = () => {
    if (isHaveChildren()) {
        return
    }
    const parentLicenses = getParentLicenses(props.id);
    const newLicenses = licenses.value?.filter((license) => {
        const names = selectedLicenses.value.map((selectedLicense) => selectedLicense.name);
        const parentLicenseWithNullWeight = parentLicenses.find((parentLicense) => parentLicense.name === license.name && parentLicense.weight === 'null');
        if (names.includes(license.name) || license.weight === 'null' || parentLicenseWithNullWeight) {
            return false
        }
        else {
            return true
        }
        
    })
    console.log(newLicenses)
    if (newLicenses?.length === 0) {
        return
    }
    selectedLicenses.value.push(...newLicenses);
    updateNode();
}

const addQuestion = () => {
    if (isHaveResult()) {
        return
    }
    const positionData: NodePositionData = {
        nodeId: props.id,
        type: 'answer',
        nodePosition: props.position,
        nodes: getNodes.value,
        edges: getEdges.value,
    }
    const id = utils.generateNodeId(getNodes.value);
    const numberQuestion = utils.generateNumberQuestion(getNodes.value, getEdges.value, props.id);
    const childrenEdges = getEdges.value.filter((edge) => edge.source === props.id)
    const childrenNodes = getNodes.value.filter((node) => childrenEdges.some((edge) => edge.target === node.id))
    if (childrenNodes.some((node) => node.type === 'question')) {
        return
    }
    console.log(props.data.licenses)
    const data = {
        title: `Вопрос ${numberQuestion}`,
        text: 'Является ли ваше произведение ПО',
        licenses: selectedLicenses.value
    }
    const edge: Edge = {
        id: `e${props.id}-${id}`,
        source: props.id,
        target: id,
        type: 'step'
    }
    const node: Node = {
        id,
        data,
        type: 'question',
        position: utils.generateNodePosition(positionData),
        sourcePosition: Position.Bottom
    }
    addNodes(node);
    addEdges(edge);
    updateNode();
    console.log(getNodes.value, 'final after answer add question')
}

const calculateTotalLicencesWeight = (nodeId:string, currentNode) => {
    const allLicenses = []
    const allNodes = []
    const parentEdges = []
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
        const licensesCopy = JSON.parse(JSON.stringify(node?.data.licenses));
        allLicenses.push(...licensesCopy);
    })
    const uniqueObjects = allLicenses.filter((obj, index, self) =>
    index === self.findIndex((t) => t.name === obj.name)
    );
    console.log(allLicenses)
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
    console.log(result)
    resultLicenses.value = result.filter((license) => license.weight !== 'NaN');
}
const addResult = () => {
    if (isHaveChildren()) {
        return
    }
    const positionData: NodePositionData = {
        nodeId: props.id,
        type: 'answer',
        nodePosition: props.position,
        nodes: getNodes.value,
        edges: getEdges.value,
    }
    const id = utils.generateNodeId(getNodes.value);
    const currentNode = getNodes.value.find(node => node.id === props.id)
    const childrenEdges = getEdges.value.filter((edge) => edge.source === props.id)
    const childrenNodes = getNodes.value.filter((node) => childrenEdges.some((edge) => edge.target === node.id))
    if (childrenNodes.some((node) => node.type === 'result')) {
        return
    }
    currentNode.data.licenses = selectedLicenses.value;
    calculateTotalLicencesWeight(props.id, currentNode);
    const data = {
        text: 'Пояснительный текст',
        licenses: resultLicenses.value
    }
    const edge: Edge = {
        id: `e${props.id}-${id}`,
        source: props.id,
        target: id,
        type: 'step'
    }
    const node: Node = {
        id,
        data,
        type: 'result',
        position: utils.generateNodePosition(positionData),
        sourcePosition: Position.Bottom
    }
    addNodes(node);
    addEdges(edge);
    updateNode();
}

const getChildrenNodes = (parentId: string) => {
    const targetEdges = getEdges.value.filter((edge:Edge) => edge.source === parentId)
    if (targetEdges) {
        const targetIds = targetEdges.map((edge:Edge) => edge.target);
        chilrenNodesIds.value.push(...targetIds);
        targetIds.forEach((id: string) => getChildrenNodes(id))
    }
    return
}

const deleteNodes = () => {
    chilrenNodesIds.value.push(props.id);
    getChildrenNodes(props.id)
    removeNodes(chilrenNodesIds.value)
}
</script>

<style scoped>

</style>