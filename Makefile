all: install build

EXAMPLE_GRAMMAR = ./grammars/example_1.gmr

install:
	npm install

build:
	npm run build

run: install
	npm run exec ${EXAMPLE_GRAMMAR}
