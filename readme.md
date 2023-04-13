## Setup

Install tool for migration

```sh
deno install --unstable --allow-net --allow-read --allow-env https://deno.land/x/nessie/cli.ts
```

Run migrations

```sh
nessie migrate
```

### Code Coverage

Install `lcov` via your package manager of choice. Example:

```sh
brew install lcov
```

Then you can run command for generating raport with:

```sh
make coverage
```
