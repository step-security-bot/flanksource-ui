import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import Incidents from "../../Incidents/Sidebars/incidents";
import { PlaybookRunsSidePanel } from "../../Playbooks/Runs/PlaybookRunsSidePanel";
import SlidingSideBar from "../../SlidingSideBar";
import ConfigActionBar from "./ConfigActionBar";
import ConfigChanges from "./ConfigChanges";
import { ConfigDetails } from "./ConfigDetails";
import ConfigInsights from "./ConfigInsights";
import ConfigsPanel from "./ConfigsPanel";

type SidePanels =
  | "ConfigDetails"
  | "Configs"
  | "Incidents"
  | "Costs"
  | "ConfigChanges"
  | "Insights"
  | "PlaybookRuns";

export default function ConfigSidebar() {
  const [openedPanel, setOpenedPanel] = useState<SidePanels | undefined>(
    "ConfigDetails"
  );

  const { id } = useParams();

  const panelCollapsedStatusChange = useCallback(
    (status: boolean, panel: SidePanels) => {
      if (status) {
        setOpenedPanel(panel);
      } else {
        setOpenedPanel(undefined);
      }
    },
    []
  );

  if (!id) {
    return null;
  }

  return (
    <SlidingSideBar hideToggle>
      <ConfigActionBar configId={id} />
      <ConfigDetails
        configId={id}
        isCollapsed={openedPanel !== "ConfigDetails"}
        onCollapsedStateChange={(status) =>
          panelCollapsedStatusChange(status, "ConfigDetails")
        }
      />
      <Incidents
        configId={id}
        isCollapsed={openedPanel !== "Incidents"}
        onCollapsedStateChange={(status) =>
          panelCollapsedStatusChange(status, "Incidents")
        }
      />
      <ConfigInsights
        configID={id}
        isCollapsed={openedPanel !== "Insights"}
        onCollapsedStateChange={(status) =>
          panelCollapsedStatusChange(status, "Insights")
        }
      />
      <PlaybookRunsSidePanel
        panelType="config"
        configId={id}
        isCollapsed={openedPanel !== "PlaybookRuns"}
        onCollapsedStateChange={(status) =>
          panelCollapsedStatusChange(status, "PlaybookRuns")
        }
      />
      <ConfigChanges
        configID={id}
        isCollapsed={openedPanel !== "ConfigChanges"}
        onCollapsedStateChange={(status) =>
          panelCollapsedStatusChange(status, "ConfigChanges")
        }
      />
      <ConfigsPanel
        configId={id}
        isCollapsed={openedPanel !== "Configs"}
        onCollapsedStateChange={(status) =>
          panelCollapsedStatusChange(status, "Configs")
        }
      />
    </SlidingSideBar>
  );
}
