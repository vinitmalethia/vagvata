export const ADMIN_UID = '3KIdtkNrZSTLd5iqRGxLLG7UihA2';

export const isAdminUser = (user) => Boolean(user && user.uid === ADMIN_UID);
