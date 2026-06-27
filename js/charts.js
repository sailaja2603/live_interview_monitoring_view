/*=========================================================
            CHARTS.JS
    AI Live Interview Monitoring - Dashboard Charts
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {
    initializeCharts();
});

/*=========================================================
            Global Chart Variables
=========================================================*/
let performanceChart = null;
let skillRadarChart = null;

// Keep track of chart datasets
let chartTimeLabels = ["0", "2", "4", "6", "8", "10", "12"];
let datasetConfidence = [80, 85, 87, 90, 92, 92, 92];
let datasetGaze = [78, 80, 83, 85, 89, 89, 89];
let datasetVoice = [82, 85, 88, 91, 95, 95, 95];

/*=========================================================
            Initialize Charts
=========================================================*/
function initializeCharts() {
    initializePerformanceChart();
    initializeSkillRadarChart();
    startRealtimeChartUpdates();
}

function initializePerformanceChart() {
    const canvas = document.getElementById("performanceChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    performanceChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: chartTimeLabels,
            datasets: [
                {
                    label: "Confidence Score",
                    data: datasetConfidence,
                    borderColor: "#2563eb",
                    backgroundColor: "rgba(37,99,235,0.08)",
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 7
                },
                {
                    label: "Eye Gaze Focus",
                    data: datasetGaze,
                    borderColor: "#22c55e",
                    backgroundColor: "rgba(34,197,94,0.05)",
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4
                },
                {
                    label: "Speech Clarity",
                    data: datasetVoice,
                    borderColor: "#f59e0b",
                    backgroundColor: "rgba(245,158,11,0.05)",
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: "index",
                intersect: false
            },
            plugins: {
                legend: {
                    position: "top",
                    labels: {
                        font: { size: 11, family: "'Poppins', sans-serif" },
                        boxWidth: 12
                    }
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 100,
                    ticks: { stepSize: 20, font: { size: 10 } },
                    grid: { color: "rgba(0,0,0,0.05)" }
                },
                x: {
                    ticks: { font: { size: 10 } },
                    grid: { display: false }
                }
            }
        }
    });
}

