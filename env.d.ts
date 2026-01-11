/// <reference types="vite/client" />

import 'vue'

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>
  export default component
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: (key: string) => string;
    $tr: (key: string, replacements?: Record<string, string | number>) => string;
  }
}
