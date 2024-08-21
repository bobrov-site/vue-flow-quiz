<template>
    <div class="node-license-item">
        <select @change="updateLicense(selectedLicenseId)" :disabled="isHaveChildren()" v-model="selectedLicenseId"
            class="node-license-select">
            <option v-for="item in props.licenses" :key="item.id" :value="item.id" :disabled="isDisabled(item)">{{item.name}}</option>
        </select>
        <select @change="updateLicenseWeight(selectedLicenseId, selectedLicenseWeight)" :disabled="isHaveChildren()" v-model="selectedLicenseWeight"
            class="node-license-select">
            <option value="1">1</option>
            <option value="0">0</option>
            <option value="null">Исключить</option>
        </select>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import type { License, LicenseSelectItem } from '@/types';
import { useVueFlow } from '@vue-flow/core'
const { getEdges } = useVueFlow();
const selectedLicenseWeight = ref<string>('0');
const props = withDefaults(defineProps<LicenseSelectItem>(), {
    license: () => ({ id: 1, name: '', weight: '1' }),
    licenses: () => [],
    disabledLicenses: () => [],
    nodeId: '0',
    index: 0,
})
onMounted(() => {
    console.log(props.license.id, 'mounted 11')
    selectedLicenseId.value = props.license.id
    selectedLicenseWeight.value = props.license.weight
})

watch(() => props.license, () => {
    console.log('watche', props.license.id)
    selectedLicenseId.value = props.license.id
    selectedLicenseWeight.value = props.license.weight
}, {deep: true})
const selectedLicenseId = ref<number>()

const emits = defineEmits(['updateLicense', 'updateLicenseWeight'])

const updateLicense = (licenseId: number) => {
    selectedLicenseId.value = licenseId
    emits('updateLicense', licenseId, props.index);
}

const updateLicenseWeight = (licenseId:number ,weight:string) => {
    selectedLicenseWeight.value = weight;
    emits('updateLicenseWeight', licenseId, weight, props.index);
}

const isHaveChildren = ():boolean => {
    const childrenEdges = getEdges.value.find((edge) => edge.source === props.nodeId)
    if (childrenEdges) {
        return true
    }
    return false
}

const isDisabled = (license: License): boolean => {
    return props.disabledLicenses.some((item) => item.name === license.name)
}

</script>

<style scoped></style>