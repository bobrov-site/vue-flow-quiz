<template>
    <div class="node-result node">
        <div class="node-header">
            <h4 class="node-title">Результат</h4>
            <div @click="deleteNodes" class="node-trash-icon">
                <Icon name="delete"/>
            </div>
        </div>
        <input @change="updateNode" v-model="text" class="node-input" placeholder="Текст результата" type="text"/>
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
import { useNode, useVueFlow } from '@vue-flow/core';
import type { NodeProps, Edge, Node } from '@vue-flow/core';
import Icon from '@/components/icons/Icon.vue';
import type { License } from '@/types';
const props = defineProps<NodeProps>()
const licenses = ref<License[] | []>()
const text = ref<string>('');
const { node: currentNode } = useNode()
const { getEdges, removeNodes } = useVueFlow();
const chilrenNodesIds = ref<string[]>([])
onMounted(() => {
    text.value = props.data.text;
    licenses.value = props.data.licenses;
    console.log(props.data.dictionary, 'dictionary');
})
const updateNode = () => {
    currentNode.data = {
        licenses: currentNode.data.licenses,
        text: text.value,
    }
}

const changeLicensesNames = () => {
    
}

const deleteNodes = () => {
    chilrenNodesIds.value.push(props.id);
    getChildrenNodes(props.id)
    removeNodes(chilrenNodesIds.value)
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
</script>

<style scoped>

</style>