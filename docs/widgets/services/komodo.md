---
title: Komodo
description: Komodo Widget Configuration
---

This widget shows data from your [Komodo](https://komo.do/) instance.

API key and secret can be generated at `Settings -> Profile -> Api Keys`.

Allowed fields (max 4): `["serversHealthy", "serversUnhealthy", "serversDisabled", "serversTotal", "stacksRunning", "stacksStopped", "stacksDown", "stacksUnhealthy", "stacksTotal", "containersRunning", "containersStopped", "containersUnhealthy", "containersTotal", "containerUpdates"]`.
Default fields: `["serversHealthy", "stacksRunning", "containersRunning", "containersStopped"]`

```yaml
widget:
  type: komodo
  url: http://komodo.hostname.or.ip:port
  key: K-xxxxxx...
  secret: S-xxxxxx...
```
