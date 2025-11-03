import { mConStr0 } from "@meshsdk/common";
import { deserializeAddress } from "@meshsdk/core";
import {
  getTxBuilder,
  owner_wallet,
  scriptAddr,
} from "./common/common.mjs";
import fs from 'fs';

 
async function depositFundTx(amount, lockUntilTimeStampMs) {
  const utxos = await owner_wallet.getUtxos();
  const { pubKeyHash: ownerPubKeyHash } = deserializeAddress(
    fs.readFileSync("owner.addr").toString()
  );
  const { pubKeyHash: beneficiaryPubKeyHash } = deserializeAddress(
    fs.readFileSync("beneficiary.addr").toString()
  );
 
  const txBuilder = getTxBuilder();
  await txBuilder
    .txOut(scriptAddr, amount)
    .txOutInlineDatumValue(
      mConStr0([lockUntilTimeStampMs, ownerPubKeyHash, beneficiaryPubKeyHash])
    )
    .changeAddress(owner_wallet.addresses.baseAddressBech32)
    .selectUtxosFrom(utxos)
    .complete();
  return txBuilder.txHex;
}

async function main() {
  const assets = [
    {
      unit: "lovelace",
      quantity: process.argv[2],
    },
  ];
 
  const lockUntilTimeStamp = new Date();
  lockUntilTimeStamp.setMinutes(lockUntilTimeStamp.getMinutes() + 1);
 
  const unsignedTx = await depositFundTx(assets, lockUntilTimeStamp.getTime());
 
  const signedTx = await owner_wallet.signTx(unsignedTx);
  const txHash = await owner_wallet.submitTx(signedTx);
 
  //Copy this txHash. You will need this hash in vesting_unlock.mjs
  console.log("txHash", txHash);
  fs.writeFileSync('tx-hash.tx', txHash);
}
 
main();