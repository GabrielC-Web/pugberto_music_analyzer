import {PugbertoAnimation} from './pugbertoAnimation/library/pugbertoAnimation.js'

import {SoundDataExtractor} from './soundAnalyser/soundAnalyser.js'

//? Control de pugbertos

let pugbertos = []

let initialPugbertoSpeed = 100

/**
 * Crea los pugbertos
 */
function createPugbertos() {
    pugbertos.push(new PugbertoAnimation({target:'#first', dimentions: {width: '100%', height: '100%'}}))
    pugbertos.push(new PugbertoAnimation({target:'#second', dimentions: {width: '100%', height: '100%'}}))
    pugbertos.push(new PugbertoAnimation({target:'#middle', dimentions: {width: '100%', height: '100%'}}))
    pugbertos.push(new PugbertoAnimation({target:'#third', dimentions: {width: '100%', height: '100%'}}))
    pugbertos.push(new PugbertoAnimation({target:'#last', dimentions: {width: '100%', height: '100%'}}))
}

//* Creo los pugbertos
createPugbertos()

/**
 * Reproduce la animación de pugberto
 */
function playPugbertos() {
    pugbertos.forEach(pugberto => {
        pugberto.startAnimation()    
    })
}

/**
 * Pausa la animación de pugberto
 */
function pausePugbertos() {
    pugbertos.forEach(pugberto => {
        pugberto.stopAnimation() 
    })
}

//////////////////////////////////////////////////////////////////////////////////////////////

//? Control de analizador de audio

let audioAnalyser = new SoundDataExtractor({
    inputId: '#input_file',
    playerId: '#audio_player',
})

/**
 * Escucho los eventos del audioAnalyser
 */
document.addEventListener('audioFrequencyData', (e) => {

    //* Proceso las frecuencias
    processFrequencyData(e.detail.averageFrequencySpeed)

})

/**
 * 
 * @param {*} frequencyArray 
 */
function processFrequencyData(averagePlaybackSpeed) {

    //* Calcula el valor para el framerate de pugberto (Mientras menor el número mayor el fps)
    initialPugbertoSpeed = Math.floor(500 * averagePlaybackSpeed / 100 / 100)

    //* Verifico que la velocidad sea un número válido
    if(initialPugbertoSpeed != NaN && initialPugbertoSpeed != Infinity) {

        //* Actualizo la velocidad de cada pugberto
        pugbertos.forEach(pugberto => {
            pugberto.speed = initialPugbertoSpeed

            //* Cambio el color de los pugbertos
            pugberto.modifyStyle({hueRotation: Math.floor((averagePlaybackSpeed * 360 / 100)), saturation: '500%'})
        })

        //* Los pugbertos de numero impar irán a la mitad de la velocidad y mantendrán su color base
        pugbertos[1].speed = 6
        pugbertos[3].speed = 6

        pugbertos[1].modifyStyle({hueRotation: 360, saturation: '100%'})
        pugbertos[3].modifyStyle({hueRotation: 360, saturation: '100%'})

    }


}

//////////////////////////////////////////////////////////////////////////////////////////////

//? Cambio de apariencia de controles

/**
 * Ícono de reproducción
 */
let $reproductionIcon = document.getElementById('reproduction_icon')

/**
 * Botón de reproducción
 */
let $reproductionButton = document.getElementById('reproduction_control')

//////////////////////////////////////////////////////////////////////////////////////////////


/**
 * Botón de archivo
 */
let $fileButton = document.getElementById('input_file_container')

/**
 * Ícono de archivo
 */
let $fileIcon = document.getElementById('file_icon')

/**
 * Indica si hay archivo cargado
 */
let isFileLoaded = false

//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Escucho el click del botón de reproducción
 */
$reproductionButton.addEventListener('click', () => {
    audioAnalyser.toggleAudioReproduction()
})

/**
 * Escucho los eventos del audioAnalyser
 */
document.addEventListener('audioAnalyserData', (e) => {

    //* Proceso la data del reporte
    processAudioAnalyserData(e.detail)

})


