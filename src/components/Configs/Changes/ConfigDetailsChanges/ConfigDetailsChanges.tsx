import { useEffect, useMemo, useState } from "react";
import ReactTooltip from "react-tooltip";
import { useGetConfigChangesById } from "../../../../api/query-hooks/useGetConfigChangesByConfigChangeIdQuery";
import { ConfigChange } from "../../../../api/types/configs";
import { EvidenceType } from "../../../../api/types/evidence";
import { User } from "../../../../api/types/users";
import { ViewType } from "../../../../types";
import { Age } from "../../../../ui/Age";
import { Stat } from "../../../../ui/stats/Stat";
import AttachAsEvidenceButton from "../../../AttachEvidenceDialog/AttachAsEvidenceDialogButton";
import { Avatar } from "../../../Avatar";
import { DiffRenderer } from "../../../DiffRenderer/DiffRenderer";
import { Icon } from "../../../Icon";
import { ChangeIcon } from "../../../Icon/ChangeIcon";
import { ConfigIcon } from "../../../Icon/ConfigIcon";
import { JSONViewer } from "../../../JSONViewer";
import { Loading } from "../../../Loading";
import { Modal } from "../../../Modal";
import ModalTitleListItems from "../../../Modal/ModalTitleListItems";
import ConfigLink from "../../ConfigLink/ConfigLink";
import ConfigChangeDetailSection from "./ConfigChangeDetailsSection";

type ConfigDetailsChangesProps = {
  id: string;
  configId: string;
  viewType?: ViewType;
  data?: ConfigChange;
  showConfigLogo?: boolean;
};

export function ConfigDetailsChanges({
  configId,
  id,
  viewType = ViewType.summary,
  showConfigLogo,
  data
}: ConfigDetailsChangesProps) {
  const [open, setOpen] = useState(false);

  const { data: change, isLoading } = useGetConfigChangesById(id, configId!, {
    enabled: open
  });

  const config = useMemo(() => change?.config, [change]);

  // if the change is not loaded, show the data from the props, otherwise show
  // the data from the API which is more detailed
  const changeDetails = useMemo(() => change ?? data, [change, data]);

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  let icon = changeDetails?.source;

  if (icon?.startsWith("AWS::CloudTrail")) {
    icon = "AWS::CloudTrail";
  } else if (icon?.startsWith("kubernetes/")) {
    icon = "Kubernetes";
  }

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <ConfigDetailChangeModal
        // do not show modal if the config is not loaded
        isLoading={isLoading}
        open={open}
        setOpen={setOpen}
        changeDetails={changeDetails}
      />

      {viewType === ViewType.detailed && (
        <div className="flex flex-col flex-1 px-4 py-3 overflow-y-auto">
          <div className="flex flex-row w-full gap-12">
            <Stat
              title="Date"
              sizeStyle="sm"
              value={<Age from={changeDetails?.created_at!} suffix={true} />}
            />

            <Stat
              title="Source"
              sizeStyle="sm"
              value={
                <>
                  <Icon
                    name={changeDetails?.source}
                    secondary={icon}
                    className="h-5 w-auto pr-1"
                  />
                  {changeDetails?.source}
                </>
              }
            />

            <Stat
              title="Created By"
              sizeStyle="sm"
              value={
                // eslint-disable-next-line react/jsx-no-useless-fragment
                <>
                  {changeDetails?.created_by ? (
                    <Avatar
                      user={
                        (changeDetails.created_by! as unknown as User) ??
                        changeDetails.external_created_by
                      }
                    />
                  ) : (
                    <span>{changeDetails?.external_created_by}</span>
                  )}
                </>
              }
            />
          </div>
          {changeDetails?.details && (
            <ConfigChangeDetailSection label="Details">
              <JSONViewer
                code={JSON.stringify(changeDetails?.details, null, 2)}
                format="json"
                convertToYaml
              />
            </ConfigChangeDetailSection>
          )}
          {changeDetails?.patches && !changeDetails?.diff && (
            <ConfigChangeDetailSection label="Change">
              <JSONViewer
                code={JSON.stringify(changeDetails?.patches, null, 2)}
                format="json"
                convertToYaml
              />
            </ConfigChangeDetailSection>
          )}
          {changeDetails?.diff && (
            <ConfigChangeDetailSection label="Change">
              <DiffRenderer diffText={changeDetails!.diff!} />
            </ConfigChangeDetailSection>
          )}
        </div>
      )}
      {viewType === ViewType.summary && (
        <div
          className="overflow-hidden truncate text-sm"
          onClick={(e) => {
            setOpen(true);
          }}
        >
          {showConfigLogo && (
            <>
              <ConfigIcon config={config} />
              <span>{config?.name}</span>
              &nbsp;/&nbsp;
            </>
          )}

          <ChangeIcon change={changeDetails} className="w-5 h-auto pr-1" />
          {changeDetails?.change_type}
        </div>
      )}
    </div>
  );
}

type ConfigDetailChangeModalProps = {
  open: boolean;
  isLoading: boolean;
  setOpen: (val: boolean) => void;
  changeDetails?: ConfigChange;
};

export function ConfigDetailChangeModal({
  open,
  setOpen,
  isLoading,
  changeDetails
}: ConfigDetailChangeModalProps) {
  const config = useMemo(() => changeDetails?.config, [changeDetails]);
  return (
    <Modal
      title={
        config && (
          <ModalTitleListItems
            items={[
              <div
                key={"config-details"}
                className="flex flex-row gap-1 flex-shrink items-center"
              >
                <div className="block w-6 h-auto">
                  <ChangeIcon change={changeDetails} />
                </div>
                <span> {changeDetails?.change_type}</span>
              </div>,
              <ConfigLink
                key={"config-link"}
                className="link text-xl font-semibold whitespace-nowrap overflow-hidden overflow-ellipsis"
                config={config}
              />
            ]}
          />
        )
      }
      open={open}
      onClose={(e) => {
        // this is added to fix modal not being closed issue when we open a modal on top of another modal
        e?.stopPropagation();
        setOpen(false);
      }}
      size="full"
      bodyClass="flex h-full w-full flex-col flex-1 overflow-y-auto"
      containerClassName="min-h-[15rem] h-auto max-h-full overflow-y-auto"
    >
      <div className="flex flex-col flex-1 overflow-y-auto">
        {(isLoading || !changeDetails) && (
          <div className="flex flex-col w-full h-full my-20 p-4 gap-2">
            <Loading type="modal" />
          </div>
        )}

        {!isLoading && changeDetails && changeDetails?.config_id && (
          <ConfigDetailsChanges
            configId={changeDetails.config_id}
            id={changeDetails.id}
            viewType={ViewType.detailed}
            data={changeDetails}
          />
        )}
      </div>
      <div className="flex items-center justify-end py-4 px-5 rounded-lg bg-gray-100">
        <AttachAsEvidenceButton
          config_change_id={changeDetails?.id}
          config_id={changeDetails?.config_id}
          evidence={{}}
          type={EvidenceType.ConfigChange}
        />
      </div>
    </Modal>
  );
}
