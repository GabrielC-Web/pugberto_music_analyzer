// import PugbertosAnimations  from "../logic/animations.js";
import CanvasAnimations, {PugbertosAnimations} from "../logic/animations.js";

export default class SoundAnalyzer {

    //? Elementos de detección de sonido/música

    /**
     * Archivo de audio
     */
    audioFile

    /**
     * Referencia para el archivo de audio que analizaremos
     */
    audioSource

    /**
     * Elemento para reproducir audio
     */
    audioPlayer = document.getElementById('audio_player')

    /**
     * Variable para el analyser del sonido
     */
    analyser

    /**
     * Indica que el audio está tocando
     */
    audioIsPlaying = false

    /**
     * Volumen del audio
     */
    currentVolume = 0

    /**
     * Volumen almacenado
     */
    storedVolume

    /**
     * Variable para el audioContext
     */
    audioContext = new AudioContext()

    /**
     * Valocidad de frecuencia almacenada
     */
    storedFrequencySpeed

    //? listeners de eventos

    //? canvas y animaciones

    /**
     * Canvas
     */
    canvasAnimations = new CanvasAnimations()

    /**
     * Animaciones de pugberto
     */
    pugbertosAnimations = new PugbertosAnimations(5)

    

    constructor(){
        this.audioPlayer?.addEventListener('pause', (e) => {
            this.pugbertosAnimations.toggleVideoReproduction(true)
        })
    }

    /**
     * Recibe el archivo cargado en el input
     * @param {} e 
     */
    getFile(e) {

        //* Obtengo el primer archivo cargado
        this.audioFile = e.files[0]

        //* Creo la url del archivo
        this.audioPlayer.src = URL.createObjectURL(this.audioFile)

        //* Cargo el archivo
        this.audioPlayer.load()

        this.playAudio()
    }

    /**
     * Solicita el permiso de audio del navegador
     */
    getLocalStream() {
        navigator.mediaDevices
          .getUserMedia({ video: false, audio: true })
          .then((stream) => {
            window.localStream = stream;
            window.localAudio.srcObject = stream;
            window.localAudio.autoplay = true;
          })
          .catch((err) => {
            console.error(`you got an error: ${err}`);
          });
    }

    /**
     * Inicia la reproducción del audio
     */
    playAudio() {
        this.audioPlayer.play()

        //* Reinicio el audio context
        this.audioContext.resume().then(() => {})

        this.audioPlayer.addEventListener('play', () => {
            this.configureAudioAnalyzer()
        })
    }

    /**
     * Crea el contexto para analizar el audio
     */
    configureAudioAnalyzer() {

        if(!this.audioContext) {
            this.audioContext = new AudioContext()
        }

        //* Si no se ha configurado una fuente de audio la configuro
        if(!this.audioSource) {
            this.audioSource = this.audioContext.createMediaElementSource(this.audioPlayer)
        }

        //* Creamos la instancia de análisis de frecuencia y duración
        this.analyser = this.audioContext?.createAnalyser()

        //* Obtengo la data del analyser
        this.audioSource.connect(this.analyser)
        this.analyser.connect(this.audioContext.destination)

        //* Seteo el nivel de detalle en la frecuencia (Mientras más sea el número, más rayitas salen)
        this.analyser.fftSize = 128

        //* Obtengo el número de data de frecuencia
        const bufferLength = this.analyser.frequencyBinCount

        //* Creo el array de valores de frecuencias
        const dataArray = new Uint8Array(bufferLength)

        
        //* Añado el canvas si no hay
        if(!this.canvasAnimations.canvas) {
            // this.canvasAnimations.addCanvas()
            this.canvasAnimations.detectCanvas()
        }

        if(!this.pugbertosAnimations.pugbertosContainer.childElementCount) {
            //* Añado los pugbertos
            this.pugbertosAnimations.createPugbertos()
        }

        //* Reproduzco los videos
        this.pugbertosAnimations.toggleVideoReproduction(false)

        //* pongo a correr el análisis en tiempo real
        this.runAudioAnalyzer(bufferLength, dataArray)

        setInterval(() => {
            this.detectVolumeChanges()
        }, 500);
    }

