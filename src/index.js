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

        //* Detengo a todos los pugbertos
        pugberto.stopAnimation()

        //* Le devuelvo el color original a todos
        pugberto.modifyStyle({hueRotation: 360, saturation: '100%'})
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
        //* Si la velocidad promedio es muy baja, entonces significa que todos los pugbertos están detenidos
        pugbertos[1].speed = averagePlaybackSpeed > 10 ? 6: 0
        pugbertos[3].speed = averagePlaybackSpeed > 10 ? 6: 0

        pugbertos[1].modifyStyle({hueRotation: 360, saturation: '100%'})
        pugbertos[3].modifyStyle({hueRotation: 360, saturation: '100%'})

    }


}

//////////////////////////////////////////////////////////////////////////////////////////////

//? Cambio de apariencia de controles

/**
 * Container del control de audio
 */
let $audioControlContainer = document.getElementById('audio_control_container')

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

/**
 * Elemento de reproducción de audio
 */
let $audioElement = document.getElementById('audio_player')

/**
 * Elemento de vista y control del progreso del audio
 */
let $audioTimeline = document.getElementById('audio_progress')

/**
 * Indica el tiempo actual y la duración del audio
 */
let $audioMoment = document.getElementById('audio_moment')

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

$audioElement.addEventListener('timeupdate', (e) => {

    //* Cambio el momento del audio
    $audioMoment.innerHTML = getAudioMinutes($audioElement.currentTime) +  ' / ' + getAudioMinutes($audioElement.duration)

    changeTimelinePosition()
})

$audioTimeline.addEventListener('change', changeProgress);
  
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Cambia el ícono del botón de reproducir audio
 * @param {*} reproductionState 
 */
function changeControlButton(reproductionState) {

    //* Si el archivo está cargado muestro el botón
    if(isFileLoaded) {
        $audioControlContainer.classList.remove('!invisible')
    } else {
        $audioControlContainer.classList.add('!invisible')
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

/**
 * Cambia la posición del track para mostrar el progreso
 */
function changeTimelinePosition () {

    const percentagePosition = (100*$audioElement.currentTime) / $audioElement.duration;
    $audioTimeline.style.backgroundSize = `${percentagePosition}% 100%`;
    $audioTimeline.value = percentagePosition;
}

/**
 * Cambia el progreso del audio de acuerdo a la posición del track
 */
function changeProgress () {

    const time = ($audioTimeline.value * $audioElement.duration) / 100;

    $audioElement.currentTime = time;

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

/**
 * Obtiene los minutos y segundos de cualquier momento del audio
 */
function getAudioMinutes(audioMoment) {

    //* Obtengo la cantidad de minutos
    let minute = String(audioMoment / 60).split('.')[0]

    //* Obtengo la cantidad de segundos
    let seconds = String(Math.floor(Number('0.' + String(audioMoment / 60).split('.')[1]) * 60))

    //* Si la cantidad de segundos está por debajo de 10 le agrego un cero por delante
    if(seconds.length == 1) {
        seconds = '0' + seconds
    }

    return minute + ':' + seconds
}


//////////////////////////////////////////////////////////////////////////////////////////////