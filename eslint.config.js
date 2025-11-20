import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([

  globalIgnores(['dist']),

  {
    files: ['**/*.ts', '**/*.tsx', 'eslint.config.js'], // Ciblez les fichiers
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        // 👇 Pointer vers le nouveau fichier de configuration TS
        project: './tsconfig.eslint.json',
        // ...
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
  },

])
