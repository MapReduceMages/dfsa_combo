all: install run

EXAMPLE_GRAMMAR = ./grammars/example_1.gmr

install:
	npm install

run:
	npm run exec ${EXAMPLE_GRAMMAR}