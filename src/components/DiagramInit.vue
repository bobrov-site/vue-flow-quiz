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
    <Background pattern-color="#fff" :gap="16" />

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

    <Controls :showFitView="false" position="top-left">

      <ControlButton title="fullwidth" @click="setFullWidth">
        <Icon name="fullwidth"/>
      </ControlButton>

      <ControlButton title="Save json" @click="saveJson">
        <Icon name="save" />
      </ControlButton>
      
      <ControlButton title="Delete all" @click="resetAll">
        <Icon name="delete"/>
      </ControlButton>

      <ControlButton v-if="utils.isCurrentUrlDev(currentUrl)" title="Log `toObject`" @click="logToObject">
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
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import utils from '@/utils.js'
/**
 * `useVueFlow` provides:
 * 1. a set of methods to interact with the VueFlow instance (like `fitView`, `setViewport`, `addEdges`, etc)
 * 2. a set of event-hooks to listen to VueFlow events (like `onInit`, `onNodeDragStop`, `onConnect`, etc)
 * 3. the internal state of the VueFlow instance (like `nodes`, `edges`, `viewport`, etc)
 */
const { onInit, onConnect, addEdges, toObject, fromObject, getNodes, getEdges, removeNodes, removeEdges, vueFlowRef } = useVueFlow()

const nodes = ref<Node[]>()

const edges = ref<Edge[]>(initialEdges)
const quizId = ref<number>();
const emits = defineEmits(['fullWidth'])

// our dark mode toggle flag
const dark = ref<boolean>(false)
const currentUrl = window.location.href

/**
 * This is a Vue Flow event-hook which can be listened to from anywhere you call the composable, instead of only on the main component
 * Any event that is available as `@event-name` on the VueFlow component is also available as `onEventName` on the composable and vice versa
 *
 * onInit is called when the VueFlow viewport is initialized
 */
onInit(async(vueFlowInstance) => {
  // instance is the same as the return of `useVueFlow`
  const {quiz, id} = await api.fetchNodes();
  const dictionary = await api.fetchLicenses();
  quizId.value = id;
  if (quiz && quiz.quiz.nodes.length !== 1) {
    console.log(quiz.quiz, 'quiz')
    quiz.quiz.nodes.forEach((node: Node) => {
      node.data.dictionary = dictionary;
    })
    fromObject(quiz.quiz);
  }
  nodes.value = initialNodes;
})

/**
 * onConnect is called when a new connection is created.
 *
 * You can add additional properties to your new edge (like a type or label) or block the creation altogether by not calling `addEdges`
 */
onConnect((connection) => {
  addEdges(connection)
})

const validateQuiz = ():boolean => {
  const answersIds = getNodes.value.filter((node: Node) => node.type === 'answer').map((node: Node) => node.id);
  const sourses = getEdges.value.map((edge: Edge) => edge.source);
  const map = answersIds.map((id: string) => sourses.includes(id));
  if (map.includes(false)) {
    return false
  }
  return true
}
const saveJson = async() => {
  if (!validateQuiz()) {
    toast.error('Ошибка. Не сохранено. Проверьте правильность заполнения конструктора');
    return
  }
  try {
    await api.saveJson(toObject(), quizId.value);
    toast.success('Сохранено');
  }
  catch (e) {
    toast.error('Ошибка. Не сохранено');
  }
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


function toggleDarkMode() {
  dark.value = !dark.value
}

const setFullWidth = () => {
  console.log(123)
  emits('fullWidth');
}
</script>

<style scoped>

</style>