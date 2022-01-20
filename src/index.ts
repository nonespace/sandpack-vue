// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Editor from './components/Editor.vue';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { File } from './components/FileSelector.vue';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Sandbox from './components/Sandbox.vue';
import type {
	SandpackTheme,
	SandpackPredefinedTheme,
	SandpackSyntaxStyle,
} from './themes';

export { Editor, Sandbox };
export type {
	File,
	SandpackTheme,
	SandpackPredefinedTheme,
	SandpackSyntaxStyle,
};
