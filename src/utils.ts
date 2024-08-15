import type { Node, Edge } from "@vue-flow/core"
import type { NodeType } from "./types"

const generateNodeId = (nodes: Node[]): string => {
    return String(Number.parseInt(nodes[nodes.length - 1].id) + 1)
}

const generateNumberQuestion = (nodes: Node[], edges: Edge[], nodeId: string): number => {
    const parentId = edges.find((edge) => edge.target === nodeId)?.source
    const parent = nodes.find((node) => node.id === parentId)
    if (parent) {
        return Number.parseInt(parent.data.title.split(' ')[1]) + 1
    }
    return 0
}

const generateNumberAnswer = (nodes: Node[], edges: Edge[], nodeId: string) => {
    const childrenEdges = edges.filter(edge => edge.source === nodeId);
    const childrenAnswers = nodes.filter(node => childrenEdges.some(edge => edge.target === node.id));
    if (childrenAnswers.length !== 0) {
        return Number.parseInt(childrenAnswers[childrenAnswers.length - 1].data.title.split(' ')[1]) + 1
    }
    return 1
}

const generateNodePosition = (nodeId: string, type: NodeType) => {

}

export default {
    generateNodeId,
    generateNumberQuestion,
    generateNumberAnswer
}