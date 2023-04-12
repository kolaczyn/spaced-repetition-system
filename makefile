run:
	deno run --allow-net main.ts
test:
	deno test
compile:
	deno compile --allow-net main.ts --output bin/main
format:
	deno fmt --check