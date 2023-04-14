coverage:
	rm -rf ./coverage_data
	rm -rf ./coverage-report
	deno task test-all --coverage=./coverage_data && deno coverage ./coverage_data --lcov > coverage.lcov && genhtml coverage.lcov --output-directory coverage-report && open coverage-report/index.html
test-integration:
	docker compose run --build deno
