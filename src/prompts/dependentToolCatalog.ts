export const DEPENDENT_TOOL_CATALOG = [
  {
    name: "sendEmail",
    use: "Send an email",
    args: {
      toMail: "string",
      mailSubject: "string",
      htmlContent: "string"
    },
    returns: {
      success: "boolean"
    },
    notes:
      "Requires drafted content. Must never be called without explicit user intent."
  },

  {
    name: "sendSlackMessage",
    use: "Post a message to Slack",
    args: {
      message: "string"
    },
    returns: {
      success: "boolean"
    },
    notes:
      "Message must be drafted by reasoning engine. Explicit user intent required."
  },

  {
    name: "sendDiscordMessage",
    use: "Post a message to Discord",
    args: {
      message: "string"
    },
    returns: {
      success: "boolean"
    },
    notes:
      "Message must be drafted verbatim. Never assume intent."
  },

  {
    name: "persistentMemory",
    use: "Read or write persistent memory",
    args: {
      action: "read | write",
      key: "string",
      value: "any (optional)"
    },
    returns: {
      memory: "any"
    },
    notes:
      "Reads allowed anytime. Writes ONLY if user explicitly says 'remember', 'save', etc."
  }
];
