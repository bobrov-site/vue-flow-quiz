import { MarkerType } from '@vue-flow/core'

export const initialNodes = [
  {
    id: '1',
    type: 'question',
    data: {title: 'Вопрос 1', question: 'Является ли ваше произведение ПО'},
    position: {x: 0, y: 0},
    class: 'light',
  },
]

export const initialEdges = [
  // {
  //   id: 'e1-2',
  //   source: '1',
  //   target: '2',
  //   animated: true,
  // },
  // {
  //   id: 'e1-3',
  //   source: '1',
  //   target: '3',
  //   label: 'edge with arrowhead',
  //   markerEnd: MarkerType.ArrowClosed,
  // },
  // {
  //   id: 'e4-5',
  //   type: 'step',
  //   source: '4',
  //   target: '5',
  //   label: 'Node 2',
  //   style: { stroke: 'orange' },
  //   labelBgStyle: { fill: 'orange' },
  // },
  // {
  //   id: 'e3-4',
  //   type: 'smoothstep',
  //   source: '3',
  //   target: '4',
  //   label: 'smoothstep-edge',
  // },
]
