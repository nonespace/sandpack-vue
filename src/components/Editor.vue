<template>
	<div>
		<FileSelector
			v-if="hasVisibleFiles"
			class="selector"
			:active-index="activeFileIndex"
			:files="files"
			@select="handleFileSelect"
		/>
		<div
			ref="editorInput"
			class="input"
		/>
	</div>
</template>

<script setup lang="ts">
import * as monaco from 'monaco-editor';
import { PropType, computed, onMounted, ref } from 'vue';

import FileSelector, { File } from './FileSelector.vue';

const props = defineProps({
	files: {
		type: Array as PropType<File[]>,
		required: true,
	},
});

const emit = defineEmits(['change']);

const editorInput = ref(null);
let editor: monaco.editor.IStandaloneCodeEditor = null;

const activeFileIndex = ref(0);
const activeFile = computed(() => props.files[activeFileIndex.value]);

const hasVisibleFiles = computed(() => props.files.some((file) => file.visible));

onMounted(() => {
	editor = monaco.editor.create(editorInput.value, {
		// Common config
		lineNumbers: 'off',
		minimap: {
			enabled: false,
		},
		contextmenu: false,
		scrollBeyondLastLine: false,
		glyphMargin: false,
		// File config
		readOnly: !activeFile.value.editable,
		// File content
		value: activeFile.value.value,
		language: activeFile.value.language,
	});

	editor.onDidChangeModelContent(() => {
		const value = editor.getValue();
		emit('change', activeFileIndex.value, value);
	});
});

function handleFileSelect(index: number) {
	activeFileIndex.value = index;

	editor.dispose();

	editor = monaco.editor.create(editorInput.value, {
		// Common config
		lineNumbers: 'off',
		minimap: {
			enabled: false,
		},
		contextmenu: false,
		scrollBeyondLastLine: false,
		glyphMargin: false,
		// File config
		readOnly: !activeFile.value.editable,
		// File content
		value: activeFile.value.value,
		language: activeFile.value.language,
	});

	editor.onDidChangeModelContent(() => {
		const value = editor.getValue();
		emit('change', activeFileIndex.value, value);
	});
}
</script>

<style scoped>
.selector {
	height: 40px;
}

.input {
	height: 100%;
}

.selector + .input {
	height: calc(100% - 40px - 32px);
	margin: 16px 0;
}
</style>
