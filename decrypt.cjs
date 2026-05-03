const crypto = require("crypto");
const fs = require("fs");

const decryptFile = (inputFile, outputFile, password) => {
  const d = fs.readFileSync(inputFile);
  const iv = d.slice(0, 16);
  const data = d.slice(16);
  const key = crypto.createHash("sha256").update(password).digest();

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let dec = decipher.update(data);
  dec = Buffer.concat([dec, decipher.final()]);

  fs.writeFileSync(outputFile, dec);
  console.log("Decrypted successfully to " + outputFile);
};

decryptFile(
  "D:/WebApp/Portfolio/3d-portfolio-template/public/models/character.enc",
  "D:/WebApp/Portfolio/public/character.glb",
  "Character3D#@"
);
