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
        const { functions, globalVariables, comments } = extractScriptInfo(fileContent);

        displayAnalysisResults(functions, globalVariables, comments);
    });

    async function readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target.result);
            reader.onerror = (event) => reject(event.target.error);
            reader.readAsText(file);
        });
    }

    function extractScriptInfo(scriptContent) {
        const functionRegex = /function\s+([^\s(]+)/g;
        const matches = scriptContent.matchAll(functionRegex);
        const functions = Array.from(matches, match => match[1]);

        const variableRegex = /(?:const|let|var)\s+(\w+)\s*=/g;
        const variableMatches = scriptContent.matchAll(variableRegex);
        const variables = Array.from(variableMatches, match => match[1]);

        const commentRegex = /\/\/.*|\/\*[\s\S]*?\*\//g;
        const commentMatches = scriptContent.match(commentRegex);
        const comments = commentMatches ? commentMatches.map(comment => comment.trim()) : [];

        return { functions, globalVariables: variables, comments };
    }

    function displayAnalysisResults(functions, globalVariables, comments) {
        const resultsHTML = `
            <h2>Extracted Functions</h2>
            <pre>${functions.join("\n")}</pre>
            <h2>Global Variables</h2>
            <pre>${globalVariables.join("\n")}</pre>
            <h2>Comments</h2>
            <pre>${comments.join("\n")}</pre>
        `;
        analysisResults.innerHTML = resultsHTML;
    }
});
