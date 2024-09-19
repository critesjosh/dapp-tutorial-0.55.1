# Dapp Tutorial

Use version 0.55.1 of the sandbox.

## Issues

### DEBUG not working

I try starting the sandbox with `DEBUG` enabled (`DEBUG=* aztec start --sandbox`), but nothing is printed in the console when I run the constructor or when I call `redeem_shield`.

@[debug statements in `constructor`](contracts/token/src/main.nr#L75-78)

@[debug statements in `redeem_shield`](contracts/token/src/main.nr#L250-252)

### `redeem_shield` not working

Fails with error:

```
Error in app: Error: (JSON-RPC PROPAGATED) Assertion failed: note not popped 'notes.len() == 1'
```

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
