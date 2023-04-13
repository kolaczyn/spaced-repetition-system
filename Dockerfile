FROM denoland/deno:1.32.4

# The port that your application listens to.
EXPOSE 1993

WORKDIR /app

# Prefer not to run as root.
USER root

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
COPY deno.lock .

RUN deno install --unstable --allow-net --allow-read --allow-env https://deno.land/x/nessie/cli.ts

# These steps will be re-run upon each file change in your working directory:
ADD . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache ./src/main.ts


CMD ["task", "run"]
