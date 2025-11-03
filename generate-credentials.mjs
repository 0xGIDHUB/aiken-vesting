import fs from 'node:fs';
import {
  MeshWallet,
} from "@meshsdk/core";
 

// Generate a secret key for the owner wallet and beneficiary wallet
const owner_secret_key = MeshWallet.brew(true);
const beneficiary_secret_key = MeshWallet.brew(true);


//Save secret keys to files
fs.writeFileSync('owner.sk', owner_secret_key);
fs.writeFileSync('beneficiary.sk', beneficiary_secret_key);
console.log("_\n->Secret keys saved to 'owner.sk' and 'beneficiary.sk'\n");

// Create wallet instances from the secret keys
const owner_wallet = new MeshWallet({
  networkId: 0,
  key: {
    type: 'root',
    bech32: owner_secret_key,
  },
});
 
const beneficiary_wallet = new MeshWallet({
  networkId: 0,
  key: {
    type: 'root',
    bech32: beneficiary_secret_key,
  },
});
 
// Save unused addresses to files 
fs.writeFileSync('owner.addr', (await owner_wallet.getUnusedAddresses())[0]);
fs.writeFileSync('beneficiary.addr', (await beneficiary_wallet.getUnusedAddresses())[0]);
console.log("_\n->Addresses saved to 'owner.addr' and 'beneficiary.addr'\n");
