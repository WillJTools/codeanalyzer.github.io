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
        const functionName = line.match(/def\s+(\w+)\s*\(/)[1];
        analysisResult.functions.push(functionName);
      } else if (trimmedLine.includes('=')) {
        const variableName = line.match(/(\w+)\s*=/);
        if (variableName) {
          analysisResult.variables.push(variableName[1]);
        }
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
  
    if (analysisResult.imports.length > 0) {
      output += `Imports: ${analysisResult.imports.join(', ')}\n`;
    } else {
      output += 'No imports found.\n';
    }
  
    return output;
  }
  
