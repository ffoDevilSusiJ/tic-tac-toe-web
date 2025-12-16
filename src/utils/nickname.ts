const NICKNAME_STORAGE_KEY = 'tictactoe_nickname';

export const getNickname = (): string | null => {
  return localStorage.getItem(NICKNAME_STORAGE_KEY);
};

export const setNickname = (nickname: string): void => {
  localStorage.setItem(NICKNAME_STORAGE_KEY, nickname);
};

export const getOrCreateNickname = (): string | null => {
  return getNickname();
};