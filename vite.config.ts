import path from 'path';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [vue()],
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/index.ts'),
			formats: ['es', 'umd'],
			name: 'SandpackVue',
		},
		outDir: 'dist/lib',
		rollupOptions: {
			external: [
				'vue',
				'@codemirror/highlight',
				'@codemirror/lang-css',
				'@codemirror/lang-html',
				'@codemirror/lang-javascript',
				'@codemirror/state',
				'@codemirror/view',
				'@codesandbox/sandpack-client',
			],
			output: {
				globals: {
					vue: 'Vue',
					'@codemirror/highlight': 'CodemirrorHighlight',
					'@codemirror/lang-css': 'CodemirrorLangCss',
					'@codemirror/lang-html': 'CodemirrorLangHtml',
					'@codemirror/lang-javascript': 'CodemirrorLangJavascript',
					'@codemirror/state': 'CodemirrorState',
					'@codemirror/view': 'CodemirrorView',
					'@codesandbox/sandpack-client': 'CodesandboxSandpackClient',
				},
			},
		},
	},
});
