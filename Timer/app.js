const startBtn = document.querySelector('#start');
const pauseBtn = document.querySelector('#pause');
const durationInput = document.querySelector('#duration');

const circle = document.querySelector('circle');
const perimeter = circle.getAttribute('r') * 2 * Math.PI;
circle.setAttribute('stroke-dasharray', perimeter)
let currOffset = 0;
let durartion;

const timer = new Timer(durationInput, startBtn, pauseBtn, {
    onStart(totalDuration){
        durartion = totalDuration;
        currOffset = 0;
        circle.style.strokeDasharray = perimeter;
    },

    onTick(){
        circle.style.strokeDashoffset = currOffset;
        const diff = perimeter / (durartion / 0.05);
        currOffset = currOffset - diff;
    },

    onComplete(){
        circle.style.strokeDashoffset = perimeter;
    }

});