// import soundAnalyzer from '../logic/sound_analyzer'

import SoundAnalyzer  from "../logic/sound_analyzer.js";

/**
 * Analizador de sonido
 */
let soundAnalyzer = new SoundAnalyzer()

//? Variables iniciales
/**
 * Input de archivo
 */
let fileInput = document.getElementById('file')

/**
 * Botón de inicio
 */
let startButton  = document.getElementById('start_btn')

//? Listeners

/**
 * Escucha el evento de click del botón
 */
startButton?.addEventListener('click', () => {
    //* Muestro el input
    start()
})

/**
 * Escucha el evento de cambio del input
 */
fileInput?.addEventListener('change', (e) => {
    soundAnalyzer.getFile(e.target)
})

/**
 * Empieza todo el proceso
 */
function start() {
    fileInput.style.display = 'block'
}

//? Variables del reproductor de sonido

// /**
//  * Referencia para el archivo de audio que analizaremos
//  */
// let audioSource

// /**
//  * Indica que el audio está tocando
//  */
// let audioIsPlaying = false

// /**
//  * Variable para el analyser del sonido
//  */
// let analyser

// /**
//  * Elemento para reproducir audio
//  */
// let audioPlayer = document.getElementById('audio_player')

// /**
//  * Velocidad de reproducción
//  */
// let playbackRate = 1.0

// /**
//  * Última velocidad de reproducción almacenada
//  */
// let storedPlaybackRate = 1.0

// /**
//  * Volumen del audio
//  */
// let currentVolume = 0

// /**
//  * Archivo de audio
//  */
// let file

// /**
//  * Variable para el audioContext
//  */
// const audioContext = new AudioContext()


// //? Variables del reproductor de video

// /**
//  * Elementos para reproducir video
//  */
// let videoPlayer1 = document.getElementById('video_player1')
// let videoPlayer2 = document.getElementById('video_player2')
// let videoPlayer3 = document.getElementById('video_player3')
// let videoPlayer4 = document.getElementById('video_player4')
// let videoPlayer5 = document.getElementById('video_player5')

// /**
//  * Array de reproductores de videos
//  */
// let videoPlayers = [
//     videoPlayer1,
//     videoPlayer2,
//     videoPlayer3,
//     videoPlayer4,
//     videoPlayer5,
// ]

// /**
//  * Segundos contados desde que hubo un cambio de animación
//  */
// let seconds = 0

// //? canvas

// /**
//  * Creo el canvas
//  */
// let canvas = document.getElementById('canvas')

// //* Si hay un canvas preparo la configuración inicial
// if(canvas) {

//     //* Le doy las dimensiones al canvas
//     canvas.width = window.innerWidth
//     canvas.height = 500
    
//     //* Indico qué tipo de canvas es
//     const ctx = canvas?.getContext("2d")
// }





// //? Control de archivo y reproductor

// /**
//  * Recibe el archivo cargado en el input y crea la url del archivo
//  * @param e 
//  */
// function handleFile(e) {
    
//     //* Obtengo el primer archivo cargado
//     file = e.files[0]

//     //* Creo la url del archivo
//     audioPlayer.src = URL.createObjectURL(file)

//     audioContext.resume()

//     //* Cargo el archivo
//     audioPlayer.load()

//     //* Empiezo la reproducción
//     audioPlayer.play()

//     //* Indico que se está tocando un audio
//     audioIsPlaying = true


//     //* Hago que aparezca el elemento de audio
//     changeAudioPlayerStyle()
// }

// /**
//  * Recibe el video cargado y lo reproduce
//  * @param {*} e 
//  */
// function handleVideoFile(e) {
//     videoPlayer.src = URL.createObjectURL(e.files[0])
// }

// /**
//  * Cambia la velocidad de reproducción del video
//  */
// function changeVideoPlaybackRate(decibelsArray) {

//     /**
//      * Array para guardar las frecuencias
//      */
//     let array = []

//     /**
//      * Volumen provisional
//      */
//     let sum = 0

//     let average

//     //* Almaceno las frecuencias
//     Array.from(decibelsArray).forEach(number => {
//         if(number != 0) {
//             array.push(Number(number))
//         }
//     });

    
//     //* Calculo el volumen
//     for (const amplitude of array) {
//         sum += amplitude * amplitude
//     }

//     currentVolume = sum

//     //* Obtengo el valor promedio de frecuencia del array

//     if(currentVolume > 1000000 || currentVolume < 300000) {
//         average = Number(Math.floor(array.reduce((a,b) => a+b,0) / array.length / 16))
//     } else {
//         average = Number(Math.floor(array.reduce((a,b) => a+b,0) / array.length / 16/2))
//     }

    
//     //* Si el promedio pasa de 16 (El máximo valor válido para velocidad de reproducción), entonces lo seteo en el máximo
//     if(average > 16) {
//         average = 16
//     //* Si el promedio baja de 0.5 (El mínimo valor válido para velocidad de reproducción), entonces lo seteo en el mínimo
//     } else if( average < 0.5) {
//         average = 0.5
//     }

    
//     //* Verifico que el promedio sea un número válido
//     if(average != NaN) {

