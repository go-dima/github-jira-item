import React, { useEffect, useState } from "react";
import "./OptionsPage.css";

export interface OptionsPageProps {
  initialUrl?: string;
  onSave?: (url: string) => Promise<void>;
  onLoad?: () => Promise<string>;
}

export const OptionsPage: React.FC<OptionsPageProps> = ({
  initialUrl = "",
  onSave,
  onLoad,
}) => {
  const [jiraUrl, setJiraUrl] = useState(initialUrl);
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
        .then(setJiraUrl)
        .catch((error) => console.error("Failed to load settings:", error))
        .finally(() => setLoading(false));
    }
  }, [onLoad]);

  const validateUrl = (url: string): string | null => {
    if (!url.trim()) {
      return "Please enter your Jira URL";
    }

    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "https:") {
        return "URL must use HTTPS";
      }
      if (!parsed.hostname.includes("atlassian.net")) {
        return "URL must be an Atlassian Cloud URL (*.atlassian.net)";
      }
    } catch {
      return "Please enter a valid URL";
    }

    return null;
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setJiraUrl(value);
    setValidationError(null);
    setStatus(null);
  };

  const handleSave = async () => {
    const error = validateUrl(jiraUrl);
    if (error) {
      setValidationError(error);
      return;
    }

    setSaving(true);
    setStatus(null);

    try {
      const normalizedUrl = jiraUrl.trim().replace(/\/+$/, "");
      if (onSave) {
        await onSave(normalizedUrl);
      }
      setJiraUrl(normalizedUrl);
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

  return (
    <div className="options-container">
      <h1 className="options-title">GitHub-Jira Extension Settings</h1>

      <div className="options-form-group">
        <label className="options-label" htmlFor="jiraUrl">
          Jira URL
        </label>
        <input
          type="text"
          id="jiraUrl"
          className={`options-input ${
            validationError ? "options-input-error" : ""
          }`}
          value={jiraUrl}
          onChange={handleUrlChange}
          placeholder="https://your-domain.atlassian.net"
        />
        <p className="options-help-text">
          Your Atlassian Jira Cloud instance URL
        </p>
        {validationError && (
          <p className="options-error-message">{validationError}</p>
        )}
      </div>

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
