import { useRecoilValue } from "recoil";
import { messageAtom } from "../atoms/message";

export const useMessage = () => {
  const value = useRecoilValue(messageAtom);
  return value;
};