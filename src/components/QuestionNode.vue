<template>
    <div class="node-question node">
        <div class="node-header">
            <h4 class="node-title">{{ props.data.title }}</h4>
            <div v-if="props.id !== '1'" @click="deleteNodes" class="node-trash-icon">
                <Icon name="delete"/>
            </div>
        </div>
        <input @change="updateNode" v-model="text" class="node-input" type="text"/>
        <button @click="addAnswer" class="node-button node-button-green" type="button">Добавить ответ</button>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useVueFlow, useNode } from '@vue-flow/core'
import type { Edge, Node, NodeProps } from '@vue-flow/core'
import Icon from '@/components/icons/Icon.vue';
import utils from '@/utils';
import type { NodePositionData } from '@/types';

const props = defineProps<NodeProps>()
const text = ref<string>('');
const chilrenNodesIds = ref<string[]>([])
const { getNodes, getEdges, addNodes, addEdges, dimensions, removeNodes} = useVueFlow();
const { node: currentNode } = useNode()

onMounted(() => {
    text.value = props.data.text
})

const updateNode = () => {
    currentNode.data = {
        title: currentNode.data.title,
        licenses: currentNode.data.licenses,
        text: text.value,
    }
}
const addAnswer = () => {
    const positionData: NodePositionData = {
        nodeId: props.id,
        type: 'answer',
        nodePosition: props.position,
        nodes: getNodes.value,
        edges: getEdges.value,
    }
    const position = utils.generateNodePosition(positionData);
    const node: Node = {
        id: '',
        type: 'answer',
        position,
    }
    const edge: Edge = {
        id: '',
        source: props.id,
        target: '',
        type: 'step'
    }
    const id = utils.generateNodeId(getNodes.value);
    const numberAnswer = utils.generateNumberAnswer(getNodes.value, getEdges.value, props.id);
    const numberQuestion = props.data.title.split(' ')[1]
    const data = {
        title: `Ответ ${numberAnswer} на вопрос ${numberQuestion}`,
        text: 'Да',
        licenses: JSON.parse(JSON.stringify(props.data.licenses.length !== 0 ? props.data.licenses : [])),
        dictionary: props.data.dictionary
    }
    node.id = id;
    node.data = data;
    edge.id = `e${props.id}-${node.id}`;
    edge.target = node.id;
    addNodes(node);
    addEdges(edge);
    updateNode();
    console.log(getNodes.value, 'final after question')
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