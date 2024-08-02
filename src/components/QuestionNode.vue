<template>
    <div class="node-question node">
        <h4 class="node-title">{{ props.data.title }}</h4>
        <input v-model="question" class="node-input" type="text"/>
        <button @click="addAnswer" class="node-button node-button-green" type="button">Добавить ответ</button>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useVueFlow, Position } from '@vue-flow/core'
import type { Edge, Node, NodeProps } from '@vue-flow/core'
const props = defineProps<NodeProps>()
const question = ref<string>('');
const { getNodes, getEdges, addNodes, addEdges} = useVueFlow();

onMounted(() => {
    question.value = props.data.question
})
const addAnswer = () => {
    const id = String(getNodes.value.length + 1);
    const numberAnswer = getEdges.value.filter(edge => edge.source === props.id).length + 1;
    const numberQuestion = props.data.title.split(' ')[1]
    const licenses = []
    if (props.data.licenses.length !== 0) {
        licenses.push(props.data.licenses);
    }
    const data = {
        title: `Ответ ${numberAnswer} на вопрос ${numberQuestion}`,
        text: 'Да',
        licenses
    }
    const edge: Edge = {
        id: `e${props.id}-${id}`,
        source: props.id,
        target: id,
    }
    const node: Node = {
        id,
        data,
        type: 'answer',
        position: { x: 0, y: Math.random() * 400 },
        sourcePosition: Position.Bottom
    }
    addNodes(node);
    addEdges(edge);
}
</script>

<style lang="scss" scoped>

</style>