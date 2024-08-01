<template>
    <div class="node-question node">
        <h4 class="node-title">{{ props.data.title }}</h4>
        <input v-model="question" class="node-input" type="text"/>
        <button @click="addAnswer" class="node-button node-button-green" type="button">Добавить ответ</button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useVueFlow, Position } from '@vue-flow/core'
import type { Edge, Node, NodeProps } from '@vue-flow/core'
const props = defineProps<NodeProps>()
const question = ref<string>('');
const { getNodes, getEdges, addNodes, onInit} = useVueFlow();

onInit(() => {
    question.value = props.data.question
})
const addAnswer = () => {
    const licenses = []
    const id = String(getNodes.value.length + 1);
    const currentNode = getNodes.value[getNodes.value.length - 1];
    console.log(currentNode)
    const parentNode = getEdges.value.find((node) => node.target === id);
    const numberAnswer = getEdges.value.filter(edge => edge.source === currentNode.id).length + 1;
    const data = {
        title: `Ответ ${numberAnswer} на вопрос ${currentNode.id}`,
        text: 'Да',
    }
    const node: Node = {
        id,
        data,
        type: 'answer',
        parentNode: parentNode ? parentNode.id : '',
        position: { x: Math.random() * 500, y: Math.random() * 500 },
        sourcePosition: Position.Bottom
    }
    addNodes(node);
    // const edge: Edge = {
    //     id: `e${id}`,
    //     source: id,
    //     target: id,
    // }
}
</script>

<style lang="scss" scoped>

</style>