//         //* Seteo la velocidad de reproducción para cada video

//         videoPlayerSelector([0, 2, 4], average || 1)

//         //* Cambio el tamaño de algunos pugbertos
//         changePugbertoSize([0,2,4],average)

//         //* Guardo el promedio
//         this.storedPlaybackRate = average
        
//     }

// }

// /**
//  * Muestra o esconde el reproductor de audio dependiendo de si hay o no un archivo cargado
//  */
// function changeAudioPlayerStyle() {
//     if(audioPlayer.src) {
//         audioPlayer.style.display = 'block'

//     } else {
//         audioPlayer.style.display = 'none'
//     }
// }

// /**
//  * Cambia el valor de alguno de los reproductores de video seleccionado
//  * @param {*} indexArray 
//  * @param {*} property 
//  * @param {*} value 
//  */
// function videoPlayerSelector(indexArray,value, property) {

//     for (let i = 0; i < videoPlayers.length; i++) {

//         const videoPlayer = videoPlayers[i];
        
//         indexArray.forEach(index => {

//             //* Solo altero los reproductores seleccionados
//             if(i == index) {

//                 //* Si no pasan ninguna función o propiedad, entonces solo cambio la velocidad de reproducción
//                 if(!property) {
//                     videoPlayer.playbackRate = value
//                 } else  {

//                     //* En caso de que pasen el nombre de alguna función u otra propiedad, verifico cuál fue para realizar las acciones que correspondan
//                     switch (property) {
//                         case 'play':
//                             videoPlayer.play()
//                             videoPlayer.playbackRate = value
//                             break;
//                         case 'pause':
//                             videoPlayer.pause()
//                             break;
//                         default:
//                             videoPlayer.playbackRate = value
//                             break;
//                     }
//                 }

//             }

//         })
//     }

// }

// /**
//  * Cambia el tamaño de pugberto
//  */
// function changePugbertoSize(indexArray, average) {

//     /**
//      * Número del tamaño
//      */
//     let newPugbertoSize = 60*average

//     /**
//      * Tamaño en pixeles
//      */
//     let newPugbertoSizePx
    
//     //* Verifico que no se haga muy pequeño o muy grande
//     if(newPugbertoSize < 200) {
//         newPugbertoSize = 200
//     } else if(newPugbertoSize > 300) {
//         newPugbertoSize = 300
//     }

//     //* Obtengo la medida del tamaño con su unidad
//     newPugbertoSizePx = newPugbertoSize + 'px'
    
//     //* Seteo los nuevos tamaños
//     for (let i = 0; i < videoPlayers.length; i++) {

//         const videoPlayer = videoPlayers[i];
        
//         indexArray.forEach(index => {

//             //* Solo altero los reproductores seleccionados
//             if(i == index) {
//                 videoPlayer.style.width = newPugbertoSizePx
//             }

//         })
//     }

// }

// //? Detección de ratechange

// function audioPlaying() {

//     //* Inicio todos los videos
//     videoPlayerSelector([0,1,2,3,4],1, 'play')

//     //* Verifico si no hay ninguna referencia de audio
//     if(!audioSource) {
//         //* Creo una referencia al archivo de audio
//         audioSource = audioContext?.createMediaElementSource(audioPlayer)
    
//         //* Creamos la instancia de análisis de frecuencia y duración
//         analyser = audioContext?.createAnalyser()
    
//         //* Obtengo la data del analyser
//         audioSource.connect(analyser)
//         analyser.connect(audioContext.destination)
//     }

//     //* Seteo el nivel de detalle en la frecuencia (Mientras más sea el número, más rayitas salen)
//     analyser.fftSize = 128

//     //* Obtengo el número de data de frecuencia
//     const bufferLength = analyser.frequencyBinCount

//     //* Creo el array de valores de frecuencias
//     const dataArray = new Uint8Array(bufferLength)


//     if(!audioIsPlaying) {
//         return
//     }

//     //* Promedio de frecuencia almacenado de la última iteración
//     let oldAverage

//     //* Volumen almacenado de la última iteración
//     let storedVolume

//     //* Si hay un canvas
//     if(canvas) {

//         //* Defino el ancho de las barras
//         const barWidth = (canvas?.width /bufferLength) * 2
    
//         //* Creo la altura
//         let barHeight
    
//         //* Coordenada de inicio del rectángulo
//         let x = 0
//     }
    
    
//     function animate() {
        
//         //* Copia la data de frecuencia actual (Not sure about this comment)
//         analyser.getByteFrequencyData(dataArray)
        
//         //* Cambio la velocidad de reproducción
//         changeVideoPlaybackRate(dataArray)
        
//         //* Si hay un canvas
//         if(canvas) {

//             //* El primer rectángulo empieza en el principio (daa)
//             x= canvas?.width /2
    
//             o = canvas?.width /2
    
//             //* Creo los rectángulos con su ancho y alto correspondiente
//             ctx.clearRect(0, 0, canvas?.width, canvas?.height)

