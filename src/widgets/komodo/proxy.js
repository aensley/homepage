import getServiceWidget from "utils/config/service-helpers";
import createLogger from "utils/logger";
import { formatApiCall } from "utils/proxy/api-helpers";
import { httpProxy } from "utils/proxy/http";
import widgets from "widgets/widgets";

const logger = createLogger("komodoProxyHandler");

export default async function komodoProxyHandler(req, res, map) {
  const { group, service, endpoint, index } = req.query;

  if (group && service) {
    const widget = await getServiceWidget(group, service, index);

    if (!widgets?.[widget.type]?.api) {
      return res.status(403).json({ error: "Service does not support API calls" });
    }

    if (widget) {
      const url = new URL(formatApiCall(widgets[widget.type].api, { endpoint, ...widget }));

      const [status, contentType , data] = await httpProxy(url.href, {
        method: "POST",
        body: req.body,
        headers: {
          "content-type": "application/json",
          "X-Api-Key": widget.key,
          "X-Api-Secret": widget.secret,
        },
      });

      if (status === 401) {
        logger.error("Invalid or missing secret or key for service '%s' in group '%s'", service, group);
        return res.status(status).send({ error: { message: "401: unauthorized, secret or key is incorrect." } });
      }

      if (status !== 200) {
        logger.error(
          "Error getting data from Komodo for service '%s' in group '%s': %d.  Data: %s",
          service,
          group,
          status,
          data,
        );
        return res.status(status).send({ error: { message: "Error getting data. body: %s, data: %s", body, data } });
      }

      if (map) {
        data = map(data);
      }

      if (contentType) res.setHeader("Content-Type", contentType);
      return res.send(data);
    }
  }

  return res.status(400).json({ error: "Invalid proxy service type" });
}
