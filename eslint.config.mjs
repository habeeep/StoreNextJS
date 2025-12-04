import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      "prettier/prettier": "error",
      
      "max-len": ["error", { 
        "code": 100, 
        "ignoreUrls": true, 
        "ignoreTemplateLiterals": true 
      }]
    },
  },
  
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;