document.addEventListener('DOMContentLoaded', function () {
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const startButton = document.getElementById('start');
    const resetButton = document.getElementById('reset');
    const taskInput = document.getElementById('task');
    const taskList = document.getElementById('taskList');
    const timerLabel = document.getElementById('timerLabel');
    const completedPomodoros = document.getElementById('completedPomodoros');
    const notificationSound = new Audio('beep.mp3');
    
    const pomodoroLengthInput = document.getElementById('pomodoroLength');
    const smallBreakLengthInput = document.getElementById('smallBreakLength');
    const longBreakLengthInput = document.getElementById('longBreakLength');
    
    const increaseButtons = document.querySelectorAll('.increase');
    const decreaseButtons = document.querySelectorAll('.decrease');
    
    increaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            updateLength(button, 1);
            updateLabels();
        });
    });

    decreaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            updateLength(button, -1);
            updateLabels();
        });
    });
    
    
    const skipBtn = document.getElementById("skip");
    
    let hideSkip = (hide) => {

      if (!hide) {
          skipBtn.removeAttribute("hidden");
      } else {
          skipBtn.setAttribute("hidden", "hidden");
      }
    }
    
    let timer;
    let minutes = 25;
    let seconds = 0;
    let pomodoroCount = 0;
    let isWorking = true;
    const workDuration = 25;
    const shortBreakDuration = 5;
    const longBreakDuration = 15;
    const pomodorosUntilLongBreak = 4;
    
    startButton.addEventListener('click', toggleTimer);
    resetButton.addEventListener('click', resetTimer);
    skipBtn.addEventListener('click', skipToNext);
    
    updateDisplay()
    
    function toggleTimer() {
        if (!timer) {
            timer = setInterval(updateTimer, 1000);
            startButton.textContent = 'Pause';
            hideSkip(false);
        } else {
            clearInterval(timer);
            timer = null;
            startButton.textContent = 'Resume';
            hideSkip(true);
        }
    }
    
    function updateTimer() {
        if (seconds > 0) {
            seconds--;
        } else if (minutes > 0) {
            minutes--;
            seconds = 59;
        } else {
            notificationSound.play();
            clearInterval(timer);
            timer = null;
            if (isWorking) {
                if(pomodoroCount === (pomodorosUntilLongBreak-1)){
                    minutes = parseInt(longBreakLengthInput.textContent);
                }else{
                    minutes = parseInt(smallBreakLengthInput.textContent);
                }
                isWorking = false;
                startButton.textContent = 'Start';
                updateDisplay();
                pomodoroCount++;
                updateCompletedPomodoros();
                fillPomodoroIcon(pomodoroCount);
            } else {
                startButton.textContent = 'Start';
                fillBreakIcon(pomodoroCount);
                if (pomodoroCount === pomodorosUntilLongBreak) {
                    clearIcons()
                    minutes = parseInt(pomodoroLengthInput.textContent);
                    pomodoroCount = 0;
                } else {
                    minutes = parseInt(pomodoroLengthInput.textContent);
                }
                isWorking = true;
            }
        }
        updateDisplay();
    }
    
    function updateLength(button, change) {
        const targetInput = button.parentElement.querySelector('span');
        const newValue = parseInt(targetInput.textContent) + change;
        if (newValue >= 1) {
            targetInput.textContent = newValue;
            if (isWorking) {
                minutes = parseInt(pomodoroLengthInput.textContent);
            } else if (pomodoroCount === pomodorosUntilLongBreak) {
                minutes = parseInt(longBreakLengthInput.textContent);
            } else {
                minutes = parseInt(smallBreakLengthInput.textContent);
            }
            updateDisplay();
            updateCompletedPomodoros();
        }
    }
    
    function resetTimer() {
        hideSkip(true);
        clearInterval(timer);
        timer = null;
        seconds = 0;
        startButton.textContent = 'Start';
        if (isWorking) {
            minutes = parseInt(pomodoroLengthInput.textContent);
        } else if (pomodoroCount === pomodorosUntilLongBreak) {
            minutes = parseInt(longBreakLengthInput.textContent);
        } else {
            minutes = parseInt(smallBreakLengthInput.textContent);
        }
        updateDisplay();
    }
    
    function skipToNext(){
        seconds = 0;
        minutes = 0;
        hideSkip(true);
    }
    
    function updateDisplay() {
        minutesDisplay.textContent = minutes < 10 ? `0${minutes}` : minutes;
        secondsDisplay.textContent = seconds < 10 ? `0${seconds}` : seconds;
        timerLabel.textContent = isWorking ? 'Work' : 'Break';
        updateCompletedPomodoros();
    }
    
    function updateCompletedPomodoros() {
        completedPomodoros.textContent = pomodoroCount + '/' + pomodorosUntilLongBreak;
    }
    
    
    function fillPomodoroIcon(completedPomodoros) {
        const pomodoroIcons = document.querySelectorAll('.pomodoro-icon');
        pomodoroIcons.forEach((icon, index) => {
            if (index < completedPomodoros) {
                icon.style.backgroundColor = '#007bff';
            } else {
                icon.style.backgroundColor = 'transparent';
                icon.textContent = '';
            }
        });
    }

    function fillBreakIcon(completedBreaks) {
        const breakIcons = document.querySelectorAll('.break-icon');
        breakIcons.forEach((icon, index) => {
            if (index < completedBreaks) {
                icon.style.backgroundColor = '#007bff';
            } else {
                icon.style.backgroundColor = 'transparent';
                icon.textContent = '';
            }
        });
    }
    
    function updateLabels() {
        const pomodoroLengthLabel = document.getElementById('pomodoroLengthLabel');
        pomodoroLengthLabel.textContent = pomodoroLengthInput.textContent;
        
        const breakLengthLabel = document.getElementById('breakLengthLabel');
        breakLengthLabel.textContent = smallBreakLengthInput.textContent;
        
        const longBreakLengthLabel = document.getElementById('longBreakLengthLabel');
        longBreakLengthLabel.textContent = longBreakLengthInput.textContent;
    }
    
    function clearIcons() {
        const pomodoroIcons = document.querySelectorAll('.pomodoro-icon');
        const breakIcons = document.querySelectorAll('.break-icon');

        pomodoroIcons.forEach(icon => {
            icon.style.backgroundColor = 'transparent';
        });

        breakIcons.forEach(icon => {
            icon.style.backgroundColor = 'transparent';
        });
    }


    
    taskInput.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' && taskInput.value.trim() !== '') {
        const newTask = document.createElement('li');
        newTask.textContent = taskInput.value;
        newTask.addEventListener('click', function() {
            taskList.removeChild(newTask);
        });
        taskList.appendChild(newTask);
        taskInput.value = '';
        newTask.dataset.index = taskList.children.length - 1;
      }
    });
});
