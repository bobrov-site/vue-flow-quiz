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
            <LicenseSelectItem 
            v-for="(license,index) in selectedLicenses" 
            :key="license.id"
            :license="license"
            :licenses="licenses"
            :disabledLicenses="disabledLicenses"
            :nodeId="props.id"
            :index="index"
            @updateLicense="updateLicense"
            @updateLicenseWeight="updateLicenseWeight"
            />
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
import { toast } from 'vue3-toastify';
import LicenseSelectItem from './LicenseSelectItem.vue';

const { getNodes, getEdges, addNodes, addEdges, dimensions, removeNodes } = useVueFlow();
const text = ref<string>('');
const props = defineProps<NodeProps>()
const licenses = ref<License[] | []>()
const resultLicenses = shallowRef<License[] | []>()
const selectedLicenses = shallowRef<License[]>([]);
const disabledLicenses = shallowRef<License[]>([]);
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

const updateLicense = (licenseId:number, index:number) => {
    selectedLicenses.value[index] = licenses.value?.find((license) => license.id === licenseId)
}

const updateLicenseWeight = (licenseId:number, weight: string, index:number) => {
    const license = selectedLicenses.value.find((license) => license.id === licenseId);
    if (license) {
        license.weight = weight;
    }
}

const fetchLicenses = async() => {
    try {
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
            selectedLicenses.value = [...node.data.licenses]
            disabledLicenses.value = [...node.data.licenses];
        }
        else {
            selectedLicenses.value.push(licenses.value[0])
        }
    }
    catch (e) {
        const fakeLicenses: License[] = [
            {
                id: 1,
                name: 'Лицензия 1',
                weight: '0'
            },
            {
                id: 2,
                name: 'Лицензия 2',
                weight: '0'
            },
            {
                id: 3,
                name: 'Лицензия 3',
                weight: '0'
            }
        ]
        licenses.value = fakeLicenses;
        toast.warn('Добавлены фейковые лицензии для дебага. Пожалуйста не сохраняйте результат')
        if (props.data.licenses.length !== 0) {
            selectedLicenses.value = [...node.data.licenses]
            disabledLicenses.value = [...node.data.licenses];
        }
        else {
            selectedLicenses.value.push(licenses.value[0])
        }
    }
    finally {
        process.value = 'loaded';
    }
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

const addLicense = () => {
    if (isHaveChildren()) {
        return
    }
    disabledLicenses.value.push(selectedLicenses.value[selectedLicenses.value.length - 1]);
    const disabledIds = disabledLicenses.value.map((license) => license.id);
    const licensesIds = licenses.value?.map((license) => license.id);
    const filtredIds = licensesIds?.filter((id) => !disabledIds.includes(id));
    
    // Find the last license that is not disabled
    const availableLicenses = licenses.value?.filter((license) => !disabledIds.includes(license.id));
    const setNewLicense = availableLicenses[availableLicenses.length - 1];
    
    if (!setNewLicense) {
        return;
    }
    console.log(setNewLicense.id, 'newLicenseId')
    selectedLicenses.value.push(setNewLicense);
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