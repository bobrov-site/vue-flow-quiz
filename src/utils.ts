import type { Node, Edge } from "@vue-flow/core"

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

export default {
    generateNodeId,
    generateNumberQuestion
}