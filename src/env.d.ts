/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module '*.json' {
  const value: any;
  export default value;
}

declare module '*.md' {
  const content: string;
  export default content;
}

declare module '*.md?raw' {
  const content: string;
  export default content;
}