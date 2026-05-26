import { useEffect, useState } from "react";
import { getProviderUrl } from "../settings";

export const useProviderUrl = () => {
  const [providerUrl, setProviderUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProviderUrl()
      .then(setProviderUrl)
      .finally(() => setLoading(false));
  }, []);

  return { providerUrl, loading };
};
