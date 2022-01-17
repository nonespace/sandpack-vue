# Sandpack Vue

Vue components for [Sandpack](https://sandpack.codesandbox.io).

> Note: this package is in heavy development. Expect breaking changes.

## Example

```html
<template>
	<h1>Basic</h1>
	<Sandbox class="sandbox" :info="info" />
</template>

<script setup lang="ts">
import { Sandbox } from 'sandpack-vue';

const info = {
	files: {
		'/index.html': {
			code: `<!DOCTYPE html>
			<html>
			<body>
			<h1>Hello Sandpack!</h1>
			<div id="app"></div>
			<script src="src/index.ts" />
			</body>
			</html>`,
		},
		'/index.js': {
			code: `import { v4 as uuidv4 } from 'uuid';
			document.getElementById("app").innerHTML = \`
			<div>
			$\{uuidv4()}
			</div>\``,
		},
	},
	entry: '/index.js',
	dependencies: {
		uuid: 'latest',
	},
};
```
