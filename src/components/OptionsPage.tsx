import React, { useEffect, useState } from "react";
import { detectProvider, Provider } from "../shared.helpers";
import "./OptionsPage.css";

export interface OptionsPageProps {
  initialUrl?: string;
  initialApiKey?: string;
  onSave?: (url: string, apiKey: string) => Promise<void>;
  onLoad?: () => Promise<{ url: string; apiKey: string }>;
}

const PROVIDER_LABEL: Record<Provider, string> = {
  jira: "Jira",
  linear: "Linear",
};

export const OptionsPage: React.FC<OptionsPageProps> = ({
  initialUrl = "",
  initialApiKey = "",
  onSave,
  onLoad,
}) => {
  const [providerUrl, setProviderUrl] = useState(initialUrl);
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [detected, setDetected] = useState<Provider | null>(
    initialUrl ? detectProvider(initialUrl) : null
  );
  const [loading, setLoading] = useState(!!onLoad);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (onLoad) {
      onLoad()
        .then(({ url, apiKey: storedKey }) => {
          setProviderUrl(url);
          setApiKey(storedKey);
          setDetected(url ? detectProvider(url) : null);
        })
        .catch((error) => console.error("Failed to load settings:", error))
        .finally(() => setLoading(false));
    }
  }, [onLoad]);

  const validate = (): string | null => {
    if (!providerUrl.trim()) {
      return "Please enter your issue tracker URL";
    }

    let parsed: URL;
    try {
      parsed = new URL(providerUrl);
    } catch {
      return "Please enter a valid URL";
    }

    if (parsed.protocol !== "https:") {
      return "URL must use HTTPS";
    }

    const provider = detectProvider(providerUrl);
    if (!provider) {
      return "URL must be a Jira Cloud (*.atlassian.net) or Linear (linear.app) URL";
    }

    if (provider === "linear") {
      if (!apiKey.trim()) {
        return "Linear requires an API key";
      }
      if (!/^lin_api_/.test(apiKey.trim())) {
        return "Linear API keys start with 'lin_api_'";
      }
    }

    return null;
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProviderUrl(value);
    setDetected(value ? detectProvider(value) : null);
    setValidationError(null);
    setStatus(null);
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    setValidationError(null);
    setStatus(null);
  };

  const handleSave = async () => {
    const error = validate();
    if (error) {
      setValidationError(error);
      return;
    }

    setSaving(true);
    setStatus(null);

    try {
      const normalizedUrl = providerUrl.trim().replace(/\/+$/, "");
      const normalizedKey = apiKey.trim();
      if (onSave) {
        await onSave(normalizedUrl, normalizedKey);
      }
      setProviderUrl(normalizedUrl);
      setApiKey(normalizedKey);
      setStatus({
        type: "success",
        message: "Settings saved! Refresh GitHub pages to apply.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: "Failed to save settings. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="options-container">Loading...</div>;
  }

  const detectedLabel = detected
    ? `Detected: ${PROVIDER_LABEL[detected]}`
    : providerUrl
    ? "Detected: Unrecognized URL"
    : "";

  return (
    <div className="options-container">
      <h1 className="options-title">Issue Tracker &lt;&ndash;&gt; GitHub</h1>

      <div className="options-form-group">
        <label className="options-label" htmlFor="providerUrl">
          Issue tracker URL
        </label>
        <input
          type="text"
          id="providerUrl"
          className={`options-input ${
            validationError ? "options-input-error" : ""
          }`}
          value={providerUrl}
          onChange={handleUrlChange}
          placeholder="https://your-domain.atlassian.net or https://linear.app/your-workspace"
        />
        <p className="options-help-text">
          Jira Cloud (https://*.atlassian.net) or Linear (https://linear.app/&lt;workspace&gt;)
        </p>
        {detectedLabel && (
          <p className="options-help-text">{detectedLabel}</p>
        )}
      </div>

      {detected === "linear" && (
        <div className="options-form-group">
          <label className="options-label" htmlFor="providerApiKey">
            Linear API key
          </label>
          <input
            type="password"
            id="providerApiKey"
            className={`options-input ${
              validationError ? "options-input-error" : ""
            }`}
            value={apiKey}
            onChange={handleApiKeyChange}
            placeholder="lin_api_..."
          />
          <p className="options-help-text">
            Create at{" "}
            <a
              href="https://linear.app/settings/api"
              target="_blank"
              rel="noreferrer">
              linear.app/settings/api
            </a>
            . Stored locally, not synced across browsers.
          </p>
        </div>
      )}

      {validationError && (
        <p className="options-error-message">{validationError}</p>
      )}

      <div className="options-button-group">
        <button
          className="options-button-primary"
          onClick={handleSave}
          disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {status && (
        <div className={`options-status-message options-status-${status.type}`}>
          {status.message}
        </div>
      )}
    </div>
  );
};

export default OptionsPage;
