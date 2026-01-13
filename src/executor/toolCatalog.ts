export const TOOL_CATALOG = [
  {
    name: "getWeatherToday",
    use: "Get current weather for a city",
    args: {
      location: "string (city, country code optional)"
    },
    returns: {
      city: "string",
      temperature: "string",
      condition: "string",
      description: "string",
      humidity: "string",
      wind: "string"
    },
    notes: "Weather data can be sent to email, Slack, or Discord or cached in memory"
  },

  {
    name: "getCurrentDateTime",
    use: "Get current date & time for a timezone",
    args: {
      timezone: "string (optional, defaults to Asia/Kolkata)"
    },
    returns: {
      iso: "string",
      date: "string",
      timezone: "string",
      timestamp: "number"
    },
    notes: "Used to validate freshness of cached data"
  },

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
    notes: "Email body often depends on output of other tools"
  },

  {
    name: "getNews",
    use: "Fetch recent news on a topic",
    args: {
      topic: "string",
      range: "today | yesterday | last_3_days | last_7_days (optional)"
    },
    returns: {
      topic: "string",
      articles: "array of { title, description, url }"
    },
    notes: "Articles can be summarized, emailed, or posted to Slack/Discord"
  },

  {
    name: "webSearch",
    use: "Search the web for factual info",
    args: {
      query: "string"
    },
    returns: {
      answer: "string"
    },
    notes: "Used to answer factual questions or enrich responses"
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
    notes: "Message content usually composed from previous tool outputs"
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
    notes: "Message content usually composed from previous tool outputs"
  },

  {
    name: "get_ip_location",
    use: "Get location from IP",
    args: {
      ip: "string"
    },
    returns: {
      city: "string",
      country: "string",
      timezone: "string"
    },
    notes: "Timezone output may be passed to getCurrentDateTime"
  },

  {
    name: "getArch",
    use: "Get system architecture (cached if available)",
    args: {},
    returns: {
      architecture: "object"
    },
    notes: "Stable data — safe to reuse from memory"
  },

  {
    name: "getAvailablePorts",
    use: "Find free ports for a project",
    args: {
      project_kind: "frontend | backend"
    },
    returns: {
      project_kind: "string",
      reserved_range: "string",
      empty_ports: "number[]"
    },
    notes: "Ports may be reused unless explicitly refreshed"
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
      "Before calling expensive tools, check memory first. " +
      "For weather/news, validate date + timestamp using getCurrentDateTime."
  }
];
