const uuid = "2c086564-4c79-11ef-a635-6bda8226b8a6";
function encryptString(string) {
    const symetricKey = ROOM.roomId ? `${ROOM.roomId}-${uuid}` : uuid;
    return CryptoJS.AES.encrypt(string, symetricKey).toString();
}
function decryptString(encryptedString) {
    const symetricKey = ROOM.roomId ? `${ROOM.roomId}-${uuid}` : uuid;
    const bytes = CryptoJS.AES.decrypt(encryptedString, symetricKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}