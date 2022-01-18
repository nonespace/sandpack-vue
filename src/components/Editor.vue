<template>
	<div ref="wrapper">
		<FileSelector
			v-if="hasVisibleFiles"
			class="selector"
			:active-index="activeFileIndex"
			:files="files"
			@select="handleFileSelect"
		/>
	</div>
</template>

<script setup lang="ts">
import { EditorState, EditorView, basicSetup } from '@codemirror/basic-setup';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { Compartment } from '@codemirror/state';
import { PropType, computed, onMounted, ref } from 'vue';

import FileSelector, { File, FileType } from './FileSelector.vue';

const props = defineProps({
	files: {
		type: Array as PropType<File[]>,
		required: true,
	},
});

const emit = defineEmits(['change']);

const language = new Compartment();

const wrapper = ref(null);

const activeFileIndex = ref(0);
const activeFile = computed(() => props.files[activeFileIndex.value]);

const hasVisibleFiles = computed(() => props.files.some((file) => file.visible));

let editor: EditorView | null = null;

function getTheme() {
	return EditorView.theme({
		'&': {
			padding: '8px 0',
			height: 'calc(100% - 40px)',
		},
	});
}

function getLanguage(type: FileType) {
	switch (type) {
	case 'ts':
		return javascript({ typescript: true, jsx: false });
	case 'html':
		return html();
	case 'css':
		return css();
	default:
		return javascript();
	}
}

function handleFileSelect(index: number) {
	activeFileIndex.value = index;

	editor.dispatch({
		changes: {
			from: 0,
			to: editor.state.doc.length,
			insert: activeFile.value.value,
		},
	});
	editor.dispatch({
		effects: language.reconfigure(getLanguage(activeFile.value.type)),
	});
}

onMounted(() => {
	const extensions = [
		basicSetup,
		getTheme(),

		EditorView.editable.of(activeFile.value.editable),
		language.of(getLanguage(activeFile.value.type)),
	];

	editor = new EditorView({
		state: EditorState.create({
			doc: activeFile.value.value,
			extensions,
		}),
		parent: wrapper.value,
		dispatch: (transaction): void => {
			editor.update([transaction]);

			if (transaction.docChanged) {
				const lines = transaction.newDoc.toJSON();
				const text = lines.join('\n');
				emit('change', activeFileIndex.value, text);
			}
		},
	});
});
</script>

<style scoped>
.selector {
	height: 40px;
}

.input {
	height: 100%;
}
</style>
