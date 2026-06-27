/*=========================================================
            TIMER.JS
    AI Live Interview Monitoring Dashboard
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeInterviewTimer();

});

/*=========================================================
            Global Variables
=========================================================*/

let elapsedSeconds = 0;
let interviewTimer = null;
let timerRunning = false;

/*=========================================================
            Initialize Timer
=========================================================*/

function initializeInterviewTimer() {

    updateTimerDisplay();

    startInterviewTimer();

    initializeControlButtons();

}

/*=========================================================
            Start Timer
=========================================================*/

function startInterviewTimer() {

    if (timerRunning) return;

    timerRunning = true;

    interviewTimer = setInterval(() => {

        elapsedSeconds++;

        updateTimerDisplay();

        checkInterviewMilestones();

    }, 1000);

}

/*=========================================================
            Pause Timer
=========================================================*/

function pauseInterviewTimer() {

    clearInterval(interviewTimer);

    timerRunning = false;

}

/*=========================================================
            Resume Timer
=========================================================*/

function resumeInterviewTimer() {

    if (!timerRunning) {

        startInterviewTimer();

    }

}

/*=========================================================
            Reset Timer
=========================================================*/

function resetInterviewTimer() {

    pauseInterviewTimer();

    elapsedSeconds = 0;

    updateTimerDisplay();

}

/*=========================================================
            Format Time
=========================================================*/

function formatTime(totalSeconds) {

    const hours = Math.floor(totalSeconds / 3600);

    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const seconds = totalSeconds % 60;

    return (
        String(hours).padStart(2, "0") + ":" +
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0")
    );

}

/*=========================================================
            Update Display
=========================================================*/

function updateTimerDisplay() {

    const timerElement = document.getElementById("liveTimer");

    if (!timerElement) return;

    timerElement.textContent = formatTime(elapsedSeconds);

}

/*=========================================================
            Timer Controls
=========================================================*/

function initializeControlButtons() {

    const pauseButton = document.getElementById("pauseTimer");
    const resumeButton = document.getElementById("resumeTimer");
    const resetButton = document.getElementById("resetTimer");

    if (pauseButton) {

        pauseButton.addEventListener("click", pauseInterviewTimer);

    }

    if (resumeButton) {

        resumeButton.addEventListener("click", resumeInterviewTimer);

    }

    if (resetButton) {

        resetButton.addEventListener("click", resetInterviewTimer);

    }

}

/*=========================================================
            Interview Milestones
=========================================================*/

function checkInterviewMilestones() {

    switch (elapsedSeconds) {

        case 60:
            showTimerNotification(
                "1 minute completed.",
                "info"
            );
            break;

        case 300:
            showTimerNotification(
                "5 minutes completed.",
                "success"
            );
            break;

        case 600:
            showTimerNotification(
                "10 minutes completed.",
                "warning"
            );
            break;

        case 900:
            showTimerNotification(
                "15 minutes completed.",
                "info"
            );
            break;

        case 1800:
            showTimerNotification(
                "30 minutes completed.",
                "success"
            );
            break;

    }

}

/*=========================================================
            Timer Notification
=========================================================*/

function showTimerNotification(message, type) {

    if (typeof createToast === "function") {

        createToast(message, type);

        return;

    }

    console.log(message);

}

/*=========================================================
            Simulated Interview Duration
=========================================================*/

function getInterviewDuration() {

    return formatTime(elapsedSeconds);

}

/*=========================================================
            Public Helper
=========================================================*/

window.getInterviewDuration = getInterviewDuration;

/*=========================================================
            Console
=========================================================*/

console.log("Interview Timer Initialized Successfully");