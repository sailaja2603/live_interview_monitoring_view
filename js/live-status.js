/*=========================================================
        LIVE STATUS.JS
        AI Live Interview Monitoring & Proctor Simulator
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {
    startLiveMonitoring();
    initializeWebcamProctor();
});

// State variables for proctor simulation
let proctorState = {
    webcamActive: false,
    webcamStream: null,
    cheatingRisk: "Very Low",
    tabSwitches: 0,
    multipleFaces: false,
    gazeDistracted: false,
    faceLost: false,
    audioLost: false,
    emotion: "😊 Happy",
    stressLevel: "Low",
    speakingSpeed: "Normal",
    voiceTone: "Confident",
    cheatingScore: 5, // out of 100
    voiceClarityScore: 95,
    eyeContactScore: 89,
    confidenceScore: 92,
    codingScore: 88,
    activeQuestionKey: "multithreading"
};

// Canvas animation frame handle
let canvasAnimFrame = null;
let simulatedFaceX = 0;
let simulatedFaceY = 0;
let simulatedFaceDir = 1;

/*=========================================================
                Start Monitoring
=========================================================*/
function startLiveMonitoring() {
    updateConfidenceLoop();
    updateEyeContactLoop();
    updateVoiceClarityLoop();
    updateCodingActivityLoop();
    updateInterviewStatusLoop();
    updateNetworkStatusLoop();
    updateTimelineLoop();
    updateSpeechTranscriptLoop();
}

/*=========================================================
                Utility Functions
=========================================================*/
function randomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateProctorScoreboard() {
    // Update HTML status cards
    const cheatVal = document.getElementById("cheatingRiskVal");
    const tabSwitchVal = document.getElementById("tabSwitchVal");
    const stressVal = document.getElementById("stressLevelVal");
    const emotionVal = document.getElementById("emotionVal");
    const speakSpeedVal = document.getElementById("speakSpeedVal");
    const voiceToneVal = document.getElementById("voiceToneVal");
    const faceVal = document.getElementById("faceDetectVal");
    const scoreVal = document.getElementById("liveScoreVal");
    
    if (cheatVal) {
        cheatVal.innerHTML = proctorState.cheatingRisk;
        cheatVal.className = "badge " + 
            (proctorState.cheatingRisk === "High" ? "bg-danger" : 
             proctorState.cheatingRisk === "Medium" ? "bg-warning" : "bg-success");
    }
    if (tabSwitchVal) {
        tabSwitchVal.innerHTML = proctorState.tabSwitches > 0 ? proctorState.tabSwitches : "None";
        tabSwitchVal.className = proctorState.tabSwitches > 0 ? "text-danger font-bold" : "text-success";
    }
    if (stressVal) {
        stressVal.innerHTML = proctorState.stressLevel;
        stressVal.className = "badge " + 
            (proctorState.stressLevel === "High" ? "bg-danger" : 
             proctorState.stressLevel === "Medium" ? "bg-warning" : "bg-success");
    }
    if (emotionVal) {
        emotionVal.innerHTML = proctorState.emotion;
    }
    if (speakSpeedVal) {
        speakSpeedVal.innerHTML = proctorState.speakingSpeed;
    }
    if (voiceToneVal) {
        voiceToneVal.innerHTML = proctorState.voiceTone;
    }
    if (faceVal) {
        if (proctorState.faceLost) {
            faceVal.innerHTML = "Face Lost";
            faceVal.className = "text-danger";
        } else if (proctorState.multipleFaces) {
            faceVal.innerHTML = "Multiple Faces";
            faceVal.className = "text-danger";
        } else {
            faceVal.innerHTML = "Detected";
            faceVal.className = "text-success";
        }
    }
    
    // Updates gauges
    const confValue = document.getElementById("confidenceValue");
    const confBar = document.getElementById("confidenceBar");
    if (confValue && confBar) {
        confValue.innerHTML = proctorState.confidenceScore + "%";
        confBar.style.width = proctorState.confidenceScore + "%";
    }
    
    const eyeValue = document.getElementById("eyeValue");
    const eyeBar = document.getElementById("eyeBar");
    if (eyeValue && eyeBar) {
        eyeValue.innerHTML = proctorState.eyeContactScore + "%";
        eyeBar.style.width = proctorState.eyeContactScore + "%";
    }
    
    const voiceValue = document.getElementById("voiceValue");
    const voiceBar = document.getElementById("voiceBar");
    if (voiceValue && voiceBar) {
        voiceValue.innerHTML = proctorState.voiceClarityScore + "%";
        voiceBar.style.width = proctorState.voiceClarityScore + "%";
    }
}

