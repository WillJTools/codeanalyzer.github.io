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

        console.log("File selected:", file);

        const fileContent = await readFile(file);
        console.log("File content:", fileContent);

        const fileExtension = getFileExtension(file.name);
        console.log("File extension:", fileExtension);

        if (fileExtension !== 'js') {
            alert("Unsupported file type. Please upload a .js file.");
            return;
        }

        console.log("Starting JavaScript analysis...");

        const analysis = analyzeJavaScript(fileContent);
        console.log("Analysis results:", analysis);

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

    function getFileExtension(fileName) {
        return fileName.split('.').pop().toLowerCase();
    }

    function analyzeJavaScript(scriptContent) {
