function encryptString(string, key = ROOM.roomId ?? "70d65a86-4a83-11ef-ab87-effe312801cd") {
    return CryptoJS.AES.encrypt(string, key).toString();
}
function decryptString(encryptedString, key = ROOM.roomId ?? "70d65a86-4a83-11ef-ab87-effe312801cd") {
    const bytes = CryptoJS.AES.decrypt(encryptedString, key);
    return bytes.toString(CryptoJS.enc.Utf8);
}