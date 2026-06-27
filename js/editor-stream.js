/*=========================================================
            EDITOR-STREAM.JS
    Candidate Live Coding Simulation Script
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {
    initializeCodeEditorStream();
});

let codeStreamInterval = null;
let currentCodeIndex = 0;
let isEditorStreaming = false;

const codeSnippets = {
    multithreading: `// Candidate's live workspace: Multi-threading in Node.js
const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
    console.log("Main Thread: Starting CPU intensive task...");
    
    // Spawn a worker thread to keep main thread unblocked
    const worker = new Worker(__filename);
    
    worker.on('message', (msg) => {
        console.log(\`Result received from Worker: \${msg}\`);
        // Notify recruiter of completion
        updateInterviewProgress("Round 2 - Coding Task Complete!");
    });
    
    worker.postMessage({ count: 100000000 });
} else {
    // Worker Thread Logic
    parentPort.on('message', (data) => {
        let sum = 0;
        for (let i = 0; i < data.count; i++) {
            sum += Math.sqrt(i);
        }
        // Send computed result back
        parentPort.postMessage(sum);
    });
}`,
    reactHooks: `// Candidate's live workspace: React custom lifecycle hook
import { useEffect, useRef } from 'react';

function usePrevious(value) {
    // The ref object is a generic container whose current property is mutable
    const ref = useRef();
    
    // Store current value in ref
    useEffect(() => {
        ref.current = value;
    }, [value]); // Only re-run if value changes
    
    // Return previous value (happens before update in useEffect)
    return ref.current;
}

export default usePrevious;`,
    binarySearch: `// Candidate's live workspace: Binary Search Algorithm
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid; // Target found
        }
        
        if (arr[mid] < target) {
            left = mid + 1; // Search right half
        } else {
            right = mid - 1; // Search left half
        }
    }
    
    return -1; // Target not found
}`
};

function initializeCodeEditorStream() {
    startCodeStream("multithreading");
}

function startCodeStream(snippetKey) {
    const editorBody = document.getElementById("codeEditorBody");
    if (!editorBody) return;
    
    stopCodeStream();
    editorBody.innerHTML = "";
    currentCodeIndex = 0;
    isEditorStreaming = true;
    
    const rawCode = codeSnippets[snippetKey] || codeSnippets.multithreading;
    
    codeStreamInterval = setInterval(() => {
        if (!isEditorStreaming) return;
        
        if (currentCodeIndex < rawCode.length) {
            // Read next characters (type in blocks of 1-3 characters to speed it up slightly)
            const charsToType = Math.min(rawCode.length - currentCodeIndex, Math.floor(Math.random() * 2) + 1);
            const part = rawCode.substring(currentCodeIndex, currentCodeIndex + charsToType);
            
            // Basic syntax color injection as we type
            const formattedPart = escapeHtml(part)
                .replace(/\b(const|let|var|function|return|if|else|import|export|default|new|require|class|extends|from)\b/g, '<span class="code-keyword">$1</span>')
                .replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="code-string">$1</span>')
                .replace(/(\/\/.*)/g, '<span class="code-comment">$1</span>')
                .replace(/\b(\d+)\b/g, '<span class="code-number">$1</span>')
                .replace(/\b(console|parentPort|worker|ref|Math)\b/g, '<span class="code-variable">$1</span>');
                
            editorBody.innerHTML += formattedPart;
            currentCodeIndex += charsToType;
            
            // Auto scroll to bottom
            editorBody.scrollTop = editorBody.scrollHeight;
            
            // Randomize typing speed to make it look realistic
        } else {
            clearInterval(codeStreamInterval);
        }
    }, 45);
}

function stopCodeStream() {
    if (codeStreamInterval) {
        clearInterval(codeStreamInterval);
        codeStreamInterval = null;
    }
    isEditorStreaming = false;
}

function pauseCodeStream() {
    isEditorStreaming = false;
}

function resumeCodeStream() {
    isEditorStreaming = true;
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

// Make accessible globally
window.startCodeStream = startCodeStream;
window.stopCodeStream = stopCodeStream;
window.pauseCodeStream = pauseCodeStream;
window.resumeCodeStream = resumeCodeStream;
