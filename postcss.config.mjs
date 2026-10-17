import path from "node:path";

const projectRoot = process.cwd();
process.env.NODE_PATH = path.join(projectRoot, "node_modules");

const config = {
  plugins: {
    "@tailwindcss/postcss": {
      base: projectRoot,
    },
  },
};

export default config;
