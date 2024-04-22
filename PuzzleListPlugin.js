const fs = require('fs');
const path = require('path');

/* eslint class-methods-use-this: "off" */

class PuzzleListPlugin {
  apply(compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      const puzzlesDir = path.resolve(__dirname, './dist/puzzles');
      const puzzles = fs
        .readdirSync(puzzlesDir)
        .filter(filename => filename.endsWith('.json'))
        .map(filename => filename.replace('.json', ''));

      const json = JSON.stringify(puzzles, null, 2);
      // eslint-disable-next-line no-param-reassign
      compilation.assets['puzzles/puzzles.json'] = {
        source() {
          return json;
        },
        size() {
          return json.length;
        },
      };

      callback();
    });
  }
}

module.exports = PuzzleListPlugin; // Export the class
