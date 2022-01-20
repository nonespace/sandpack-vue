<template>
	<div
		ref="wrapper"
		class="wrapper"
	>
		<FileSelector
			v-if="hasVisibleFiles"
			class="selector"
			:active-index="activeFileIndex"
			:files="files"
			:theme="theme"
			@select="handleFileSelect"
		/>
	</div>
</template>

<script setup lang="ts">
import { HighlightStyle, defaultHighlightStyle, tags } from '@codemirror/highlight';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { EditorState, Compartment } from '@codemirror/state';
import { EditorView, highlightSpecialChars, highlightActiveLine } from '@codemirror/view';
import { PropType, computed, onMounted, ref } from 'vue';

import { SANDPACK_THEMES } from '../themes';

import FileSelector, { File, FileType } from './FileSelector.vue';

const props = defineProps({
	files: {
		type: Array as PropType<File[]>,
		required: true,
	},
	theme: {
		type: String,
		required: false,
		default: 'light',
	},
});

const emit = defineEmits(['change']);

const language = new Compartment();

const wrapper = ref<HTMLElement | null>(null);

const activeFileIndex = ref(0);
const activeFile = computed(() => props.files[activeFileIndex.value]);

const hasVisibleFiles = computed(() => props.files.some((file) => file.visible));

let editor: EditorView | null = null;

function getSyntaxStyle(token: any): any {
	if (typeof token === 'string') {
		return { color: token };
	}
	return token;
}

function hexToCSSRGBa(hex: string, alpha: number): string {
	if (hex.startsWith('#') && (hex.length === 4 || hex.length === 7)) {
		const { red, green, blue } = hexToRGB(hex);
		return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
	}

	return hex;
}

function hexToRGB(hex: string): { red: number; green: number; blue: number } {
	let r = '0';
	let g = '0';
	let b = '0';

	if (hex.length === 4) {
		r = '0x' + hex[1] + hex[1];
		g = '0x' + hex[2] + hex[2];
		b = '0x' + hex[3] + hex[3];
	} else if (hex.length === 7) {
		r = '0x' + hex[1] + hex[2];
		g = '0x' + hex[3] + hex[4];
		b = '0x' + hex[5] + hex[6];
	}

	return {
		red: +r,
		green: +g,
		blue: +b,
	};
}

function getTheme(themeName: string) {
	const theme = SANDPACK_THEMES[themeName];
	return EditorView.theme({
		'&': {
			backgroundColor: theme.palette.defaultBackground,
			color: getSyntaxStyle(theme.syntax.plain).color || theme.palette.activeText,
			padding: '16px 0',
			height: 'calc(100% - 40px)',
		},

		'&.cm-editor.cm-focused': {
			outline: 'none',
		},

		'.cm-activeLine': {
			backgroundColor: hexToCSSRGBa(theme.palette.activeBackground, 0.5),
		},

		'.cm-errorLine': {
			backgroundColor: hexToCSSRGBa(theme.palette.errorBackground, 0.2),
		},

		'.cm-matchingBracket, .cm-nonmatchingBracket': {
			color: 'inherit',
			background: theme.palette.activeBackground,
		},

		'.cm-content': {
			padding: 0,
			caretColor: theme.palette.activeText,
		},

		'.cm-scroller': {
			fontFamily: theme.typography.monoFont,
			lineHeight: theme.typography.lineHeight,
		},

		'.cm-gutters': {
			backgroundColor: theme.palette.defaultBackground,
			color: theme.palette.defaultText,
			border: 'none',
		},

		'.cm-gutter.cm-lineNumbers': {
			paddingLeft: '4px',
			paddingRight: '4px',
		},

		'.cm-lineNumbers .cm-gutterElement': {
			padding: 0,
		},

		'.cm-line': {
			padding: '0 12px',
		},
	});
}

function getSyntaxHighlight(themeName: string) {
	const theme = SANDPACK_THEMES[themeName];
	return HighlightStyle.define([
		{ tag: tags.link, textDecoration: 'underline' },
		{ tag: tags.emphasis, fontStyle: 'italic' },
		{ tag: tags.strong, fontWeight: 'bold' },

		{
			tag: tags.keyword,
			...getSyntaxStyle(theme.syntax.keyword),
		},
		{
			tag: [tags.atom, tags.number, tags.bool],
			...getSyntaxStyle(theme.syntax.static),
		},
		{
			tag: tags.tagName,
			...getSyntaxStyle(theme.syntax.tag),
		},
		{ tag: tags.variableName, ...getSyntaxStyle(theme.syntax.plain) },
		{
			// Highlight function call
			tag: tags.function(tags.variableName),
			...getSyntaxStyle(theme.syntax.definition),
		},
		{
			// Highlight function definition differently (eg: functional component def in React)
			tag: tags.definition(tags.function(tags.variableName)),
			...getSyntaxStyle(theme.syntax.definition),
		},
		{
			tag: tags.propertyName,
			...getSyntaxStyle(theme.syntax.property),
		},
		{
			tag: [tags.literal, tags.inserted],
			...getSyntaxStyle(theme.syntax.string ?? theme.syntax.static),
		},
		{ tag: tags.punctuation, ...getSyntaxStyle(theme.syntax.punctuation) },
		{ tag: tags.comment, ...getSyntaxStyle(theme.syntax.comment) },
	]);
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

	if (!editor) {
		return;
	}

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
		highlightSpecialChars(),
		highlightActiveLine(),
		defaultHighlightStyle.fallback,
		getTheme(props.theme),
		getSyntaxHighlight(props.theme),

		EditorView.editable.of(activeFile.value.editable),
		language.of(getLanguage(activeFile.value.type)),
	];

	if (!wrapper.value) {
		return;
	}

	editor = new EditorView({
		state: EditorState.create({
			doc: activeFile.value.value,
			extensions,
		}),
		parent: wrapper.value,
		dispatch: (transaction): void => {
			if (!editor) {
				return;
			}
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
.wrapper {
	font-size: 14px;
}

.selector {
	height: 40px;
}
</style>
