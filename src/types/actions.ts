export type ActionReturnType = Promise<{
  error: boolean;
  message: string;
  clientId?: string;
}>;
