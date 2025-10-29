export type GetEndpointResult = (key: string, context: GetEndpointResultContext) => Promise<{ value: unknown }>;
export type GetEndpointResultContext = { query: Record<string, unknown> };
export type DisplayOptions = Record<string, unknown>;
export type ResolveImage = (imageName: string, source: string) => string;
export type ResolvePath = (fileName: string, options: { source: string }) => string;
export type AppProps = {
  displayOptions: DisplayOptions;
  getEndpointResult: GetEndpointResult;
  qDoc: Record<string, unknown>;
  resolveImage: ResolveImage;
  resolvePath: ResolvePath;
};
