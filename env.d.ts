/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>
  export default component
}

declare module 'vue-final-modal' {
  import { Plugin } from 'vue'
  const VueFinalModal: () => Plugin
  export default VueFinalModal
}
