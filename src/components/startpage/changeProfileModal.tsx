import React from "react";
import CenteredModal from "../ui/modal/centeredModal";
import Button from "../ui/button";
import ScrollingTable from "../ui/table/ScrollingTable";
import HumanPlayer from "../../model/player/HumanPlayer";

type ChangeProfileModalProps = {
  show: boolean;
  onHide(): void;
  onOpenNewProfileModal(): void;
  profileList: HumanPlayer[];
  onChangeActiveProfile(newActiveProfile: HumanPlayer): void;
}

function ChangeProfileModal(props: ChangeProfileModalProps): JSX.Element {
  const {
    show, onHide, onOpenNewProfileModal, profileList, onChangeActiveProfile,
  } = props;

  const tableData = {
    header: {
      cells: [
        { value: "#", style: { width: "5%" } },
        { value: "Name", style: { width: "38%" } },
        { value: "Konto", style: { textAlign: "center", width: "30%" } },
        { value: "Anzahl Spiele", style: { textAlign: "center", width: "27%" } },
      ],
    },
    body: profileList.map((profile, idx) => ({
      style: { display: "flex", cursor: "pointer" },
      onClick: () => {
        onChangeActiveProfile(profile);
        onHide();
      },
      cells: [
        { value: idx + 1, style: { width: "5%" } },
        { value: profile.name, style: { width: "38%" } },
        {
          value: `${profile.money.toFixed(2)} €`,
          style: { textAlign: "center", width: "30%" },
        },
        { value: profile.numberPlayedGames, style: { textAlign: "center", width: "27%" } },
      ],
    })),
  };

  return (
    <CenteredModal
      show={show}
      onHide={onHide}
      size="big"
      footer={(
        <Button
          styleType="primary"
          onClick={onOpenNewProfileModal}
          size="small"
        >
          Neues Profil
        </Button>
      )}
    >
      <ScrollingTable
        data={tableData}
      />

    </CenteredModal>
  );
}

export default ChangeProfileModal;
