import { useEffect, useState } from "react";
import { getJiraUrl } from "../settings";

export const useJiraUrl = () => {
  const [jiraUrl, setJiraUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJiraUrl()
      .then(setJiraUrl)
      .finally(() => setLoading(false));
  }, []);

  return { jiraUrl, loading };
};
