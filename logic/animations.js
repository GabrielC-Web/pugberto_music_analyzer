
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
     * Detecta el canvas y crea su contexto
     */
    detectCanvas() {
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

        //* Valor máximo que tendrá el sonido
        let maxSoundHeight = 255
        
        //* Creo todas las barras
        for (let index = 0; index < barsAmount; index++) {

            //* Obtengo el porcentaje de altura de la barra
            let totalHeightPortion = (dataArray[index]/maxSoundHeight)*100
            
            //* Le doy la altura correspondiente a la barra
            let barHeight = ((this.canvas.height*totalHeightPortion)/100)

            this.addBar(barHeight, barWidth, this.setBarColor(barHeight))
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

    /**
     * Genera el color de la barra con base en la altura de esta
     * @param {*} barHeight 
     */
    setBarColor(barHeight) {

        //* Calculo la proporción de tamaño de las barras respecto al tamaño máximo
        let proportion = Math.abs(barHeight/this.canvas.height)


        //* Seteo los colores rojo y azul inversamente proporcionales (En este caso las barras más altas tenderán a ser rojas y las más bajas azules)

        let redValue = 250*proportion

        let blueValue = 250*(1-proportion)

        //* Esto hace que la paleta se vea muy cool
        // let greenValue = Math.abs(redValue - blueValue)/2

        //* Esto hace que la paleta parezca sopa
        // let greenValue = 125

        //* Esto hace que los rojos y azules se vean más fuertes
        let greenValue = 0

        let color = `rgb(${redValue},${greenValue},${blueValue})`
        return color
    }

    /**
     * Cambia el color de fondo del background
     */
    changeMainBg(color) {
        setInterval(() => {
            this.mainDiv.style.backgroundColor =  color
        }, 2500);
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

    /**
     * Número de pugbertos creados
     */
    pugbertosCreated = 0

    /**
     * Indica que la fuente ha sido cargada
     */
    fontsLoaded = false

    constructor(pugbertosAmount) {

        //* Escucho el momento en que las fuentes han sido cargadas (Usualmente es lo último en cargar)
        document.fonts.load('1rem "RubikDoogleShadow"').then(() => {
            this.fontsLoaded = true
        })
    }

    /**
     * Crea todos los pugbertos
     * @param {*} pugbertosAmount 
     */
    createPugbertos() {

        for (let index = 0; index < this.pugbertosAmount; index++) {

            pugbertosContainer.insertAdjacentHTML('afterbegin', 
                `<video id="video_player${index}" src="res/pugberto_reduced.webm" loop type="video/mp4"></video>`
            )

            //* Aumento la cantidad de pugbertos creados
            this.pugbertosCreated+=1
        }

        //* Verifico que el último video de pugberto haya sido añadido
        if(this.pugbertosCreated >= this.pugbertosAmount -1) {

            //* Escucho el evento playing en el último video añadido
            document.getElementById(`video_player${this.pugbertosAmount - 1}`).addEventListener('playing', () => {

                //* Si las fuentes han sido cargadas, entonces es momento de mostrar a los pugbertos
                if(this.fontsLoaded) {
                    pugbertosContainer.style.opacity = '1'

                    this.animationLoadedEvent()
                }
            })
        }
        
    }

    /**
     * Dispara el evento de que la animación ha sido cargada
     */
    animationLoadedEvent() {
        const event = new Event("animationloaded");

        document.dispatchEvent(event);
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

            if(pause && videoPlayer.duration > 0) {
                videoPlayer.pause()
            } else {
                videoPlayer.play()
            }
            
        }

    }   
}