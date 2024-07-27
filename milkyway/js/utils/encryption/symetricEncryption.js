function encryptString(string) {
    const symetricKey = ROOM.roomId ? `${ROOM.roomId}` :"70d65a86-4a83-11ef-ab87-effe312801cd";
    return CryptoJS.AES.encrypt(string, symetricKey).toString();
}
function decryptString(encryptedString) {
    const symetricKey = ROOM.roomId ? `${ROOM.roomId}` :"70d65a86-4a83-11ef-ab87-effe312801cd";
    const bytes = CryptoJS.AES.decrypt(encryptedString, symetricKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}