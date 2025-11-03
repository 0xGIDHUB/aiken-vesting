import {
  deserializeAddress,
  deserializeDatum,
  slotToBeginUnixTime,
  unixTimeToEnclosingSlot,
  SLOT_CONFIG_NETWORK,
} from "@meshsdk/core";
import fs from 'fs';
import {
  getTxBuilder,
  beneficiary_wallet,
  scriptAddr,
  scriptCbor,
  blockchainProvider,
} from "./common/common.mjs";
 
async function withdrawFundTx(vestingUtxo) {
  const utxos = await beneficiary_wallet.getUtxos();
  const beneficiaryAddress = fs.readFileSync("beneficiary.addr").toString();
  const collateral = (await beneficiary_wallet.getCollateral())[0];
  if (collateral === undefined) throw new Error("Add collateral to the beneficiary wallet-> Fund the wallet with some ADA!");
 
  const { pubKeyHash: beneficiaryPubKeyHash } = deserializeAddress(
    beneficiaryAddress
  );
 
  const datum = deserializeDatum(vestingUtxo.output.plutusData);

  const invalidBefore =
    unixTimeToEnclosingSlot(
      Math.min(
        Number(datum.fields[0].int), 
        Date.now() - 19000
      ),
      SLOT_CONFIG_NETWORK.preview
    ) + 1;

  const txBuilder = getTxBuilder();
  await txBuilder
    .spendingPlutusScript("V3")
    .txIn(
      vestingUtxo.input.txHash,
      vestingUtxo.input.outputIndex,
      vestingUtxo.output.amount,
      scriptAddr
    )
    .spendingReferenceTxInInlineDatumPresent()
    .spendingReferenceTxInRedeemerValue("")
    .txInScript(scriptCbor)
    .txOut(beneficiaryAddress, vestingUtxo.output.amount)
    .txInCollateral(
      collateral.input.txHash,
      collateral.input.outputIndex,
      collateral.output.amount,
      collateral.output.address
    )
    .invalidBefore(invalidBefore)
    .requiredSignerHash(beneficiaryPubKeyHash)
    .changeAddress(beneficiaryAddress)
    .selectUtxosFrom(utxos)
    .complete();
  return txBuilder.txHex;
}

async function getUtxoByTxHash(txHash) {
  const utxos = await blockchainProvider.fetchUTxOs(txHash);
  if (utxos.length === 0) {
    throw new Error("UTxO not found");
  }
  return utxos[0];
}
 

async function main() {
  const txHashFromDesposit =
    //This is the hash that we generated in the locking file when we submitted the transaction.
    fs.readFileSync("tx-hash.tx").toString();
 
  const utxo = await getUtxoByTxHash(txHashFromDesposit);
 
  if (utxo === undefined) throw new Error("UTxO not found");
 
  const unsignedTx = await withdrawFundTx(utxo);
 
  const signedTx = await beneficiary_wallet.signTx(unsignedTx);
 
  const txHash = await beneficiary_wallet.submitTx(signedTx);
  console.log("txHash", txHash);
  console.log("ADA sucessfully unlocked!");
}

main();