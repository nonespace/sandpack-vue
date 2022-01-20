import Editor from './components/Editor.vue';
import Sandbox from './components/Sandbox.vue';
import type { File } from './files';
import type {
	SandpackTheme,
	SandpackPredefinedTheme,
	SandpackSyntaxStyle,
} from './themes';
import { getPredefinedTheme } from './themes';

export { Editor, Sandbox, getPredefinedTheme };
export type {
	File,
	SandpackTheme,
	SandpackPredefinedTheme,
	SandpackSyntaxStyle,
};
