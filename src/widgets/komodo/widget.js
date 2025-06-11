import komodoProxyHandler from "./proxy";

const widget = {
  api: "{url}/{endpoint}",
  proxyHandler: komodoProxyHandler ,

  mappings:  {
    servers:  {
      endpoint: "read",
      body: `{ "type": "GetServersSummary", "params": { }}`,
    },
    stacks:  {
      endpoint: "read",
      body: '{ "type": "GetStacksSummary", "params": {}}',
    },
    stackDetails:  {
      endpoint: "read",
      body: '{ "type": "ListStacks", "params": {}}',
    },
    containers:  {
      endpoint: "read",
      body: '{ "type": "GetDockerContainersSummary", "params": {}}',
    },
  },
};

export default widget;
