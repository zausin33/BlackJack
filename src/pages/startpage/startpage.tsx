import React from "react";
import NewProfileModal from "../../components/startpage/newProfileModal";
import ButtonArea from "../../components/startpage/buttonArea";
import ChangeProfileModal from "../../components/startpage/changeProfileModal";
import { useProfile } from "../../app";
import HumanPlayer from "../../model/player/humanPlayer";
import ConfirmResetModal from "../../components/startpage/confirmResetModal";

function Startpage(): JSX.Element {
  const [profileList, setProfileList] = useProfile();
  const someProfileExists = !!profileList.length;

  const [isChangeProfileModalShown, setIsChangeProfileModalShown] = React.useState(false);
  const [isNewProfileModalShown, setIsNewProfileModalShown] = React.useState(!someProfileExists);
  const [isConfirmResetModalShown, setIsConfirmResetModalShown] = React.useState(false);

  const setAllProfilesInactive = (): void => {
    profileList.forEach((profile) => {
      profile.isActive = false;
    });
  };

  const onProfileCreate = (newProfile: HumanPlayer): void => {
    setAllProfilesInactive();
    const newProfileList = [newProfile, ...profileList];
    setProfileList(newProfileList);
  };

  const getActiveProfile = (): HumanPlayer | undefined => profileList.find(
    (profile) => profile.isActive,
  );

  const onResetAccount = (): void => {
    setIsConfirmResetModalShown(false);
    const activeProfile = getActiveProfile();
    if (!activeProfile) return;
    activeProfile.money = HumanPlayer.START_MONEY;
    activeProfile.resetNumberPlayedGames();
    setProfileList([...profileList]);
  };

  const onChangeActiveProfile = (newActiveProfile: HumanPlayer): void => {
    setAllProfilesInactive();
    newActiveProfile.isActive = true;
    setProfileList([...profileList]);
  };

  return (
    <main style={{ height: "auto" }}>
      <ButtonArea
        setIsProfileModalShown={setIsChangeProfileModalShown}
        onResetAccount={() => setIsConfirmResetModalShown(true)}
        getActiveProfile={getActiveProfile}
      />
      <NewProfileModal
        show={isNewProfileModalShown}
        onCancel={() => {
          setIsNewProfileModalShown(false);
          setIsChangeProfileModalShown(true);
        }}
        onHide={() => setIsNewProfileModalShown(false)}
        someProfileExists={someProfileExists}
        onProfileCreate={onProfileCreate}
      />
      <ChangeProfileModal
        profileList={profileList}
        show={isChangeProfileModalShown}
        onChangeActiveProfile={onChangeActiveProfile}
        onHide={() => setIsChangeProfileModalShown(false)}
        onOpenNewProfileModal={() => {
          setIsChangeProfileModalShown(false);
          setIsNewProfileModalShown(true);
        }}
      />
      <ConfirmResetModal
        show={isConfirmResetModalShown}
        onCancel={() => setIsConfirmResetModalShown(false)}
        onConfirm={onResetAccount}
      />
    </main>
  );
}

export default Startpage;
