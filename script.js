document.getElementById('scriptFile').addEventListener('change', function(event) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = async function(e) {
      const scriptText = e.target.result;
      const analysisResult = analyzePythonCode(scriptText);
      displayAnalysisResult(analysisResult);
    };

    reader.readAsText(file);
  }
});

function analyzePythonCode(scriptText) {
  const analysisResult = {
    variables: [],
    functions: [],
    classes: [],
    imports: []
  };

  const astTree = ast.parse(scriptText);

  astTree.body.forEach(node => {
    if (ast.isImport(node)) {
      analysisResult.imports.push(...node.names.map(name => name.name));
    } else if (ast.isFrom(node)) {
      analysisResult.imports.push(...node.names.map(name => name.name));
    } else if (ast.isFunctionDef(node)) {
      analysisResult.functions.push(node.name);
    } else if (ast.isAssign(node)) {
      node.targets.forEach(target => {
        if (ast.isName(target)) {
          analysisResult.variables.push(target.id);
        }
      });
    } else if (ast.isClassDef(node)) {
      analysisResult.classes.push(node.name);
    }
  });

  return analysisResult;
}

function displayAnalysisResult(analysisResult) {
  const outputElement = document.getElementById('output');
  const output = generateOutput(analysisResult);
  outputElement.textContent = output;
}

function generateOutput(analysisResult) {
  let output = '';

  if (analysisResult.variables.length > 0) {
    output += `Variables: ${analysisResult.variables.join(', ')}\n`;
  } else {
    output += 'No variables found.\n';
  }

  if (analysisResult.functions.length > 0) {
    output += `Functions: ${analysisResult.functions.join(', ')}\n`;
  } else {
    output += 'No functions found.\n';
  }

  if (analysisResult.classes.length > 0) {
    output += `Classes: ${analysisResult.classes.join(', ')}\n`;
  } else {
    output += 'No classes found.\n';
  }

  if (analysisResult.imports.length > 0) {
    output += `Imports: ${analysisResult.imports.join(', ')}\n`;
  } else {
    output += 'No imports found.\n';
  }

  return output;
}
