# Dapp Tutorial

This repo was put together using the tutorial [here](https://docs.aztec.network/tutorials/codealong/simple_dapp) to address this [issue](https://github.com/AztecProtocol/dev-rel/issues/383).

Use version 0.55.1 of the sandbox.

## Issues

This repo demonstrates 2 issues with the sandbox.

### 1. DEBUG not printing in the terminal

I try starting the sandbox with `DEBUG` enabled (`DEBUG=* aztec start --sandbox`), but nothing is printed in the console when I run the constructor or when I call `redeem_shield`.

[debug statements in `constructor`](contracts/token/src/main.nr#L75-78)

[debug statements in `redeem_shield`](contracts/token/src/main.nr#L250-252)

### 2. `redeem_shield` in the token contract not working

Fails with error:

```
Error in app: Error: (JSON-RPC PROPAGATED) Assertion failed: note not popped 'notes.len() == 1'
```

This code referenced as part of the tutorial is no longer being tested in the monorepo CI, see it commented out [here](https://github.com/AztecProtocol/aztec-packages/blob/87e0a17db6c89a3a6e23fca3369c3bc5fe84ad3d/yarn-project/end-to-end/Earthfile#L277).

To reproduce:

1. Install dependencies

```
yarn
```

2. start the sandbox

```
DEBUG=* aztec start --sandbox
```

3.  run scripts

    1. `node src/deploy.mjs`
    2. `node src/index.mjs`
