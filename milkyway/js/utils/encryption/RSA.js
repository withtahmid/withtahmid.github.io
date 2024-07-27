const RSA = {
  publicKey: null, 
  privateKey: null,
  generateKeys: function () {
    if(SETTINGS.rsaPrivateKey !== null && SETTINGS.rsaPublicKey !== null){
      this.publicKey = SETTINGS.rsaPublicKey;
      this.privateKey = SETTINGS.rsaPrivateKey;
      return;
    }
    const { pki, random } = forge;
    const keypair = pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });
    this.publicKey = pki.publicKeyToPem(keypair.publicKey);
    this.privateKey = pki.privateKeyToPem(keypair.privateKey);
    SETTINGS.rsaPublicKey = this.publicKey;
    SETTINGS.rsaPrivateKey = this.privateKey;
  },
  getPublicKey: function(){
    if(this.publicKey === null){
      if(this.privateKey !== null){
        throw new Error('[RSA ERROR] public key is null but private key is not null');
      }
      this.generateKeys();
    }
    return this.publicKey;
  },
  encrypt: function (publicKeyOfOther, plaintext) {
    const { pki } = forge;
    const publicKey = pki.publicKeyFromPem(publicKeyOfOther);
    const encrypted = publicKey.encrypt(plaintext);
    return forge.util.encode64(encrypted);
  },
  decrypt: function(encryptedText) {
    if(this.privateKey === null){
      throw new Error("[RSA ERROR] Trying to decrypt but key is not generated yet");
    }
    const { pki, util } = forge;
    const privateKey = pki.privateKeyFromPem(this.privateKey);
    const encryptedBytes = util.decode64(encryptedText);
    const decrypted = privateKey.decrypt(encryptedBytes);
    return decrypted;
  }
}