//             //* Itero a través de las frecuencias obtenidas
//             for (let index = 0; index < bufferLength; index++) {
    
//                 //* Seteo la altura de las barras
//                 barHeight = dataArray[index] * 2.5;
//                 //* Le doy color a las barras
//                 ctx.fillStyle = 'purple'
                
//                 //* Creo las barras con su tamaño correspondiente
//                 ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)
                
//                 //* Aumento la coordenada de inicio de los rectángulos (para que salgan uno al lado del otro)
//                 x += barWidth
    
//             }
//             for (let index = 0; index < bufferLength; index++) {
    
                
//                 //* Seteo la altura de las barras
//                 barHeight = dataArray[index] * 2.5;
//                 //* Le doy color a las barras
//                 ctx.fillStyle = 'purple'
                
//                 //* Creo las barras con su tamaño correspondiente
//                 ctx.fillRect(o, canvas.height - barHeight, barWidth, barHeight)
                
//                 //* Aumento la coordenada de inicio de los rectángulos (para que salgan uno al lado del otro)
//                 o -= barWidth
    
//             }
//         }
        
//         //* Empiezo a correr la animación
//         requestAnimationFrame(animate)
        
//         //* Cambio la velocidad de reproducción
//         changeVideoPlaybackRate(dataArray)
//     }

//     //* Inicio el proceso de animación
//     animate()
    
//     //* Aumento la cantidad de segundos cada segundo
//     setInterval(() => {
//         seconds += 1

//         // console.log(Math.abs(this.storedPlaybackRate - oldAverage));

//         console.log(Math.abs(currentVolume - storedVolume));

//         //* Seteo la velocidad de estos videos si hay una diferencia de frecuencia considerable
//         // if(Math.abs(this.storedPlaybackRate - oldAverage) >= 2) {

//         //     videoPlayerSelector([1, 3], this.storedPlaybackRate)

//         // } else {
//         //     videoPlayerSelector([1, 3], 1)
//         // }

//         //* Seteo la velocidad si hay una diferencia de volumen muy grande
//         if(String(Math.abs(currentVolume - storedVolume)).length >=6) {

//             videoPlayerSelector([1, 3], this.storedPlaybackRate)

//             //* Cambio el tamaño de algunos pugbertos
//             changePugbertoSize([1,3],this.storedPlaybackRate)

//         } else {
//             videoPlayerSelector([1, 3], 1)

//             //* Cambio el tamaño de algunos pugbertos
//             changePugbertoSize([1,3],1)
//         }


//         //* Almaceno nuevos valores para frecuencia y volumen

//         oldAverage = this.storedPlaybackRate

//         storedVolume = currentVolume

//     }, 500);
    
// }

// /**
//  * Dibuja las barras de frecuencia
//  * @param {*} bufferLength 
//  * @param {*} dataArray 
//  * @param {*} barHeight 
//  * @param {*} initialCoord 
//  */
// function createBars(bufferLength, dataArray, barHeight, initialCoord) {
//     for (let index = 0; index < bufferLength; index++) {
    
                
//         //* Seteo la altura de las barras
//         barHeight = dataArray[index] * 2.5;
//         //* Le doy color a las barras
//         ctx.fillStyle = 'purple'
        
//         //* Creo las barras con su tamaño correspondiente
//         ctx.fillRect(initialCoord, canvas.height - barHeight, barWidth, barHeight)
        
//         //* Aumento la coordenada de inicio de los rectángulos (para que salgan uno al lado del otro)
//         initialCoord -= barWidth

//     }
// }

// /**
//  * Pausa todos los videos
//  */
// function pauseVideos() {
//     videoPlayerSelector([0,1,2,3,4],0, 'pause')

//     audioContext.resume()

//     audioIsPlaying = false
// }

// /**
//  * Verifica si el video está corriendo
//  * @returns 
//  */
// function checkVideoIsPlaying(indexArray) {

//     for (let i = 0; i < videoPlayers.length; i++) {

//         const videoPlayer = videoPlayers[i];
        
//         indexArray.forEach(index => {

//             //* Solo altero los reproductores seleccionados
//             if(i == index) {

//                 return ((videoPlayer.currentTime > 0 && !videoPlayer.paused) && !videoPlayer.ended)

//                 //* Si no pasan ninguna función o propiedad, entonces solo cambio la velocidad de reproducción
//                 // if(!property) {
//                 //     videoPlayer.playbackRate = value
//                 // } else  {

//                 //     //* En caso de que pasen el nombre de alguna función u otra propiedad, verifico cuál fue para realizar las acciones que correspondan
//                 //     switch (property) {
//                 //         case 'play':
//                 //             videoPlayer.play()
//                 //             videoPlayer.playbackRate = value
//                 //             break;
//                 //         case 'pause':
//                 //             videoPlayer.play()
//                 //             break;
//                 //         default:
//                 //             videoPlayer.playbackRate = value
//                 //             break;
//                 //     }
//                 // }

//             }

//         })
//     }
    
// }