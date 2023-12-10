
/**
 * Velocidad de reproducción del video
 */
let playbackRate = 1.0

export default class CanvasAnimations {

    /**
     * Div principal en el que irá el canvas
     */
    mainDiv = document.getElementById('main')

    /**
     * Elemento del canvas
     */
    canvas

    //* Indico qué tipo de canvas es
    ctx

    //* Coordenada inicial para pintar las barras
    initialCoordX = 0

    /**
     * Agrega el canvas al layout
     */
    addCanvas(config = {width:70, height:50, bgColor:'#000'}) {
        
        if(!config.width) {
            config.width = 70
        }

        if(!config.height) {
            config.height = 50
        }

        if(!config.bgColor) {
            config.bgColor = '#000'
        }

        //* Agrego el canvas al div principal
        this.mainDiv?.insertAdjacentHTML('beforeend',
            `<canvas id="canvas" style="width: ${config.width}%; height: ${config.height}%; background-color: ${config.bgColor};margin-top:1rem"></canvas>`
        )

        this.canvas = document.getElementById('canvas')

        this.ctx = this.canvas?.getContext("2d")

    }

    /**
     * Crea todas las barras
     * @param {*} barsAmount 
     * @param {*} barheight 
     * @param {*} fillStyle 
     */
    createBars(barsAmount, dataArray, fillStyle) {

        // * El primer rectángulo empieza en el principio (daa)
        this.initialCoordX = 0

        //* Defino el ancho de las barras
        let barWidth = (this.canvas?.width /barsAmount) * 2

        //* Creo los rectángulos con su ancho y alto correspondiente
        this.ctx.clearRect(0, 0, this.canvas?.width, this.canvas?.height)
        
        //* Creo todas las barras
        for (let index = 0; index < barsAmount; index++) {

            let barHeight = ((this.canvas.height/2)*dataArray[index]/100) - 30
            
            this.addBar(barHeight, barWidth, fillStyle)
        }
    }

    /**
     * Añade una barra con su altura, ancho y color particular
     * @param {*} barheight 
     * @param {*} barWidth 
     * @param {*} fillStyle 
     */
    addBar(barHeight,barWidth, fillStyle = 'purple') {

        //* Le doy color a las barras
        this.ctx.fillStyle = fillStyle

        //* Creo las barras con su tamaño correspondiente
        this.ctx.fillRect(this.initialCoordX, this.canvas.height - barHeight, barWidth, barHeight)

        //* Aumento la coordenada de inicio de los rectángulos (para que salgan uno al lado del otro)
        this.initialCoordX += barWidth
    }
}

/**
 * Crea y controla las animaciones de pugberto
 */
export class PugbertosAnimations {

    /**
     * Contenedor de los pugbertos
     */
    pugbertosContainer = document.getElementById('pugbertosContainer')

    /**
     * Cantidad de pugbertos
     */
    pugbertosAmount = 5

    /**
     * Velocidad de reproducción de los pugbertos
     */
    playbackRate = 1.0

    constructor(pugbertosAmount) {

    }

    /**
     * Crea todos los pugbertos
     * @param {*} pugbertosAmount 
     */
    createPugbertos() {

        for (let index = 0; index < this.pugbertosAmount; index++) {

            pugbertosContainer.insertAdjacentHTML('afterbegin', 
                `<video id="video_player${index}" class="w-48 " src="res/pugberto_transparent_bg.webm" loop></video>`
            )
            
        }
    }

    /**
     * Cambia el tamaño de los pugbertos
     */
    changePugbertoSize(averageFrequencySpeed, pair = true) {
        /**
         * Número del tamaño
         */
        let newPugbertoSize = 60*averageFrequencySpeed

        /**
         * Tamaño en pixeles
         */
        let newPugbertoSizePx
        
        //* Verifico que no se haga muy pequeño o muy grande
        if(newPugbertoSize < 200) {
            newPugbertoSize = 200
        } else if(newPugbertoSize > 300) {
            newPugbertoSize = 300
        }

        //* Obtengo la medida del tamaño con su unidad
        newPugbertoSizePx = newPugbertoSize + 'px'
        
        //* Seteo los nuevos tamaños
        for (let i = 0; i < this.pugbertosAmount; i++) {

            const videoPlayer = document.getElementById(`video_player${i}`)

            //* Solo cambio el tamaño en las partes del medio
            if(!pair && i%2 != 0) {
                videoPlayer.style.width = newPugbertoSizePx
            } 

            //* Solo cambio el tamaño en los extremos
            if(pair && i%2 == 0) {
                videoPlayer.style.width = newPugbertoSizePx
            }
        }
    }

    /**
     * Cambia la velocidad de reproducción de los pugbertos
     * @param {*} playbackRate 
     */
    changePugbertoSpeed(playbackRate, pair = true) {
        for (let i = 0; i < this.pugbertosAmount; i++) {

            const videoPlayer = document.getElementById(`video_player${i}`)

            //* Solo cambio la velocidad de los videos en los extremos y partes del medio
            if(pair && i%2 == 0) {
                videoPlayer.playbackRate = playbackRate
            }

            //* Solo cambio la velocidad de los videos en las partes del medio
            if(!pair && i%2 != 0) {
                videoPlayer.playbackRate = playbackRate
            }

        }
    }

    /**
     * Pause o reproduce los videos
     * @param {*} pause 
     */
    toggleVideoReproduction(pause) {

        for (let i = 0; i < this.pugbertosAmount; i++) {

            const videoPlayer = document.getElementById(`video_player${i}`)

            if(pause) {
                videoPlayer.pause()
            } else {
                videoPlayer.play()
            }
            
        }

    }   
}