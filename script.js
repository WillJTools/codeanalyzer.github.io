document.addEventListener("DOMContentLoaded", () => {
    const uploadForm = document.getElementById("upload-form");
    const fileInput = document.getElementById("file-input");
    const analysisResults = document.getElementById("analysis-results");

    uploadForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const file = fileInput.files[0];
        if (!file) {
            alert("Please select a file.");
            return;
        }

        const fileContent = await readFile(file);
        const analysis = analyzeScript(fileContent);

        displayAnalysisResults(analysis);
    });

    async function readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target.result);
            reader.onerror = (event) => reject(event.target.error);
            reader.readAsText(file);
        });
    }

    function analyzeScript(scriptContent) {
        const lines = scriptContent.split("\n");
        const analysis = {
            imports: [],
            variables: [],
            functions: [],
            comments: [],
            controlStructures: [],
            errorHandling: [],
            mainExecution: [],
            // ...other categories...
        };

        let insideFunction = false;
        let insideMainExecution = false;
        let insideTryBlock = false;
        let insideIfBlock = false;

        for (const line of lines) {
            if (line.trim().startsWith("import")) {
                analysis.imports.push(line);
            } else if (line.trim().startsWith("def ")) {
                insideFunction = true;
                analysis.functions.push(line);
            } else if (insideFunction && line.includes(":")) {
                insideFunction = false;
            } else if (line.trim().startsWith("#")) {
                analysis.comments.push(line);
            } else if (line.includes("=")) {
                analysis.variables.push(line);
            } else if (line.trim() === "if __name__ == '__main__':") {
                insideMainExecution = true;
                analysis.mainExecution.push(line);
            } else if (insideMainExecution && line.trim() === "else:"){
                insideMainExecution = false;
            } else if (line.trim().startsWith("if ") || line.trim().startsWith("elif ") || line.trim().startsWith("else:")) {
                insideIfBlock = true;
                analysis.controlStructures.push(line);
            } else if (insideIfBlock) {
                analysis.controlStructures.push(line);
                if (line.trim().endsWith(":")) {
                    insideIfBlock = false;
                }
            } else if (line.trim().startsWith("try:")) {
                insideTryBlock = true;
                analysis.errorHandling.push(line);
            } else if (insideTryBlock) {
                analysis.errorHandling.push(line);
                if (line.trim().startsWith("except") || line.trim().startsWith("finally:")) {
                    insideTryBlock = false;
                }
            }
        }

        return analysis;
    }

    function displayAnalysisResults(analysis) {
        const resultsHTML = `
            <h2>Analysis Results</h2>
            <h3>Imports:</h3>
            <pre>${analysis.imports.join("\n")}</pre>
            <h3>Variables:</h3>
            <pre>${analysis.variables.join("\n")}</pre>
            <h3>Functions:</h3>
            <pre>${analysis.functions.join("\n")}</pre>
            <h3>Comments:</h3>
            <pre>${analysis.comments.join("\n")}</pre>
            <h3>Control Structures:</h3>
            <pre>${analysis.controlStructures.join("\n")}</pre>
            <h3>Error Handling:</h3>
            <pre>${analysis.errorHandling.join("\n")}</pre>
            <h3>Main Execution:</h3>
            <pre>${analysis.mainExecution.join("\n")}</pre>
            <!-- ...other categories... -->
        `;
        analysisResults.innerHTML = resultsHTML;
    }
});
