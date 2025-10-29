declare module '*.svg' {
  const content: string;
  export default content;
}

declare global {
  interface Window {
    vamp?: Record<string, unknown>;
  }
}

export {};