    /**
     * Obtiene la data de frecuencia en tiempo real
     * @param {*} dataArray 
     */
    runAudioAnalyzer(bufferLength, dataArray) {

        // * Copia la data de frecuencia actual (Not sure about this comment)
        this.analyser.getByteFrequencyData(dataArray)

        //* Obtengo el análisis en tiempo real de la frecuencia
        this.getFrequencyData(dataArray)

        //* Creo las barras que correspondan
        this.canvasAnimations.createBars(bufferLength, dataArray,'red')

        //* Inicio el ciclo de reproducción
        requestAnimationFrame(() => {
            this.runAudioAnalyzer(bufferLength, dataArray)
        })
    }

    /**
     * Obtiene información general del análisis de frecuencias en tiempo real
     */
    getFrequencyData(decibelsArray) {
        /**
         * Array para guardar las frecuencias
         */
        let array = []

        /**
         * Volumen provisional
         */
        let sum = 0

        let averageFrequencySpeed

        //* Almaceno las frecuencias
        Array.from(decibelsArray).forEach(number => {
            if(number != 0) {
                array.push(Number(number))
            }
        });


        //* Calculo el volumen
        for (const amplitude of array) {
            sum += amplitude * amplitude
        }

        this.currentVolume = sum

        //* Obtengo el valor promedio de frecuencia del array

        if(this.currentVolume > 1000000 || this.currentVolume < 300000) {
            averageFrequencySpeed = Number(Math.floor(array.reduce((a,b) => a+b,0) / array.length / 16))
        } else {
            averageFrequencySpeed = Number(Math.floor(array.reduce((a,b) => a+b,0) / array.length / 16/2))
        }


        //* Si el promedio pasa de 16 (El máximo valor válido para velocidad de reproducción), entonces lo seteo en el máximo
        if(averageFrequencySpeed > 16) {
            averageFrequencySpeed = 16
        //* Si el promedio baja de 0.5 (El mínimo valor válido para velocidad de reproducción), entonces lo seteo en el mínimo
        } else if( averageFrequencySpeed < 0.5) {
            averageFrequencySpeed = 0.5
        }

        //* Verifico que el promedio sea un número válido
        if(averageFrequencySpeed != NaN) {

            //* Seteo la velocidad de reproducción para cada video
            this.pugbertosAnimations.changePugbertoSpeed(averageFrequencySpeed || 1)

            //* Cambio el tamaño de algunos pugbertos
            this.pugbertosAnimations.changePugbertoSize(averageFrequencySpeed)


            //* Guardo el promedio
            this.storedFrequencySpeed = averageFrequencySpeed   
            
        }
    }

    /**
     * Analiza los cambios del volumen
     */
    detectVolumeChanges() {

        //* Seteo la velocidad si hay una diferencia de volumen muy grande
        if(String(Math.abs(this.currentVolume - this.storedVolume)).length >=6) {

            //* Seteo la velocidad de reproducción para cada video
            this.pugbertosAnimations.changePugbertoSpeed(this.storedFrequencySpeed || 1, false)

            //* Cambio el tamaño de algunos pugbertos
            this.pugbertosAnimations.changePugbertoSize(this.storedFrequencySpeed, false)

        } else {
            //* Seteo la velocidad de reproducción para cada video
           this.pugbertosAnimations.changePugbertoSpeed(1, false)

           //* Cambio el tamaño de algunos pugbertos
           this.pugbertosAnimations.changePugbertoSize(1, false)
        }


        //* Almaceno nuevos valores para frecuencia y volumen

        this.storedVolume = this.currentVolume
    }

}

//* Escucha el evento de pausa de los audios
new SoundAnalyzer().audioPlayer.addEventListener('pause', () => {
    new PugbertosAnimations().toggleVideoReproduction(true)
})