/**
 * Se encarga de llamar a todas las funciones para procesar la data del reporte
 * @param {*} data 
 */
function processAudioAnalyserData(data) {

    //* Cambio el ícono del input
    changeFileIcon({fileLoaded: data.fileLoaded})
    
    //* Cambio el ícono de reproducción
    changeControlButton(data.reproductionState)

    //* Obtengo el nombre del archivo
    getFileName(data.fileName)

}


//? Eventos en los controles

$fileButton.addEventListener('mouseover', () => {

    changeFileIcon({fileLoaded: isFileLoaded,mouseover: true})
})

$fileButton.addEventListener('mouseout', () => {

    changeFileIcon({fileLoaded: isFileLoaded,mouseout: true})
})

$fileButton.addEventListener('click', () => {

    if(isFileLoaded) {
        audioAnalyser.removeFile()
        pausePugbertos()
    }

})

//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Cambia el ícono del botón de reproducir audio
 * @param {*} reproductionState 
 */
function changeControlButton(reproductionState) {

    //* Si el archivo está cargado muestro el botón
    if(isFileLoaded) {
        $reproductionButton.classList.remove('!hidden')
    } else {
        $reproductionButton.classList.add('!hidden')
    }

    //* Cambio el ícono y reproduzco la animación
    if(reproductionState == 'playing') {
        $reproductionIcon.innerHTML = 'pause'
        playPugbertos()
    } else {
        $reproductionIcon.innerHTML = 'play_arrow'
        pausePugbertos()
    }

}

/**
 * Cambia el ícono del botón de archivo
 */
function changeFileIcon(config) {

    //* Indico si el archivo está cargado
    isFileLoaded = config.fileLoaded

    //* Si hay evento de mouseover
    if(config.mouseover) {

        
        //* Si el archivo está cargado
        if(isFileLoaded) {

            //* Cambio la apariencia del botón
            $fileButton.classList.add('!bg-red-500')

            $fileIcon.innerHTML = 'delete'
        } else {
            $fileIcon.innerHTML = 'upload'

            $fileButton.classList.remove('!bg-red-500')
        }

        //* Si hay evento de mouse fuera
    } else if(config.mouseout) {

        //* Cambio la apariencia del botón
        $fileButton.classList.remove('!bg-red-500')

        //* Si el archivo está cargado
        if(isFileLoaded) {
            $fileIcon.innerHTML = 'audio_file'
        } else {
            $fileIcon.innerHTML = 'upload'
        }
        
        //* En cualquier otro caso
    } else {

        //* Cambio la apariencia del botón
        $fileButton.classList.remove('!bg-red-500')

        //* Si el archivo está cargado
        if(isFileLoaded) {
            $fileIcon.innerHTML = 'audio_file'
        } else {
            $fileIcon.innerHTML = 'upload'
        }
    }

}

//////////////////////////////////////////////////////////////////////////////////////////////

//? Título del archivo

/**
 * Obtiene el nombre del archivo cargado
 * @param {*} fileName 
 * @returns 
 */
function getFileName(fileName) {

    let titleCarousel = document.getElementById('file_title_carousel')

    //* Si no hay nombre de archivo no hago nada
    if(!fileName) {

        titleCarousel.innerHTML= ''
        return
    }

    //* Creo los elementos con el nombre del archivo
    titleCarousel.insertAdjacentHTML('afterbegin', `
        <!-- Contenedor de animación de los textos -->
        <div class="text-container">
            <h3 class="text-element">- ♫ - ${fileName}&nbsp</h3>
            <h3 class="text-element">- ♫ - ${fileName}&nbsp</h3>
            <h3 class="text-element">- ♫ - ${fileName}&nbsp</h3>
        </div>

        <!-- Contenedor de animación de los textos -->
        <div class="text-container">
            <h3 class="text-element">- ♫ - ${fileName}&nbsp</h3>
            <h3 class="text-element">- ♫ - ${fileName}&nbsp</h3>
            <h3 class="text-element">- ♫ - ${fileName}&nbsp</h3>
        </div>
    `)
    
}


//////////////////////////////////////////////////////////////////////////////////////////////