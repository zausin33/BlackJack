import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameBoard from "../../components/gamepage/gameBoard";
import PlayerSymbol from "../../components/gamepage/playerSymbol";
import { useProfile } from "../../App";

function GamePage(): JSX.Element {
  const [profileList, setProfileList] = useProfile();
  const navigate = useNavigate();
  const activeProfile = profileList.find((profile) => profile.isActive());
  useEffect(() => {
    if (!activeProfile) {
      navigate("/");
    }
  });

  return (
    <main>
      <PlayerSymbol name="Dealer" />
      {activeProfile && (
      <GameBoard player={activeProfile} profileList={profileList} setProfileList={setProfileList} />
      )}
      <PlayerSymbol name="Du" />
    </main>

  );
}

export default GamePage;
