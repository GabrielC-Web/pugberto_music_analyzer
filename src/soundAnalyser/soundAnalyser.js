
export class SoundDataExtractor {

    //? Recepción del audio y control de este

    /**
     * Hace referencia al elemento input que subió el archivo
     */
    $inputElement

    /**
     * Archivo de audio que se obtiene del input
     */
    audioFile

    /**
     * Hace referencia al elemento de audio que reproducirá el sonido
     */
    $audioPlayerElement

    /**
     * Estado de reproducción del audio (Pause/Play)
     */
    reproductionState

    //? Análisis del audio extraido

    /**
     * Contexto del audio
     */
    audioContext = new AudioContext()

    /**
     * Referencia para el archivo de audio que analizaremos
     */
    audioSource

    /**
     * Instancia de análisis de audio
     */
    analyser

    /**
     * Volúmen del audio
     */
    currentVolume

    /**
     * Promedio de recuencia de audio a cada momento
     */
    averageFrequencySpeed

    /**
     * Array de frecuencias a cada momento
     */
    frequenciesArray

    //? Stream de data del analizador

    /**
     * Reporte de análisis de data
     */
    audioAnalysisReport = {
        reproductionState: this.reproductionState
    }

    constructor(
        elements
    ) {

        //* Si no hay elemento no hago nada
        if(!elements.inputId) {
            return
        }

        //* Creo la referencia al input de archivo
        this.$inputElement = document.querySelector(elements.inputId)

        //* Creo la referencia al reproductor de audio
        this.$audioPlayerElement = document.querySelector(elements.playerId)

        //? Escucho todos los eventos

        //* Escucho el evento del input para obtener el archivo cargado
        this.$inputElement.addEventListener('change', (e) => {

            if(!this.audioFile) {

                //* Obtengo el archivo del evento
                this.getAudioFile(e)
            } 

        })

        //* Escucho el evento del input para obtener el archivo cargado
        this.$inputElement.addEventListener('click', (e) => {

            if(this.audioFile) {
                e.preventDefault()

                //* Elimina el archivo
                this.removeFile()
            }

        })

        //* Escucho el evento de playing del audio
        this.$audioPlayerElement.addEventListener('playing', (e) => {

            this.reproductionState = 'playing'

            //* Emito el evento
            this.createAudioAnalysisReport()

        })

        //* Escucho el evento de pausa del audio
        this.$audioPlayerElement.addEventListener('pause', (e) => {

            this.reproductionState = 'pause'

            //* Emito el evento
            this.createAudioAnalysisReport()

        })

    }

    //? Recepción del audio y control de este

    /**
     * Obtiene el archivo de audio del input
     */
    getAudioFile(inputEvent) {

        //* Obtengo el archivo
        this.audioFile = inputEvent.target.files[0]

        //* Reseteo el value para poder subir el mismo archivo dos veces seguidas
        inputEvent.target.value = ''

        //* Envío el reporte
        this.createAudioAnalysisReport()

        //* Inicio la reproducción del audio
        this.setAudioReproduction(this.audioFile)

    }

    /**
     * Elimina el archivo
     */
    removeFile() {
        this.audioFile = null

        this.$audioPlayerElement.pause()

        //* Envía el reporte
        this.createAudioAnalysisReport()
    }

    /**
     * Reproduce el archivo de audio en el reproductor
     */
    setAudioReproduction(audioFile) {

        this.$audioPlayerElement.src = URL.createObjectURL(audioFile)

        //* Reinicio el audio context
        this.audioContext.resume().then(() => {
            this.$audioPlayerElement.play()

            //* Inicio la configuración del análisis
            this.configureAudioAnalyzer()
        })


    }

    /**
     * Reproduce o pause el audio
     */
    toggleAudioReproduction() {

        if(this.reproductionState == 'playing') {
            this.$audioPlayerElement.pause()
        } else if(this.reproductionState == 'pause') {
            this.$audioPlayerElement.play()
        } else {
            this.$audioPlayerElement.play()
        }

    }

    //? Análisis del audio

    /**
     * Crea el contexto para analizar el audio
     */
    configureAudioAnalyzer(stream) {

        if(!this.audioContext) {
            this.audioContext = new AudioContext()
        }

        //* Si no se ha configurado una fuente de audio la configuro

        //* Aquí configuro fuente de audio de un elemento html
        if(!this.audioSource && !stream) {
            this.audioSource = this.audioContext.createMediaElementSource(this.$audioPlayerElement)

        //* Aquí configuro fuente de audio de un stream de audio
        } else if(!this.audioSource && stream) {
            this.audioSource = this.audioContext.createMediaStreamSource(stream)
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

        this.frequenciesArray = dataArray

        //* pongo a correr el análisis en tiempo real
        this.runAudioAnalyzer(bufferLength, dataArray)

        // setInterval(() => {
        //     this.detectVolumeChanges()
        // }, 500);
    }

    /**
     * Obtiene la data de frecuencia en tiempo real
     * @param {*} dataArray 
     */
    runAudioAnalyzer(bufferLength, dataArray) {

        // * Copia la data de frecuencia actual (Not sure about this comment)
        this.analyser.getByteFrequencyData(dataArray)

        //* Obtengo el análisis en tiempo real de la frecuencia
        this.getByteFrequencyData(dataArray)

        if(this.currentVolume) {
            //* Emito el reporte
            this.createFrequencyDataReport()
        }


        //* Inicio el ciclo de reproducción
        requestAnimationFrame(() => {
            this.runAudioAnalyzer(bufferLength, dataArray)
        })
    }

    /**
     * Obtiene el promedio de frecuencia a cada momento
     * @param {*} decibelsArray 
     */
    getByteFrequencyData(decibelsArray) {
        /**
         * Array para guardar las frecuencias
         */
        let array = []

        /**
         * Volumen provisional
         */
        let sum = 0

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

        // if(this.currentVolume > 1000000 || this.currentVolume < 300000) {
        //     this.averageFrequencySpeed = Math.floor((array.reduce((a,b) => a+b,0) / array.length / 255) * 100)
        // } else {
        //     this.averageFrequencySpeed = Math.floor(((array.reduce((a,b) => a+b,0) / array.length / 255) * 100) / 2)
        // }
        this.averageFrequencySpeed = Math.floor((array.reduce((a,b) => a+b,0) / array.length / 255) * 100)
    }

    // //?  Stream de data del analizador

    /**
     * Creo el reporte del análisis del audio
     */
    createAudioAnalysisReport() {
        
        //* Reporte del análisis de audio
        this.audioAnalysisReport = {
            reproductionState: this.reproductionState,
            fileLoaded: this.audioFile? true : false,
            fileName: this.audioFile?.name
        }

        const event = new CustomEvent('audioAnalyserData', {detail: this.audioAnalysisReport})

        //* Emite el evento
        document.dispatchEvent(event)

    }

    /**
     * Creo el reporte de la frecuencia del audio
     */
    createFrequencyDataReport() {

        //* Reporte del análisis de audio
        this.frequencyDataReport = {
            frequenciesArray: this.frequenciesArray,
            averageFrequencySpeed: this.averageFrequencySpeed,
            currentVolume: this.currentVolume
        }

        const event = new CustomEvent('audioFrequencyData', {detail: this.frequencyDataReport})

        //* Emite el evento
        document.dispatchEvent(event)

    }

}