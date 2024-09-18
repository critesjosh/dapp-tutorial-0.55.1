import { getInitialTestAccountsWallets } from '@aztec/accounts/testing';
import { ExtendedNote, Fr, Note, computeSecretHash, createPXEClient } from '@aztec/aztec.js';
import { fileURLToPath } from '@aztec/foundation/url';

import { getToken } from './contracts.mjs';

const { PXE_URL = 'http://localhost:8080' } = process.env;

async function main() {
    const pxe = createPXEClient(PXE_URL);
    const { l1ChainId } = await pxe.getNodeInfo();
    console.log(`Connected to chain ${l1ChainId}`);

    const accounts = await pxe.getRegisteredAccounts();
    console.log(`User accounts:\n${accounts.map(a => a.address).join('\n')}`);

    await mintPrivateFunds(pxe);
    await transferPrivateFunds(pxe);
}


async function mintPrivateFunds(pxe) {
    const [owner] = await getInitialTestAccountsWallets(pxe);
    const token = await getToken(owner);

    await showPrivateBalances(pxe);

    const mintAmount = 20n;
    const secret = Fr.random();
    const secretHash = await computeSecretHash(secret);
    const receipt = await token.methods.mint_private(mintAmount, secretHash).send().wait();

    console.log(receipt)
    const storageSlot = token.artifact.storageLayout['pending_shields'].slot;
    const noteTypeId = token.artifact.notes['TransparentNote'].id;

    const note = new Note([new Fr(mintAmount), secretHash]);
    const extendedNote = new ExtendedNote(
        note,
        owner.getAddress(),
        token.address,
        storageSlot,
        noteTypeId,
        receipt.txHash,
    );
    await pxe.addNote(extendedNote);

    console.log(`Note added`);
    let notes = await pxe.getIncomingNotes({ owner: owner.getAddress() });
    console.log(`Incoming notes: ${notes[0].note}`);

    let tx = await token.methods.redeem_shield(owner.getAddress(), mintAmount, secret).send().wait();

    console.log("redeemed shield", tx);

    await showPrivateBalances(pxe);
}

async function transferPrivateFunds(pxe) {
    // docs:start:transferPrivateFunds
    const [owner, recipient] = await getInitialTestAccountsWallets(pxe);
    const token = await getToken(owner);

    const tx = token.methods.transfer(owner.getAddress(), recipient.getAddress(), 1n, 0).send();
    console.log(`Sent transfer transaction ${await tx.getTxHash()}`);
    await showPrivateBalances(pxe);

    console.log(`Awaiting transaction to be mined`);
    const receipt = await tx.wait();
    console.log(`Transaction has been mined on block ${receipt.blockNumber}`);
    await showPrivateBalances(pxe);
    // docs:end:transferPrivateFunds
}

async function showPrivateBalances(pxe) {
    const accounts = await pxe.getRegisteredAccounts();
    const token = await getToken(pxe);

    for (const account of accounts) {
        // highlight-next-line:showPrivateBalances
        const balance = await token.methods.balance_of_private(account.address).simulate();
        console.log(`Balance of ${account.address}: ${balance}`);
    }
}

main().catch(err => {
    console.error(`Error in app: ${err}`);
    process.exit(1);
});