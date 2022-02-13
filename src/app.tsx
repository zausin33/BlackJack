import { Outlet, useOutletContext } from "react-router-dom";
import React from "react";
import Header from "./components/layout/header";
import HumanPlayer from "./model/player/humanPlayer";
import useLocalStorageForProfiles from "./utils/hooks/useLocalStorageForProfiles";

export default function App(): JSX.Element {
  const [profileList, setProfileList] = useLocalStorageForProfiles("profileList", []);
  const activeProfile = profileList.find((profile) => profile.isActive);
  const updateActiveProfile = (): void => {
    setProfileList([...profileList]);
  };

  return (
    <div className="App">
      <Header activeProfile={activeProfile} updateActiveProfile={updateActiveProfile} />
      <Outlet context={[profileList, setProfileList]} />
    </div>
  );
}

type UseProfile = [HumanPlayer[], (profileList: HumanPlayer[]) => void];

export function useProfile(): UseProfile {
  return useOutletContext<UseProfile>();
}
