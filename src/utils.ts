import type { Node } from "@vue-flow/core"

const generateNodeId = (nodes: Node[]): string => {
    return String(Number.parseInt(nodes[nodes.length - 1].id) + 1)
}

export default {
    generateNodeId
}