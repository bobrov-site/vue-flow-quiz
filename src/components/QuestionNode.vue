<template>
    <div class="node-question node">
        <div class="node-header">
            <h4 class="node-title">{{ props.data.title }}</h4>
            <div v-if="props.id !== '1'" @click="deleteNodes" class="node-trash-icon">
                <Icon name="delete"/>
            </div>
        </div>
        <input v-model="question" class="node-input" type="text"/>
        <button @click="addAnswer" class="node-button node-button-green" type="button">Добавить ответ</button>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useVueFlow, Position } from '@vue-flow/core'
import type { Edge, Node, NodeProps } from '@vue-flow/core'
import Icon from '@/components/icons/Icon.vue';

const props = defineProps<NodeProps>()
const question = ref<string>('');
const chilrenNodesIds = ref<string[]>([])
const { getNodes, getEdges, addNodes, addEdges, dimensions, removeNodes} = useVueFlow();

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
        position: { x: Math.random() * dimensions.value.width, y: Math.random() * dimensions.value.height },
        sourcePosition: Position.Bottom
    }
    addNodes(node);
    addEdges(edge);
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

<style lang="scss" scoped>

</style>