export const INDEPENDENT_TOOL_CATALOG = [
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
    notes:
      "Pure data fetch. Output may later be summarized, cached, or sent via communication tools."
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
    notes:
      "Used to validate freshness of cached data. No side effects."
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
      articles: "array of { title, description, url, content }"
    },
    notes:
      "Independent fetch. Articles can be summarized or passed to dependent tools later."
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
    notes:
      "General factual lookup. No communication or memory writes."
  },

  {
    name: "getArch",
    use: "Get system architecture (cached if available)",
    args: {},
    returns: {
      architecture: "object"
    },
    notes:
      "Stable data. Safe to read from memory but does not write by itself."
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
    notes:
      "Pure computation / lookup. No side effects."
  }
];