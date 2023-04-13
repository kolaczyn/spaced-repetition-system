## Setup

### Setup environment

Install `deno` and `postgres` on your system.\
Change `.env` file depending on your Postgres setup

### Migration

Install tool for migration

```sh
deno install --unstable --allow-net --allow-read --allow-env https://deno.land/x/nessie/cli.ts
```

Run migrations

```sh
nessie migrate
```

### Run

```sh
deno task run
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
