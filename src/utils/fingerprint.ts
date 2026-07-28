import FingerprintJS from '@fingerprintjs/fingerprintjs';

let fpPromise: ReturnType<typeof FingerprintJS.load> | null = null;

const getFP = () => {
  if (!fpPromise) fpPromise = FingerprintJS.load();
  return fpPromise;
};

export const getFingerprint = async () => {
  const fp = await getFP();
  const result = await fp.get();
  return {
    visitorId: result.visitorId,
    components: result.components as Record<string, unknown>,
  };
};
