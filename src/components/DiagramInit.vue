<template>
      <VueFlow
    :nodes="nodes"
    :edges="edges"
    :class="{ dark }"
    class="basic-flow"
    :default-viewport="{ zoom: 1.5 }"
    :min-zoom="0.2"
    :max-zoom="4"
    :deleteKeyCode="null"
  >
    <Background pattern-color="#aaa" :gap="16" />

    <template #node-question="questionNodeProps">
      <QuestionNode v-bind="questionNodeProps"/>
    </template>
    <template #node-answer="answerNodeProps">
      <AnswerNode v-bind="answerNodeProps"/>
    </template>
    <template #node-result="resultNodeProps">
      <ResultNode v-bind="resultNodeProps"/>
    </template>

    <MiniMap />

    <Controls position="top-left">
      <ControlButton title="Reset Transform" @click="resetTransform">
        <Icon name="reset" />
      </ControlButton>

      <ControlButton title="Save json" @click="saveJson">
        <Icon name="save" />
      </ControlButton>
      
      <ControlButton title="Delete all" @click="resetAll">
        <Icon name="delete"/>
      </ControlButton>

      <ControlButton title="Toggle Dark Mode" @click="toggleDarkMode">
        <Icon v-if="dark" name="sun" />
        <Icon v-else name="moon" />
      </ControlButton>

      <ControlButton title="Log `toObject`" @click="logToObject">
        <Icon name="log" />
      </ControlButton>
    </Controls>
  </VueFlow>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { ControlButton, Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { initialEdges, initialNodes } from '../../initial-elements.js'
import type { Edge, Node } from '@vue-flow/core'
import QuestionNode from './QuestionNode.vue';
import AnswerNode from './AnswerNode.vue';
import Icon from '@/components/icons/Icon.vue'
import ResultNode from './ResultNode.vue'
import api from '@/api.js'
/**
 * `useVueFlow` provides:
 * 1. a set of methods to interact with the VueFlow instance (like `fitView`, `setViewport`, `addEdges`, etc)
 * 2. a set of event-hooks to listen to VueFlow events (like `onInit`, `onNodeDragStop`, `onConnect`, etc)
 * 3. the internal state of the VueFlow instance (like `nodes`, `edges`, `viewport`, etc)
 */
const { onInit, onConnect, addEdges, setViewport, toObject, fromObject, getNodes, getEdges, removeNodes, removeEdges } = useVueFlow()

const nodes = ref<Node[]>(initialNodes)

const edges = ref<Edge[]>(initialEdges)

// our dark mode toggle flag
const dark = ref<boolean>(false)

/**
 * This is a Vue Flow event-hook which can be listened to from anywhere you call the composable, instead of only on the main component
 * Any event that is available as `@event-name` on the VueFlow component is also available as `onEventName` on the composable and vice versa
 *
 * onInit is called when the VueFlow viewport is initialized
 */
onInit(async(vueFlowInstance) => {
  // instance is the same as the return of `useVueFlow`
  const quiz = await api.fetchNodes();
  if (quiz) {
    fromObject(quiz);
  }
  vueFlowInstance.fitView()
})

/**
 * onConnect is called when a new connection is created.
 *
 * You can add additional properties to your new edge (like a type or label) or block the creation altogether by not calling `addEdges`
 */
onConnect((connection) => {
  addEdges(connection)
})

/**
 * To update a node or multiple nodes, you can
 * 1. Mutate the node objects *if* you're using `v-model`
 * 2. Use the `updateNode` method (from `useVueFlow`) to update the node(s)
 * 3. Create a new array of nodes and pass it to the `nodes` ref
 */
const saveJson = () => {
  const json = JSON.stringify(toObject())
  api.saveJson(json);
}

const resetAll = () => {
  removeNodes(getNodes.value.map((node) => node.id).filter((id,index) => index !== 0));
  removeEdges(getEdges.value.map((edge) => edge.id));
}

/**
 * toObject transforms your current graph data to an easily persist-able object
 */
function logToObject() {
  console.log(toObject())
}

/**
 * Resets the current viewport transformation (zoom & pan)
 */
function resetTransform() {
  setViewport({ x: 0, y: 0, zoom: 1 })
}

function toggleDarkMode() {
  dark.value = !dark.value
}
</script>

<style scoped>

</style>