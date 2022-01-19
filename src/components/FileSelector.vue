<template>
	<div
		ref="root"
		class="list"
	>
		<div class="container">
			<button
				v-for="file in visibleFiles"
				:key="file.name"
				@click="selectFile(file.name)"
			>
				{{ file.name }}
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { PropType, computed, onMounted, ref } from 'vue';

import { SANDPACK_THEMES } from '../themes';

export type FileType = 'html' | 'css' | 'ts';

export interface File {
	value: string;
	name: string;
	type: FileType;
	editable: boolean;
	visible: boolean;
}

const props = defineProps({
	files: {
		type: Array as PropType<File[]>,
		required: true,
	},
	activeIndex: {
		type: Number,
		required: true,
	},
	theme: {
		type: String,
		required: false,
		default: 'light',
	},
});

const emit = defineEmits(['select']);

const root = ref<HTMLInputElement | null>(null);

onMounted(() => {
	setTheme(props.theme, props.files[0].name);
});

const visibleFiles = computed(() => props.files.filter((file) => file.visible));

function selectFile(name: string) {
	const index = props.files.findIndex((file) => file.name === name);
	setTheme(props.theme, name);
	emit('select', index);
}

function setTheme(themeName: string, fileName: string) {
	const theme = SANDPACK_THEMES[themeName];

	root.value.style.borderBottomColor = theme.palette.inactiveText;
	root.value.style.background = theme.palette.defaultBackground;

	const tabElements = root.value.children[0].children;
	for (let i = 0; i < tabElements.length; i++) {
		const tab = tabElements[i] as HTMLInputElement;
		tab.style.color = theme.palette.defaultText;
		tab.style.borderBottomColor = 'transparent';
		if (visibleFiles.value[i].name === fileName) {
			tab.style.color = theme.palette.accent;
			tab.style.borderBottomColor = theme.palette.accent;
		}
	}
}
</script>

<style scoped>
.list {
	border-bottom-width: 1px;
	border-bottom-style: solid;
}

.container {
	display: flex;
	box-sizing: border-box;
	flex-wrap: nowrap;
	align-items: stretch;
	min-height: 40px;
	margin-bottom: -1px;
	padding: 0 16px;
	overflow: auto;
}

button {
	appearance: none;
	display: block;
	height: 40px;
	padding: 0 8px;
	transition: all 0.15s ease-out;
	border: 0;
	border-bottom: 1px solid transparent;
	outline: none;
	background: transparent;
	font-size: inherit;
	white-space: nowrap;
	cursor: pointer;
}
</style>
