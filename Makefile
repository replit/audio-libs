

.PHONY test-all docs-all


test-all:
	@cd js && yarn test
	@cd python && make test


docs-all:
	@cd js && yarn docs
	@cd python && make docs-html


all: test-all docs-all
