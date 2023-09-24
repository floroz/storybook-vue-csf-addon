import type { StorybookConfig } from "@storybook/vue3-vite";
import inspect from 'vite-plugin-inspect';

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx|vue)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "../../src/storybook.ts",
  ],
  framework: {
    name: "@storybook/vue3-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  async viteFinal(config) {
    // Inspect result can be found at subroute '/__inspect', e.g. http://127.0.0.1:6006/__inspect/
    config?.plugins?.unshift(inspect())
    return config
  },
};
export default config;
