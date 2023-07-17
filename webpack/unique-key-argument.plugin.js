const pathNode = require('node:path');
const { v4 } = require('uuid');
const md5 = require('md5');

const BabelRoothPlugin = (api) => {
  let count = 0;
  const t = api.types;

  return {
    name: 'rooth-unique-key',
    visitor: {
      CallExpression(path, { opts: options, file }) {
        const { filename, cwd } = file.opts;
        // console.log(path)
        //console.log(path.node);

        if (
          path.node.callee &&
          path.node.callee.object &&
          (path.node.callee.object.name === 'tree' || path.node.callee.object.name === 'tags')
        ) {
          if (path.node.arguments.length < 2) {
            const id = `${md5(pathNode.relative(cwd, filename))}/${v4()}`;
            console.log(`id div ${id}`);
            path.node.arguments.push(t.StringLiteral(id));
            console.log(path.node.arguments);
            console.log('NEXT');
            count++;
            console.log(count);
          }
          //console.log(path.node.callee);
        }
        // if (path.node.callee.object.name === 'tree') {
        //   if (path.node.callee.property.name === 'div') {
        //     const id = md5(pathNode.relative(cwd, filename));
        //     console.log(`id div ${id}`);
        //     //path.node.arguments.push(t.StringLiteral(id));
        //   }
        // }
      },
    },
  };
};

module.exports = BabelRoothPlugin;
