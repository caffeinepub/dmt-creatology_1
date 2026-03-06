// Auto-generated config stub for DMT Creatology static website
import { type backendInterface } from "./backend";

interface ActorOptions {
  agentOptions?: {
    identity?: unknown;
  };
}

export interface AppConfig {
  canisterId: string;
  network: string;
  ii_derivation_origin?: string;
}

export function loadConfig(): AppConfig {
  return {
    canisterId: "",
    network: "local",
    ii_derivation_origin: undefined,
  };
}

// Stub - not used in static website
export async function createActorWithConfig(
  _options?: ActorOptions
): Promise<backendInterface> {
  return {} as backendInterface;
}