/*=========================================================
            Dynamic Loops (with simulated noise)
=========================================================*/
function updateConfidenceLoop() {
    setInterval(() => {
        if (proctorState.gazeDistracted || proctorState.multipleFaces || proctorState.faceLost) {
            proctorState.confidenceScore = Math.max(35, proctorState.confidenceScore - randomValue(2, 5));
        } else {
            proctorState.confidenceScore = Math.min(99, proctorState.confidenceScore + randomValue(-1, 2));
        }
        updateProctorScoreboard();
    }, 4000);
}

function updateEyeContactLoop() {
    setInterval(() => {
        if (proctorState.gazeDistracted) {
            proctorState.eyeContactScore = Math.max(20, proctorState.eyeContactScore - randomValue(4, 8));
        } else if (proctorState.faceLost) {
            proctorState.eyeContactScore = 0;
        } else {
            proctorState.eyeContactScore = randomValue(85, 96);
        }
        updateProctorScoreboard();
    }, 3500);
}

function updateVoiceClarityLoop() {
    setInterval(() => {
        if (proctorState.audioLost) {
            proctorState.voiceClarityScore = 0;
        } else {
            proctorState.voiceClarityScore = randomValue(90, 99);
        }
        updateProctorScoreboard();
    }, 4500);
}

function updateCodingActivityLoop() {
    const value = document.getElementById("codingValue");
    const bar = document.getElementById("codingBar");
    if (!value || !bar) return;
    
    setInterval(() => {
        let score = randomValue(80, 96);
        proctorState.codingScore = score;
        value.innerHTML = score + "%";
        bar.style.width = score + "%";
    }, 5000);
}

function updateInterviewStatusLoop() {
    const cards = document.querySelectorAll(".status-card h3");
    if (cards.length === 0) return;

    const interviewStatus = ["Answering", "Coding", "Explaining", "Analyzing"];
    
    setInterval(() => {
        if (proctorState.faceLost) {
            cards[0].innerHTML = "Face Lost";
        } else if (proctorState.multipleFaces) {
            cards[0].innerHTML = "Multiple Faces";
        } else {
            cards[0].innerHTML = interviewStatus[Math.floor(Math.random() * interviewStatus.length)];
        }
    }, 6000);
}

function updateNetworkStatusLoop() {
    const wifiIcon = document.querySelector(".fa-wifi");
    const statusText = document.querySelectorAll(".status-card h3");
    
    if (!wifiIcon) return;

    setInterval(() => {
        wifiIcon.classList.remove("text-success", "text-warning", "text-danger");
        const level = randomValue(1, 4);
        
        if (level >= 3) {
            wifiIcon.classList.add("text-success");
            if (statusText[3]) statusText[3].innerHTML = "Excellent";
        } else if (level === 2) {
            wifiIcon.classList.add("text-warning");
            if (statusText[3]) statusText[3].innerHTML = "Good";
        } else {
            wifiIcon.classList.add("text-danger");
            if (statusText[3]) statusText[3].innerHTML = "Poor";
        }
    }, 8000);
}

function updateTimelineLoop() {
    const timeline = document.querySelector(".timeline");
    if (!timeline) return;

    const liveEvents = [
        "Eye contact stable.",
        "Speech quality detected: clear articulation.",
        "Proctoring status: Secure.",
        "Candidate is formulating solution.",
        "Analyzing code structures...",
        "Confidence thresholds matching benchmark."
    ];

    setInterval(() => {
        if (proctorState.gazeDistracted || proctorState.multipleFaces || proctorState.faceLost) return; // Don't post random stuff during simulator anomalies
        
        addTimelineEvent("Live Proctor", liveEvents[Math.floor(Math.random() * liveEvents.length)]);
    }, 12000);
}

