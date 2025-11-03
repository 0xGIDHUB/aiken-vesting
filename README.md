# Aiken-Vesting

A vesting contract is a common type of contract that allows funds to be locked for a period of time and unlocked later—once a specified time has passed. Typically, a vesting contract defines a beneficiary who may be different from the original owner.
<br/>

[vesting-validator](link)

## Quick Start

**1. Clone the repository:**
```bash
git clone https://github.com/0xGIDHUB/aiken-vesting.git
cd aiken-vesting
```

**2. Install Dependencies:**
Install dependencies and setup your .env file:
```bash
npm install
```
```.env
BLOCKFROST_API=yourblockfrostapikey
```


**3. Generate credentials:**
```bash
node generate-credentials.mjs
```

You should get two output addresses 'owner.addr' and 'beneficiary.addr' which will be used in locking and unlocking the UTXO. <br/>
Fund the addresses with some test ADA on [cardano faucet](https://docs.cardano.org/cardano-testnets/tools/faucet)

**3. Lock Ada to the Vesting Validator:**
```bash
node vesting_lock.mjs <ada_amount>
```
Replace <ada_amount> with the amount of ADA you want to lock (in lovelace)

**4. Unlock Ada from the Vesting Validator:**
```bash
node vesting_unlock.mjs
```

You will know that you got it right if you see a message like this:
```
txHash 99579e2dbac411c60509affb578705368d93f86589103ff2b2722411d265cba9
ADA sucessfully unlocked!
```

## Testing
```bash
aiken check
```
You should see this output:
```sh
    Compiling aiken-lang/aiken-vesting 0.0.0 (.)
    Compiling aiken-lang/stdlib v2.2.0 (./build/packages/aiken-lang-stdlib)
    Compiling sidan-lab/vodka 0.1.1-beta (./build/packages/sidan-lab-vodka)
   Collecting all tests scenarios across all modules
      Testing ...

    ┍━ vesting ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    │ PASS [mem: 116613, cpu: 48140224] success_unlocking
    ┕━━━━━━━━━━━━━━━━━━━━━━ 1 tests | 1 passed | 0 failed


      Summary 1 check, 0 errors, 0 warnings
```


To learn more about vesting in aiken check out the [docs](https://aiken-lang.org/example--vesting/mesh)