interface AssetFetcher {
  fetch(input: Request | string | URL, init?: RequestInit): Promise<Response>;
}

interface Env {
  ASSETS: AssetFetcher;
}

export default {
  fetch(request: Request, env: Env) {
    return env.ASSETS.fetch(request);
  },
};
