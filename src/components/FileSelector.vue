<template>
	<div class="list">
		<div class="container">
			<button
				v-for="file in visibleFiles"
				:key="file.name"
				:class="{ active: files[activeIndex].name === file.name }"
				@click="selectFile(file.name)"
			>
				{{ file.name }}
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';

export interface File {
	value: string;
	name: string;
	language: string;
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
});

const emit = defineEmits(['select']);

const visibleFiles = computed(() => props.files.filter((file) => file.visible));

function selectFile(name: string) {
	const index = props.files.findIndex((file) => file.name === name);
	emit('select', index);
}
</script>

<style scoped>
.container {
	-moz-box-align: stretch;
	display: flex;
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
	color: grey;
	font-size: inherit;
	white-space: nowrap;
	cursor: pointer;
}

button:hover {
	background: #eee;
	color: gray;
}

button.active {
	border-bottom: 1px solid black;
	color: black;
}
</style>
