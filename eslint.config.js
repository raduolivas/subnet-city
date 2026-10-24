import js from '@eslint/js';
import ts from 'typescript-eslint';
export default ts.config({ignores:['dist/**','.superpowers/**']},js.configs.recommended,...ts.configs.recommended,{files:['**/*.{ts,tsx}'],languageOptions:{globals:{window:'readonly',document:'readonly',localStorage:'readonly',Storage:'readonly',HTMLElement:'readonly',setTimeout:'readonly',clearTimeout:'readonly',console:'readonly'}}});
