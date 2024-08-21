import type { Edge, Node } from "@vue-flow/core"

export interface License {
    id: number,
    name: string,
    weight?: string,
}

export interface NodePosition {
    x: number,
    y: number,
}

export interface NodePositionData {
    nodeId: string,
    type: NodeType,
    nodePosition: NodePosition,
    nodes: Node[],
    edges: Edge[],
}

export interface LicenseSelectItem {
    license: License,
    licenses: License[],
    disabledLicenses: License[] | [],
    nodeId: string,
    index: number,
}

export type NodeType = 'question' | 'answer' | 'result'