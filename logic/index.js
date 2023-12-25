// import soundAnalyzer from '../logic/sound_analyzer'

import SoundAnalyzer  from "../logic/sound_analyzer.js";

/**
 * Analizador de sonido
 */
let soundAnalyzer = new SoundAnalyzer()

//? Variables iniciales

let inputFileElement = document.getElementById('input_file')

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