import parseGrammarFile from "./training/training";

const main = () => {
    const gameSet = parseGrammarFile('./grammars/example_1.gmr');
    console.log("----------------------------------- result")
    console.log(gameSet.combos.toArray());
    console.log(gameSet.keyMaps.toArray());
}

main();