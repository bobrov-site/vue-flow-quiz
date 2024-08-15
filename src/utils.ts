import type { Node, Edge } from "@vue-flow/core"
import type { NodePosition, NodePositionData, NodeType } from "./types"

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

const generateNodePosition = (positionData: NodePositionData): NodePosition => {
    const childrenEdges = positionData.edges.filter((edge) => edge.source === positionData.nodeId);
    const childrenNodes = positionData.nodes.filter((node) => childrenEdges.some((edge) => edge.target === node.id))
    const yGap = 100;
    const xGap = 100;
    const position = {
        x: positionData.nodePosition.x,
        y: positionData.nodePosition.y,
    }
    const domElement = document.querySelector(`[data-id="${positionData.nodeId}"]`);
    position.y = position.y + domElement.offsetHeight + yGap;
    if (positionData.type === 'answer') {
        if (childrenNodes.length > 0) {
            let cumulativeWidth = 100;
            childrenNodes.forEach((childNode, index) => {
                const domElementChild = document.querySelector(`[data-id="${childNode.id}"]`);
                if (domElementChild) {
                    cumulativeWidth += domElementChild.offsetWidth + (index === 0 ? 0 : xGap);
                }
            });
            position.x += cumulativeWidth;
        }
    }
    return position;
}

export default {
    generateNodeId,
    generateNumberQuestion,
    generateNumberAnswer,
    generateNodePosition,
}