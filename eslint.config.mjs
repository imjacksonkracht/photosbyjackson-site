import next from "eslint-config-next";

const config = [
  ...next,
  { ignores: [".next/**", "node_modules/**", "public/**", "playwright-report/**", "test-results/**", ".claude/**", "legacy/**", ".open-next/**", ".wrangler/**", "review1-screenshots/**"] },
];

export default config;
