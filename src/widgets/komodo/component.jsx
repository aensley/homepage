import { useTranslation } from "next-i18next"; 

import Container from "components/services/widget/container"; 
import Block from "components/services/widget/block"; 
import useWidgetAPI from "utils/proxy/use-widget-api"; 
import { useEffect, useState } from "react";

const REFRESH_INTERVAL = 30000;
const MAX_ALLOWED_FIELDS = 4;

export default function Component({ service }) {
  const { t } = useTranslation();
  const { widget } = service;
  const [updatesCount, setUpdatesCount] = useState(0);

  if (!widget.fields) {
    widget.fields = ["serversHealthy", "stacksRunning", "containersRunning", "containersStopped"];
  }

  if (widget.fields.length > MAX_ALLOWED_FIELDS) {
    widget.fields = widget.fields.slice(0, MAX_ALLOWED_FIELDS);
  }

  const { data: serverData, error: serverError } = useWidgetAPI(widget, "servers", { refreshInterval: REFRESH_INTERVAL } );
  const { data: stackData, error: stackError } = useWidgetAPI(widget, "stacks", { refreshInterval: REFRESH_INTERVAL });
  const { data: containerData, error: containerError } = useWidgetAPI(widget, "containers", { refreshInterval: REFRESH_INTERVAL });
  const { data: stackDetails, error: stackDetailsError } = useWidgetAPI(widget, "stackDetails", { refreshInterval: REFRESH_INTERVAL });

  const serverBlocks = ["serversHealthy", "serversUnhealthy", "serversDisabled", "serversTotal"];
  const stackBlocks = ["stacksRunning", "stacksStopped", "stacksDown", "stacksUnhealthy", "stacksTotal"];
  const containerBlocks = ["containersRunning", "containersStopped", "containersUnhealthy", "containersTotal"];
  const containerUpdatesBlock = ["containerUpdates"];

  useEffect(() => {
    console.log(stackDetails)
    if(stackDetails !== undefined) {
      setUpdatesCount(stackDetails
        .flatMap(stack => stack.info.services)
        .filter(service => service.update_available === true)
        .length);
    }
  }, [stackDetails]);

  if (serverError && widget.fields.some(item => serverBlocks.includes(item))) {
    return <Container service={service} error={serverError} />;
  }

  if (stackError && widget.fields.some(item => stackBlocks.includes(item))) {
    return <Container service={service} error={stackError} />;
  }

  if (containerError && widget.fields.some(item => containerBlocks.includes(item))) {
    return <Container service={service} error={containerError} />;
  }

  if (stackDetailsError && widget.fields.some(item => containerUpdatesBlock.includes(item))) {
    return <Container service={service} error={stackDetailsError} />;
  }

  if (!serverData || !stackData || !containerData || !stackDetails) {
    return (
      <Container service={service}>
        <Block label="komodo.serversHealthy" />
        <Block label="komodo.stacksRunning" />
        <Block label="komodo.containersRunning" />
        <Block label="komodo.containersStopped" />
      </Container>
    );
  }

  return (
    <Container service={service}>
      <Block label="komodo.serversHealthy" value={`${serverData.healthy} / ${serverData.total}`} />
      <Block label="komodo.serversUnhealthy" value={`${serverData.unhealthy} / ${serverData.total}`} />
      <Block label="komodo.serversDisabled" value={`${serverData.disabled} / ${serverData.total}`} />
      <Block label="komodo.serversTotal" value={t("common.number", { value: serverData.total })} />
      <Block label="komodo.stacksRunning" value={`${stackData.running} / ${stackData.total}`} />
      <Block label="komodo.stacksStopped" value={`${stackData.stopped} / ${stackData.total}`} />
      <Block label="komodo.stacksDown" value={`${stackData.down} / ${stackData.total}`} />
      <Block label="komodo.stacksUnhealthy" value={`${stackData.unhealthy} / ${stackData.total}`} />
      <Block label="komodo.stacksTotal" value={t("common.number", { value: stackData.total })} />
      <Block label="komodo.containersRunning" value={`${containerData.running} / ${containerData.total}`} />
      <Block label="komodo.containersStopped" value={`${containerData.stopped} / ${containerData.total}`} />
      <Block label="komodo.containersUnhealthy" value={`${containerData.unhealthy} / ${containerData.total}`} />
      <Block label="komodo.containersTotal" value={t("common.number", { value: containerData.total })} />
      <Block label="komodo.containerUpdates" value={t("common.number", { value: updatesCount })} />
    </Container>
  );
}
