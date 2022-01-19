
const confetti = require('canvas-confetti');
const ConfettiShow = (function(exports){
    const count = 50;
    const defaultOpations = {
        shapes: ['circle'],
        colors: ['#286ef1', '#fc7398', '#76a5fd', '#ac86ff']
    }
    function play(targetCanvas){
        const myConfetti = confetti.create(document.querySelector(targetCanvas), { resize: true, useWorker: true });
        function fire(particleRatio,opts) {
            myConfetti({ 
                particleCount: Math.floor(count * particleRatio),
                ...defaultOpations,
                ...opts
            })
        };

        fire(0.25, { startVelocity: 15, spread: 360,angle: 90, ticks: 120, scalar:1.2});
        setTimeout(()=>{
            fire(0.35, { startVelocity: 30, spread: 150, ticks: 150, scalar:1.3});
        }, 50)
        setTimeout(()=>{
            fire(0.1, { startVelocity: 10, spread: 360, ticks: 100, scalar:1.2});
        }, 80)
    }
    exports.play = play;
    return exports;
})({});
export default ConfettiShow;

document.querySelector('button').addEventListener('click', e=>{ 
    ConfettiShow.play( '#canvas-confetti' )
});



// import { gsap } from "gsap";
// gsap.to('.box', 1, {x: 100, delay: 1})

