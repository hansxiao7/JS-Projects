class Timer{
    constructor(durationInput, startBtn, pauseBtn, callbacks = {}){
        this.durationInput = durationInput;
        this.startBtn = startBtn;
        this.pauseBtn = pauseBtn;
        if (callbacks){
            this.onStart = callbacks.onStart;
            this.onTick = callbacks.onTick;
            this.onComplete = callbacks.onComplete;
        }

        this.startBtn.addEventListener('click', this.start);
        this.pauseBtn.addEventListener('click', this.pause);
    }

    start = () =>{
        // start to tick
        if (this.onStart){
            this.onStart(this.timeRemaining);
        }
        this.tick();
        this.interval = setInterval(this.tick, 50);
    }

    pause = ()=>{
        if (this.onPause){
            this.onPause();
        }

        clearInterval(this.interval);
    }

    onDurationChange(){


    }

    tick = () =>{
        if (this.onTick) this.onTick();

        this.timeRemaining = this.timeRemaining - 0.05;

        if (this.timeRemaining <= 0) {
            if (this.onComplete) this.onComplete();
            this.pause();
        }
    }

    get timeRemaining(){
        return parseFloat(this.durationInput.value);
    }

    set timeRemaining(time){
        this.durationInput.value = time.toFixed(2);
    }

}
