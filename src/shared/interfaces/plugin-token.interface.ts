interface PluginToken {
  user: string;

  label: string;

  /** a secret for the plugin to poll with. when not set, token is active */
  pollingSecret: string;

  /** the actual token used for authentication */
  token: string;

  lastUsed: Date;

  createdAt: string;
  updatedAt: string;
  _id: string;
}

export default PluginToken;
