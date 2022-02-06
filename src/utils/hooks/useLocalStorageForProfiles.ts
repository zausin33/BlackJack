import { useEffect, useState } from "react";
import HumanPlayer from "../../model/player/humanPlayer";

const useLocalStorageForProfiles = (key: string, initialValue: HumanPlayer[] | null = null): [HumanPlayer[], (state: HumanPlayer[]) => void] => {
  const valueString = localStorage.getItem(key);
  const value = valueString
    ? JSON.parse(valueString).map((player: Partial<HumanPlayer>) => HumanPlayer.fromJson(player))
    : initialValue;
  const [state, setState] = useState(value);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};

export default useLocalStorageForProfiles;
