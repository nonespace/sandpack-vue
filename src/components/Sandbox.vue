<template>
	<div>
		<iframe ref="editor" />
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, PropType } from 'vue';
import { ClientOptions, SandpackClient, SandboxInfo } from '@codesandbox/sandpack-client';

const props = defineProps({
	info: {
		type: Object as PropType<SandboxInfo>,
		required: true,
	},
	options: {
		type: Object as PropType<ClientOptions>,
		required: false,
	}
});

const editor = ref(null);
let client: SandpackClient | null = null;

onMounted(() => {
	client = new SandpackClient(editor.value, props.info, props.options);
});

watch(() => props.info, (info) => {
	client.updatePreview(info);
});
</script>

<style scoped>
iframe {
	border: none;
	width: 100%;
	height: 100%;
}
</style>
