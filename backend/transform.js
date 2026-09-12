module.exports = function(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  // 1. Remove require for localDbService
  root.find(j.VariableDeclarator, {
    init: { type: 'CallExpression', callee: { name: 'require' } }
  }).filter(path => {
    return path.node.init.arguments[0] && 
           path.node.init.arguments[0].value &&
           path.node.init.arguments[0].value.includes('localDbService');
  }).remove();

  // 2. Remove isMongoConnected function declaration
  root.find(j.VariableDeclarator, {
    id: { name: 'isMongoConnected' }
  }).remove();

  // 3. Find if statements with isMongoConnected or readyState === 1
  let hasReplacements = true;
  while(hasReplacements) {
      hasReplacements = false;
      root.find(j.IfStatement).forEach(path => {
        const isReadyState = 
          path.node.test.type === 'BinaryExpression' &&
          path.node.test.left.type === 'MemberExpression' &&
          path.node.test.left.property.name === 'readyState' &&
          path.node.test.right.value === 1;
          
        const isFunctionCall = 
          path.node.test.type === 'CallExpression' &&
          path.node.test.callee.name === 'isMongoConnected';
          
        const isNotFunctionCall = 
          path.node.test.type === 'UnaryExpression' &&
          path.node.test.operator === '!' &&
          path.node.test.argument.type === 'CallExpression' &&
          path.node.test.argument.callee.name === 'isMongoConnected';

        if (isReadyState || isFunctionCall) {
          hasReplacements = true;
          if (path.node.consequent.type === 'BlockStatement') {
            j(path).replaceWith(path.node.consequent.body);
          } else {
            j(path).replaceWith(path.node.consequent);
          }
        } else if (isNotFunctionCall) {
          hasReplacements = true;
          if (path.node.alternate) {
            if (path.node.alternate.type === 'BlockStatement') {
              j(path).replaceWith(path.node.alternate.body);
            } else {
              j(path).replaceWith(path.node.alternate);
            }
          } else {
             j(path).remove();
          }
        }
      });
  }

  // 4. Clean up empty variable declarations left by remove() (e.g. `const localDb = ...`)
  root.find(j.VariableDeclaration).filter(path => path.node.declarations.length === 0).remove();

  return root.toSource();
};