function initializeSkillRadarChart() {
    const canvas = document.getElementById("skillRadarChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    
    // Skill Radar defaults
    skillRadarChart = new Chart(ctx, {
        type: "radar",
        data: {
            labels: [
                "Technical Logic", 
                "Communication", 
                "Gaze Stability", 
                "Stress Control", 
                "Coding Pacing"
            ],
            datasets: [{
                label: "Candidate Profile (Rahul Kumar)",
                data: [90, 95, 89, 92, 88],
                borderColor: "#2563eb",
                backgroundColor: "rgba(37,99,235,0.15)",
                borderWidth: 2.5,
                pointBackgroundColor: "#2563eb",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#2563eb"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                r: {
                    angleLines: { color: "rgba(0,0,0,0.08)" },
                    grid: { color: "rgba(0,0,0,0.08)" },
                    pointLabels: {
                        font: { size: 11, weight: "bold", family: "'Poppins', sans-serif" }
                    },
                    ticks: { display: false },
                    min: 0,
                    max: 100
                }
            }
        }
    });
}

/*=========================================================
            Real-Time Chart Sync
=========================================================*/
function startRealtimeChartUpdates() {
    setInterval(() => {
        if (!performanceChart) return;
        
        // Grab state from proctorState in live-status.js
        let currentConf = 90;
        let currentGaze = 88;
        let currentVoice = 95;
        let currentCoding = 88;
        
        if (window.proctorState) {
            currentConf = window.proctorState.confidenceScore;
            currentGaze = window.proctorState.eyeContactScore;
            currentVoice = window.proctorState.voiceClarityScore;
            currentCoding = window.proctorState.codingScore;
        }
        
        // Generate new label (increment minutes)
        let lastLabel = parseInt(chartTimeLabels[chartTimeLabels.length - 1]);
        let nextLabel = String(lastLabel + 2);
        
        // Shift time labels and push new
        chartTimeLabels.shift();
        chartTimeLabels.push(nextLabel);
        
        // Update datasets
        datasetConfidence.shift();
        datasetConfidence.push(currentConf);
        
        datasetGaze.shift();
        datasetGaze.push(currentGaze);
        
        datasetVoice.shift();
        datasetVoice.push(currentVoice);
        
        performanceChart.update();
        
        // Update Radar chart dynamically to reflect state changes
        if (skillRadarChart) {
            // Update radar values
            // Logic, Communication, Gaze, Stress, Speed
            let stressScore = 95; // Default low stress -> high score
            if (window.proctorState) {
                if (window.proctorState.stressLevel === "High") stressScore = 30;
                else if (window.proctorState.stressLevel === "Medium") stressScore = 60;
            }
            
            skillRadarChart.data.datasets[0].data = [
                90, // Logic
                currentVoice, // Communication
                currentGaze, // Gaze Stability
                stressScore, // Stress Control
                currentCoding // Coding Speed
            ];
            skillRadarChart.update();
        }
        
        // Update the textual AI Insights values based on scores
        updateTextInsights(currentConf, currentGaze, currentVoice, stressScore);
        
    }, 5000);
}

// Immediate chart update on simulator anomalies
function forceChartAnomalyTrigger() {
    if (!performanceChart || !window.proctorState) return;
    
    // Immediately replace last item in datasets to draw visual dip
    datasetConfidence[datasetConfidence.length - 1] = window.proctorState.confidenceScore;
    datasetGaze[datasetGaze.length - 1] = window.proctorState.eyeContactScore;
    datasetVoice[datasetVoice.length - 1] = window.proctorState.voiceClarityScore;
    
    performanceChart.update();
    
    if (skillRadarChart) {
        let stressScore = 95;
        if (window.proctorState.stressLevel === "High") stressScore = 30;
        else if (window.proctorState.stressLevel === "Medium") stressScore = 60;
        
        skillRadarChart.data.datasets[0].data = [
            90,
            window.proctorState.voiceClarityScore,
            window.proctorState.eyeContactScore,
            stressScore,
            window.proctorState.codingScore
        ];
        skillRadarChart.update();
    }
    
    updateTextInsights(
        window.proctorState.confidenceScore, 
        window.proctorState.eyeContactScore, 
        window.proctorState.voiceClarityScore,
        window.proctorState.stressLevel === "High" ? 30 : (window.proctorState.stressLevel === "Medium" ? 60 : 95)
    );
}

/*=========================================================
            Text-based AI Insights Updater
=========================================================*/
function updateTextInsights(conf, gaze, voice, stress) {
    const confStatus = document.getElementById("insightConfStatus");
    const confText = document.getElementById("insightConfText");
    const proctorStatus = document.getElementById("insightProctorStatus");
    const proctorText = document.getElementById("insightProctorText");
    
    if (!window.proctorState) return;
    
    // Confidence and Cognitive Insights
    if (confStatus && confText) {
        confStatus.innerHTML = `${conf >= 90 ? 'High' : conf >= 70 ? 'Moderate' : 'Low'} (${conf}%)`;
        confStatus.className = `badge ${conf >= 90 ? 'bg-success' : conf >= 70 ? 'bg-warning' : 'bg-danger'}`;
        
        if (conf >= 90) {
            confText.innerHTML = "Candidate responds quickly, showing vocal consistency and robust logic structure.";
        } else if (conf >= 70) {
            confText.innerHTML = "Vocal tone exhibits mild hesitation. Speech pace is slightly disrupted during code compilation.";
        } else {
            confText.innerHTML = "Significant stress detected. Speaking pace is erratic or silent, indicating potential difficulty.";
        }
    }
    
    // Proctor compliance Insights
    if (proctorStatus && proctorText) {
        if (window.proctorState.faceLost) {
            proctorStatus.innerHTML = "CRITICAL WARNING";
            proctorStatus.className = "badge bg-danger";
            proctorText.innerHTML = "Proctor Alarm: Candidate face is missing from the camera window! Flagged for review.";
        } else if (window.proctorState.multipleFaces) {
            proctorStatus.innerHTML = "MULTIPLE PERSONS";
            proctorStatus.className = "badge bg-danger";
            proctorText.innerHTML = "Security Breach: More than one face detected within the camera coordinates.";
        } else if (window.proctorState.gazeDistracted) {
            proctorStatus.innerHTML = "GAZE FLAGGED";
            proctorStatus.className = "badge bg-warning";
            proctorText.innerHTML = "Proctor Warning: Candidate looking away from the primary compiler window repeatedly.";
        } else if (window.proctorState.tabSwitches > 0) {
            proctorStatus.innerHTML = `TAB SWITCH (${window.proctorState.tabSwitches})`;
            proctorStatus.className = "badge bg-danger";
            proctorText.innerHTML = `Violation Logged: Candidate toggled application tabs. Tab switch count: ${window.proctorState.tabSwitches}.`;
        } else {
            proctorStatus.innerHTML = "SECURE";
            proctorStatus.className = "badge bg-success";
            proctorText.innerHTML = "Gaze vectors are aligned with screen center. No unregistered objects or second persons detected.";
        }
    }
}

/*=========================================================
            Tab Swapping within Card
=========================================================*/
function switchPerformanceView(view) {
    const trendsView = document.getElementById("perfTrendsView");
    const radarView = document.getElementById("perfRadarView");
    const insightsView = document.getElementById("perfInsightsView");
    
    const btnTrends = document.getElementById("btnLiveTrends");
    const btnRadar = document.getElementById("btnSkillRadar");
    const btnInsights = document.getElementById("btnAiInsights");
    
    if (!trendsView || !radarView || !insightsView) return;
    
    // Hide all
    trendsView.classList.add("d-none");
    radarView.classList.add("d-none");
    insightsView.classList.add("d-none");
    
    btnTrends.classList.remove("active");
    btnRadar.classList.remove("active");
    btnInsights.classList.remove("active");
    
    // Show selected
    if (view === 'trends') {
        trendsView.classList.remove("d-none");
        btnTrends.classList.add("active");
    } else if (view === 'radar') {
        radarView.classList.remove("d-none");
        btnRadar.classList.add("active");
    } else if (view === 'insights') {
        insightsView.classList.remove("d-none");
        btnInsights.classList.add("active");
    }
}

// Make accessible
window.switchPerformanceView = switchPerformanceView;
window.forceChartAnomalyTrigger = forceChartAnomalyTrigger;