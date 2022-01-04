import React from "react";
import NewProfileModal from "../../components/startpage/newProfileModal";
import ButtonArea from "../../components/startpage/buttonArea";
import ChangeProfileModal from "../../components/startpage/changeProfileModal";
import { useProfile } from "../../App";
import HumanPlayer from "../../model/player/HumanPlayer";

function Startpage(): JSX.Element {
  const [profileList, setProfileList] = useProfile();
  const someProfileExists = !!profileList.length;

  const [isChangeProfileModalShown, setIsChangeProfileModalShown] = React.useState(false);
  const [isNewProfileModalShown, setIsNewProfileModalShown] = React.useState(!someProfileExists);

  const setAllProfilesInactive = (): void => {
    profileList.forEach((profile) => profile.setActive(false));
  };

  const onProfileCreate = (newProfile: HumanPlayer): void => {
    setAllProfilesInactive();
    const newProfileList = [newProfile, ...profileList];
    setProfileList(newProfileList);
  };

  const getActiveProfile = (): HumanPlayer | undefined => profileList.find(
    (profile) => profile.isActive(),
  );

  const onResetMoney = (): void => {
    const activeProfile = getActiveProfile();
    activeProfile?.setMoney(HumanPlayer.START_MONEY);
    setProfileList([...profileList]);
  };

  const onChangeActiveProfile = (newActiveProfile: HumanPlayer): void => {
    setAllProfilesInactive();
    newActiveProfile.setActive(true);
    setProfileList([...profileList]);
  };

  return (
    <main>
      <ButtonArea
        setIsProfileModalShown={setIsChangeProfileModalShown}
        onResetMoney={onResetMoney}
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
    </main>
  );
}

export default Startpage;
