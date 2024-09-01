import { atom } from 'recoil';

export const walletAddState = atom<boolean>({
  key: 'walletAddState',
  default: false,
});
