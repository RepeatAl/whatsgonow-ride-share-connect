
/**
 * @fileoverview ESLint-Regel, die sicherstellt, dass xRechnungService-Methoden mit Object-Parametern aufgerufen werden
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Stellt sicher, dass xRechnungService-Methoden mit Object-Parametern aufgerufen werden',
      category: 'Mögliche Fehler',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      useObjectParams: 'xRechnungService-Methoden müssen mit einem einzigen Object-Parameter aufgerufen werden. Bitte verwende: {{ methodName }}({ param1, param2, ... })',
    }
  },
  create(context) {
    // Liste der zu prüfenden Methoden
    const methodsToCheck = [
      'sendXRechnungEmail',
      'sendXRechnungPreview',
      'autoSendXRechnungIfGovernment'
    ];
    
    return {
      CallExpression(node) {
        // Prüfen, ob es sich um einen Aufruf einer xRechnungService-Methode handelt
        if (node.callee.type === 'MemberExpression' && 
            node.callee.object.type === 'Identifier' && 
            node.callee.object.name === 'xRechnungService' && 
            node.callee.property.type === 'Identifier' && 
            methodsToCheck.includes(node.callee.property.name)) {
          
          const methodName = node.callee.property.name;
          
          // Prüfen, ob genau ein Parameter übergeben wird und dieser ein Object-Literal ist
          if (node.arguments.length !== 1 || node.arguments[0].type !== 'ObjectExpression') {
            context.report({
              node,
              messageId: 'useObjectParams',
              data: { methodName },
              fix(fixer) {
                // Wenn mehr als ein Parameter und alle sind Identifier oder Literal, können wir einen Fix anbieten
                if (node.arguments.length > 1 && node.arguments.every(arg => 
                  ['Identifier', 'Literal'].includes(arg.type))) {
                  
                  // Einfachen Objekt-Parameter erstellen
                  const argTexts = context.getSourceCode().getText(node).split('(')[1].split(')')[0].split(',');
                  return fixer.replaceText(node, 
                    `${context.getSourceCode().getText(node.callee)}({ ${argTexts.join(', ')} })`);
                }
              }
            });
          }
        }
        
        // Prüfen, ob es sich um einen Aufruf einer invoiceService-Methode handelt, die xRechnungService aufruft
        if (node.callee.type === 'MemberExpression' && 
            node.callee.object.type === 'Identifier' && 
            node.callee.object.name === 'invoiceService' && 
            node.callee.property.type === 'Identifier' && 
            methodsToCheck.includes(node.callee.property.name)) {
          
          const methodName = node.callee.property.name;
          
          // Prüfen, ob genau ein Parameter übergeben wird und dieser ein Object-Literal ist
          if (node.arguments.length !== 1 || node.arguments[0].type !== 'ObjectExpression') {
            context.report({
              node,
              messageId: 'useObjectParams',
              data: { methodName },
              fix(fixer) {
                // Wenn mehr als ein Parameter und alle sind Identifier oder Literal, können wir einen Fix anbieten
                if (node.arguments.length > 1 && node.arguments.every(arg => 
                  ['Identifier', 'Literal'].includes(arg.type))) {
                  
                  // Einfachen Objekt-Parameter erstellen
                  const argTexts = context.getSourceCode().getText(node).split('(')[1].split(')')[0].split(',');
                  return fixer.replaceText(node, 
                    `${context.getSourceCode().getText(node.callee)}({ ${argTexts.join(', ')} })`);
                }
              }
            });
          }
        }
      }
    };
  },
};
