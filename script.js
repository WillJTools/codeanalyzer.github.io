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
    dictionaries: [],
    tuples: [],
    lists: [],
    imports: []
  };

  const lines = scriptText.split('\n');

  lines.forEach(line => {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('import ') || trimmedLine.startsWith('from ')) {
      const importMatch = line.match(/(?:import|from)\s+([^\s]+)/);
      if (importMatch) {
        const importName = importMatch[1];
        analysisResult.imports.push(importName);
      }
    } else if (trimmedLine.startsWith('def ')) {
      const functionName = line.match(/def\s+(\w+)\s*\(/);
      if (functionName) {
        analysisResult.functions.push(functionName[1]);
      }
    } else if (trimmedLine.startsWith('class ')) {
      const className = line.match(/class\s+(\w+)/);
      if (className) {
        analysisResult.classes.push(className[1]);
      }
    } else if (trimmedLine.includes('=')) {
      const variableName = line.match(/(\w+)\s*=/);
      if (variableName) {
        analysisResult.variables.push(variableName[1]);
      }
    } else if (trimmedLine.includes('{')) {
      if (trimmedLine.includes(':')) {
        analysisResult.dictionaries.push(trimmedLine);
      } else {
        analysisResult.tuples.push(trimmedLine);
      }
    } else if (trimmedLine.includes('[')) {
      analysisResult.lists.push(trimmedLine);
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

  if (analysisResult.dictionaries.length > 0) {
    output += `Dictionaries:\n${analysisResult.dictionaries.join('\n')}\n`;
  } else {
    output += 'No dictionaries found.\n';
  }

  if (analysisResult.tuples.length > 0) {
    output += `Tuples:\n${analysisResult.tuples.join('\n')}\n`;
  } else {
    output += 'No tuples found.\n';
  }

  if (analysisResult.lists.length > 0) {
    output += `Lists:\n${analysisResult.lists.join('\n')}\n`;
  } else {
    output += 'No lists found.\n';
  }

  return output;
}
