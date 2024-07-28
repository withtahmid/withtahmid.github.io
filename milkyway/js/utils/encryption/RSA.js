const RSA = {
  publicKey: null, 
  privateKey: null,
  generateKeys: function () {
    const { pki, random } = forge;
    const keypair = pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });
    const publicKey = pki.publicKeyToPem(keypair.publicKey);
    const privateKey = pki.privateKeyToPem(keypair.privateKey);
    SETTINGS.RSA = { publicKey, privateKey, expiresAt: new Date(Date.now() + (HYPERPARAMETER.rsaExpiresAt))};
  },
  getPublicKey: function(){
    if(SETTINGS.RSA === null || TIME.now() >= SETTINGS.RSA.expiresAt){
      this.generateKeys();
    }
    return SETTINGS.RSA.publicKey;
  },
  encrypt: function (publicKeyOfOther, plaintext) {
    const { pki } = forge;
    const publicKey = pki.publicKeyFromPem(publicKeyOfOther);
    const encrypted = publicKey.encrypt(plaintext);
    return forge.util.encode64(encrypted);
  },
  decrypt: function(encryptedText) {
    if(SETTINGS.RSA === null){
      throw new Error("[RSA ERROR] Trying to decrypt but key is not generated yet");
    }
    const { pki, util } = forge;
    const privateKey = pki.privateKeyFromPem(SETTINGS.RSA.privateKey);
    const encryptedBytes = util.decode64(encryptedText);
    const decrypted = privateKey.decrypt(encryptedBytes);
    return decrypted;
  }
}