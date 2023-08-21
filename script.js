document.addEventListener("DOMContentLoaded", () => {
    const uploadForm = document.getElementById("upload-form");
    const fileInput = document.getElementById("file-input");
    const analysisResults = document.getElementById("analysis-results");

    uploadForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const file = fileInput.files[0];
        if (!file) {
            alert("Please select a Python script file.");
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
            inputs: [],
            // ...other categories...
        };

        for (const line of lines) {
            if (line.trim().startsWith("import")) {
                analysis.imports.push(line);
            } else if (line.trim().startsWith("def ")) {
                analysis.functions.push(line);
            } else if (line.trim().startsWith("#")) {
                analysis.comments.push(line);
            } else if (line.includes("=")) {
                analysis.variables.push(line);
            }
            // Add more checks for other categories...
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
            <!-- ...other categories... -->
        `;
        analysisResults.innerHTML = resultsHTML;
    }
});