function addTimelineEvent(title, text, isAlert = false) {
    const timeline = document.querySelector(".timeline");
    if (!timeline) return;
    
    const li = document.createElement("li");
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    li.innerHTML = `
        <span class="time">${time}</span>
        <div class="timeline-content ${isAlert ? 'bg-danger-subtle text-danger' : ''}" style="${isAlert ? 'border-left:4px solid #ef4444; background: rgba(239, 68, 68, 0.08);' : ''}">
            <h6 style="${isAlert ? 'color:#ef4444;' : ''}">${title}</h6>
            <p>${text}</p>
        </div>
    `;
    
    timeline.prepend(li);
    
    if (timeline.children.length > 6) {
        timeline.removeChild(timeline.lastElementChild);
    }
}

/*=========================================================
            Live Webcam and Proctor Drawing Overlay
=========================================================*/
function initializeWebcamProctor() {
    const canvas = document.getElementById("proctorCanvas");
    if (!canvas) return;
    
    // Bind camera button
    const cameraBtn = document.getElementById("toggleCameraBtn");
    if (cameraBtn) {
        cameraBtn.addEventListener("click", toggleWebcam);
    }
    
    // Start canvas drawing loop
    startCanvasLoop();
}

function toggleWebcam() {
    const webcamVideo = document.getElementById("candidateWebcam");
    const candidateImg = document.querySelector(".candidate-video");
    const cameraBtn = document.getElementById("toggleCameraBtn");
    const cameraStatusText = document.getElementById("cameraStatusOverlay");
    
    if (!webcamVideo || !candidateImg) return;
    
    if (!proctorState.webcamActive) {
        // Request webcam access
        navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: false })
            .then(stream => {
                proctorState.webcamActive = true;
                proctorState.webcamStream = stream;
                
                webcamVideo.srcObject = stream;
                webcamVideo.style.display = "block";
                candidateImg.style.display = "none";
                
                if (cameraBtn) {
                    cameraBtn.innerHTML = '<i class="fa-solid fa-camera-slash"></i> Cam OFF';
                    cameraBtn.className = "btn btn-outline-danger";
                }
                if (cameraStatusText) {
                    cameraStatusText.innerHTML = '<i class="fa-solid fa-camera"></i> Camera ON';
                }
                
                showToast("Webcam connected successfully. AI calibration loaded.", "success");
                addTimelineEvent("System", "Recruiter enabled candidate webcam stream.");
            })
            .catch(err => {
                console.error("Camera access failed:", err);
                showToast("Camera access denied or device not found. Running simulated feed.", "warning");
                // Trigger simulated camera toggle visual
                proctorState.webcamActive = true;
                webcamVideo.style.display = "none";
                candidateImg.style.display = "block";
                
                if (cameraBtn) {
                    cameraBtn.innerHTML = '<i class="fa-solid fa-camera-slash"></i> Cam OFF';
                }
            });
    } else {
        // Shut down webcam
        proctorState.webcamActive = false;
        if (proctorState.webcamStream) {
            proctorState.webcamStream.getTracks().forEach(track => track.stop());
            proctorState.webcamStream = null;
        }
        
        webcamVideo.srcObject = null;
        webcamVideo.style.display = "none";
        candidateImg.style.display = "block";
        
        if (cameraBtn) {
            cameraBtn.innerHTML = '<i class="fa-solid fa-camera"></i> Camera';
            cameraBtn.className = "btn btn-primary";
        }
        if (cameraStatusText) {
            cameraStatusText.innerHTML = '<i class="fa-solid fa-camera-slash"></i> Camera OFF';
        }
        
        showToast("Webcam stream stopped.", "info");
        addTimelineEvent("System", "Recruiter disabled candidate webcam stream.");
    }
}

