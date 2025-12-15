export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const getOrCreatePlayerUUID = (): string => {
  const stored = localStorage.getItem('playerUuid');
  if (stored) return stored;
  
  const newUuid = generateUUID();
  localStorage.setItem('playerUuid', newUuid);
  return newUuid;
};