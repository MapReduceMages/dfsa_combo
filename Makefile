all: install build

EXAMPLE_GRAMMAR = ./grammars/example_2.gmr

install:
	npm install

build:
	npm run build