function startCanvasLoop() {
    const canvas = document.getElementById("proctorCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    function draw() {
        // Adjust canvas dimension dynamically to match display box
        const dWidth = canvas.clientWidth;
        const dHeight = canvas.clientHeight;
        if (canvas.width !== dWidth || canvas.height !== dHeight) {
            canvas.width = dWidth;
            canvas.height = dHeight;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dynamic horizontal movement to simulate face looking/swaying
        simulatedFaceX += 0.4 * simulatedFaceDir;
        if (Math.abs(simulatedFaceX) > 18) {
            simulatedFaceDir *= -1;
        }
        
        const centerX = canvas.width / 2 + simulatedFaceX;
        const centerY = canvas.height / 2 + 5;
        
        // If proctor is NOT in "Face Lost" state, draw tracking meshes
        if (!proctorState.faceLost) {
            
            // Define bounding box styles
            let boxColor = "#22c55e"; // Green default
            let boxLabel = "Rahul Kumar (ID: 101)";
            let gazeStatus = "Gaze: Screen (SECURE)";
            
            if (proctorState.gazeDistracted) {
                boxColor = "#f59e0b"; // Orange Gaze Warning
                boxLabel = "Rahul Kumar - Gaze Flagged";
                gazeStatus = "Gaze: Off-Screen (WARNING)";
            } else if (proctorState.multipleFaces) {
                boxColor = "#ef4444"; // Red alarm
                boxLabel = "WARNING: Multiple Faces Detected";
                gazeStatus = "ALERT: Unauthorized Person Present";
            }
            
            // 1. Draw Bounding Box
            ctx.strokeStyle = boxColor;
            ctx.lineWidth = 3;
            ctx.strokeRect(centerX - 80, centerY - 110, 160, 200);
            
            // 2. Draw Corner Accents
            ctx.fillStyle = boxColor;
            // Top Left
            ctx.fillRect(centerX - 85, centerY - 115, 20, 5);
            ctx.fillRect(centerX - 85, centerY - 115, 5, 20);
            // Top Right
            ctx.fillRect(centerX + 65, centerY - 115, 20, 5);
            ctx.fillRect(centerX + 80, centerY - 115, 5, 20);
            // Bottom Left
            ctx.fillRect(centerX - 85, centerY + 85, 20, 5);
            ctx.fillRect(centerX - 85, centerY + 70, 5, 20);
            // Bottom Right
            ctx.fillRect(centerX + 65, centerY + 85, 20, 5);
            ctx.fillRect(centerX + 80, centerY + 70, 5, 20);
            
            // 3. Bounding Box Headers
            ctx.font = "bold 11px sans-serif";
            ctx.fillText(boxLabel.toUpperCase(), centerX - 75, centerY - 122);
            ctx.fillStyle = "rgba(0,0,0,0.6)";
            ctx.fillRect(centerX - 80, centerY + 95, 160, 20);
            ctx.fillStyle = boxColor;
            ctx.fillText(gazeStatus, centerX - 72, centerY + 109);
            
            // 4. Draw Facial Landmarks (Dots)
            ctx.fillStyle = boxColor;
            // Left Eye
            ctx.beginPath();
            ctx.arc(centerX - 28, centerY - 25, 4, 0, Math.PI * 2);
            ctx.fill();
            // Right Eye
            ctx.beginPath();
            ctx.arc(centerX + 28, centerY - 25, 4, 0, Math.PI * 2);
            ctx.fill();
            // Nose tip
            ctx.beginPath();
            ctx.arc(centerX, centerY + 5, 3, 0, Math.PI * 2);
            ctx.fill();
            // Mouth corners
            ctx.beginPath();
            ctx.arc(centerX - 20, centerY + 40, 2, 0, Math.PI * 2);
            ctx.arc(centerX + 20, centerY + 40, 2, 0, Math.PI * 2);
            ctx.fill();
            // Smile line (Mouth)
            ctx.strokeStyle = boxColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(centerX, centerY + 30, 20, 0.1 * Math.PI, 0.9 * Math.PI);
            ctx.stroke();
            
            // 5. Gaze Vector Lines
            ctx.lineWidth = 2;
            if (proctorState.gazeDistracted) {
                // Vector pointing away
                ctx.strokeStyle = "#ef4444";
                ctx.beginPath();
                ctx.moveTo(centerX - 28, centerY - 25);
                ctx.lineTo(centerX - 130, centerY - 75);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(centerX + 28, centerY - 25);
                ctx.lineTo(centerX - 80, centerY - 75);
                ctx.stroke();
            } else {
                // Vector pointing to screen
                ctx.strokeStyle = "#22c55e";
                ctx.beginPath();
                ctx.moveTo(centerX - 28, centerY - 25);
                ctx.lineTo(centerX - 10, centerY - 15);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(centerX + 28, centerY - 25);
                ctx.lineTo(centerX + 10, centerY - 15);
                ctx.stroke();
            }
            
            // 6. Draw Multiple Faces Simulator Overlay
            if (proctorState.multipleFaces) {
                // Second box
                ctx.strokeStyle = "#ef4444";
                ctx.lineWidth = 2;
                ctx.strokeRect(centerX + 90, centerY + 20, 80, 100);
                ctx.font = "bold 9px sans-serif";
                ctx.fillStyle = "#ef4444";
                ctx.fillText("FACE 2: UNKNOWN", centerX + 90, centerY + 12);
            }
            
        } else {
            // Draw Face Lost Critical Warning Overlay
            ctx.fillStyle = "rgba(239, 68, 68, 0.15)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.strokeStyle = "#ef4444";
            ctx.lineWidth = 4;
            ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
            
            ctx.font = "bold 20px sans-serif";
            ctx.fillStyle = "#ef4444";
            ctx.textAlign = "center";
            ctx.fillText("CRITICAL ALERT: FACE LOST", canvas.width / 2, canvas.height / 2 - 10);
            ctx.font = "14px sans-serif";
            ctx.fillText("Candidate is missing from the camera frame!", canvas.width / 2, canvas.height / 2 + 15);
            ctx.textAlign = "left"; // reset
        }
        
        canvasAnimFrame = requestAnimationFrame(draw);
    }
    
    draw();
}

/*=========================================================
            Simulated speech subtitles
=========================================================*/
const candidateDialogue = {
    multithreading: [
        "In Node.js, we don't have classical threads like in Java...",
        "Instead, we use worker_threads to delegate heavy computations...",
        "This allows us to leverage multi-core CPUs without blocking the main event loop...",
        "Processes have separate memory address spaces, whereas threads share memory...",
        "Sharing memory makes context switching extremely fast between threads."
    ],
    reactHooks: [
        "React hooks allow functional components to maintain stateful logic...",
        "useEffect runs after the component renders and updates the DOM...",
        "The dependency array decides when to re-trigger the hook...",
        "If it is empty, it runs once like componentDidMount...",
        "We clean up resources by returning a callback function."
    ],
    binarySearch: [
        "Binary search cuts the search space in half with every comparison...",
        "It has a logarithmic time complexity of Big O of log N...",
        "However, the array must be sorted beforehand for binary search to work...",
        "We initialize left and right boundaries and compute the midpoint...",
        "If target is greater than mid, we move the left boundary."
    ]
};

let dialogueIndex = 0;

function updateSpeechTranscriptLoop() {
    const transcriptBar = document.getElementById("liveTranscript");
    if (!transcriptBar) return;
    
    setInterval(() => {
        if (proctorState.audioLost || proctorState.faceLost) {
            transcriptBar.innerHTML = "<span class='text-danger'>[Audio Signal Lost]</span>";
            return;
        }
        
        const dialogues = candidateDialogue[proctorState.activeQuestionKey] || candidateDialogue.multithreading;
        transcriptBar.innerHTML = `Speaking: "${dialogues[dialogueIndex]}"`;
        
        dialogueIndex = (dialogueIndex + 1) % dialogues.length;
    }, 7000);
}

/*=========================================================
            PROCTORING SIMULATOR CONTROLLER
=========================================================*/
function triggerSimulatedAnomaly(anomalyType) {
    const videoPanel = document.querySelector(".video-panel");
    
    if (anomalyType === 'tab') {
        proctorState.tabSwitches++;
        proctorState.cheatingRisk = "Medium";
        proctorState.stressLevel = "Medium";
        proctorState.confidenceScore = Math.max(45, proctorState.confidenceScore - 15);
        
        showToast(`ALERT: Candidate switched browser tabs (${proctorState.tabSwitches} times)`, "warning");
        addTimelineEvent("Warning", `Proctor detected browser tab focus change. Tab switch count: ${proctorState.tabSwitches}`, true);
        
        // Add flash styling temporarily
        if (videoPanel) {
            videoPanel.classList.add("proctor-alert-flash");
            setTimeout(() => videoPanel.classList.remove("proctor-alert-flash"), 2500);
        }
    } 
    
    else if (anomalyType === 'gaze') {
        proctorState.gazeDistracted = !proctorState.gazeDistracted;
        if (proctorState.gazeDistracted) {
            proctorState.cheatingRisk = "Medium";
            proctorState.eyeContactScore = 42;
            proctorState.confidenceScore = Math.max(50, proctorState.confidenceScore - 10);
            
            showToast("WARNING: Candidate looking away from screen", "warning");
            addTimelineEvent("Warning", "Candidate gaze shifted away from monitoring window.", true);
            
            if (videoPanel) videoPanel.classList.add("proctor-alert-flash");
        } else {
            proctorState.eyeContactScore = 90;
            if (!proctorState.multipleFaces && !proctorState.faceLost && proctorState.tabSwitches < 2) {
                proctorState.cheatingRisk = "Very Low";
            }
            showToast("Candidate gaze returned to screen.", "success");
            if (videoPanel) videoPanel.classList.remove("proctor-alert-flash");
        }
    } 
    
    else if (anomalyType === 'faces') {
        proctorState.multipleFaces = !proctorState.multipleFaces;
        if (proctorState.multipleFaces) {
            proctorState.cheatingRisk = "High";
            proctorState.cheatingScore = 85;
            proctorState.confidenceScore = 38;
            
            showToast("CRITICAL ALERT: Multiple persons detected in camera feed!", "danger");
            addTimelineEvent("Violation", "Proctor detected multiple human faces in feed.", true);
            
            if (videoPanel) videoPanel.classList.add("proctor-alert-flash");
        } else {
            if (!proctorState.gazeDistracted && !proctorState.faceLost && proctorState.tabSwitches < 2) {
                proctorState.cheatingRisk = "Very Low";
                proctorState.cheatingScore = 5;
            }
            showToast("Multiple faces resolved. Candidate single face locked.", "success");
            if (videoPanel && !proctorState.gazeDistracted && !proctorState.faceLost) {
                videoPanel.classList.remove("proctor-alert-flash");
            }
        }
    } 
    
    else if (anomalyType === 'facelost') {
        proctorState.faceLost = !proctorState.faceLost;
        if (proctorState.faceLost) {
            proctorState.cheatingRisk = "High";
            proctorState.eyeContactScore = 0;
            
            showToast("CRITICAL ALERT: Candidate face lost in frame!", "danger");
            addTimelineEvent("Violation", "Candidate camera feed reports no face detected.", true);
            
            if (videoPanel) videoPanel.classList.add("proctor-alert-flash");
        } else {
            proctorState.eyeContactScore = 88;
            if (!proctorState.gazeDistracted && !proctorState.multipleFaces) {
                proctorState.cheatingRisk = "Very Low";
            }
            showToast("Face detection lock re-established.", "success");
            if (videoPanel && !proctorState.gazeDistracted && !proctorState.multipleFaces) {
                videoPanel.classList.remove("proctor-alert-flash");
            }
        }
    }
    
    else if (anomalyType === 'mic') {
        proctorState.audioLost = !proctorState.audioLost;
        if (proctorState.audioLost) {
            proctorState.voiceClarityScore = 0;
            showToast("ALERT: Microphone signal interrupted.", "danger");
            addTimelineEvent("Hardware Error", "Audio feed lost. Please check candidate mic connection.", true);
        } else {
            proctorState.voiceClarityScore = 96;
            showToast("Microphone audio feed restored.", "success");
        }
    }
    
    updateProctorScoreboard();
    if (typeof forceChartAnomalyTrigger === "function") {
        forceChartAnomalyTrigger();
    }
}

// Map helper to show standard toasts
function showToast(message, type) {
    if (typeof createToast === "function") {
        createToast(message, type);
    } else {
        console.log(`[Toast ${type}] ${message}`);
    }
}

// Make globally accessible
window.triggerSimulatedAnomaly = triggerSimulatedAnomaly;
window.proctorState = proctorState;