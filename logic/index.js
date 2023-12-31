// import soundAnalyzer from '../logic/sound_analyzer'

import SoundAnalyzer  from "../logic/sound_analyzer.js";

/**
 * Analizador de sonido
 */
let soundAnalyzer = new SoundAnalyzer()

//? Variables iniciales

let inputFileElement = document.getElementById('input_file')

let controllerWrapper = document.getElementById('control_wrapper')

/**
 * Input de archivo
 */
let fileInput = document.getElementById('file')

//? Listeners

/**
 * Escucha el evento de cambio del input
 */
fileInput?.addEventListener('change', (e) => {
    soundAnalyzer.getFile(e.target)
})

/**
 * Escucha el evento de click del input de archivo
 */
inputFileElement?.addEventListener('click', (e) => {
    fileInput.click()
})

document.addEventListener('animationloaded', () => {

    if(!controllerWrapper.style.opacity || controllerWrapper.style.opacity != '0') {

        // controllerWrapper.classList.add('invisible')
    }
})

document.addEventListener('mouseover', () => {
    controllerWrapper.classList.remove('invisible')
})
document.addEventListener('click', () => {
    controllerWrapper.classList.remove('invisible')
})
document.addEventListener('focus', () => {
    controllerWrapper.classList.remove('invisible')
})
document.addEventListener('mousemove', () => {
    controllerWrapper.classList.remove('invisible')
})
document.addEventListener('touchstart', () => {
    controllerWrapper.classList.remove('invisible')
})
document.addEventListener('touchmove', () => {
    controllerWrapper.classList.remove('invisible')
})

document.addEventListener('pointerenter', (e) => {
    controllerWrapper.classList.remove('invisible')
})