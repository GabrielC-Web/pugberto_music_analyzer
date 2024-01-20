/**
 * Crea una maravillosa animación de pugberto
 */
export class PugbertoAnimation {

    /**
     * Hace referencia al elemento donde se renderiza la imagen
     */
    image = document.getElementById('imageSection')

    /**
     * Index numérico del frame
     */
    imgIndex = 0

    /**
     * Index del frame en la url
     */
    imageIndexUrl = '001'

    /**
     * Duración de la animación
     */
    duration = 0

    /**
     * Tiempo de cambio para el siguiente frame
     */
    speed = 100

    animation

    /**
     * Interval de animación
     */
    animationInterval

    /**
     * Clase que hace referencia al contenedor en el que será indertado pugberto
     */
    target

    /**
     * Dimensiones de pugberto
     */
    dimentions = {
        width: '150px',
        height: '150px',
    }

    /**
     * Cantidad de grados de hue
     */
    hueRotation = 0

    /**
     * Nivel de saturación del color
     */
    saturation = '100%'

    /**
     * Hace referencia al elemento de pugberto
     */
    pugberto

    /**
     * Hace referencia al elemento container de todos los pugbertos
     */
    container

    /**
     * Hace referencia al elemento que contiene al pugberto
     */
    pugbertoContainer

    /**
     * Imágenes de pugberto
     */
    images = []

    constructor(
        config
    ) {

        this.target = config.target?? this.target

        this.dimentions = config.dimentions?? this.dimentions

        //* Cargo las imágenes
        this.loadImages()
    }

    /**
     * Crea todos los elementos de imagen
     */
    loadImages() {
        //* Cargo 50 imágenes
        for (let index = 1; index < 51; index++) {
            
            //* La imagen con index 0 no existe
            if(index != 0) {

                //* Creo el elemento de imagen
                const element = document.createElement('img')

                let imageIndexUrl
        
                //* Creo la parte del index de la imagen para la url
                if(String(index).length <2) {
                    //* index de url si el número es menor a 10
                    imageIndexUrl = '00' + String(index)
                } else {
                    //* Index de url si el número es mayor a 10
                    imageIndexUrl = '0' + String(index)
                }
    
                //* Le doy la url al elemento de imagen
                element.src = `../res/transparent_sprites/ezgif-frame-${imageIndexUrl}-removebg-preview.png`

                //* Agrego el elemento al array de elementos de imagen
                this.images.push(element)
            }

        }

        //* Verifico si todas las imágenes y el contenedor principal existen
        if(this.target && this.images.length == 50) {

            //* Creo el elemento de pugberto y lo agrego al DOM
            this.create()
        }

    }

    /**
     * Crea el pugberto dentro del target
     */
    create() {
        /**
         * Hago referencia al elemento en el que voy a insertar a pugberto
         */
        this.container = document.querySelector(this.target)

        //* Creo el elemento que contiene a pugberto
        this.pugbertoContainer = document.createElement('div')

        /**
         * Creo el elemento de pugberto
         */
        this.pugberto = this.images[this.imgIndex]

        //* Les doy su respectivo id
        this.pugberto.id = 'imageSection'

        //* Configuro los estilos del contenedor de pugberto
        this.pugbertoContainer.style.width = this.dimentions.width
        this.pugbertoContainer.style.height = this.dimentions.height
        this.pugbertoContainer.style.position = 'relative' 

        //* Seteo la posición de pugberto
        this.pugberto.style.position = 'absolute'
        
        //* Configuro todos los demás estilos de pugberto
        this.modifyStyle()

        //* Agrego el pugberto a su contenedor
        this.pugbertoContainer.appendChild(this.pugberto)

        //* Inserto el pugberto en el elemento padre
        this.container.appendChild(this.pugbertoContainer)

    }

    /**
     * Modifica la apariencia de pugberto
     * @param {} styleConfig 
     */
    modifyStyle(
        styleConfig
    ) {

        //* Si vienen las dimensiones las aplico

        if(styleConfig?.width) {
            this.pugberto.style.width = styleConfig.width
        }
        if(styleConfig?.height) {
            this.pugberto.style.width = styleConfig.height
        }

        //* Si viene la saturación aplico el cambio
        this.saturation = styleConfig?.saturation??this.saturation

        //* Si viene el grado de rotación de hue aplico el cambio
        this.hueRotation = styleConfig?.hueRotation??this.hueRotation

        //* Aplico el filtro con los nuevos valores
        this.pugberto.style.filter = `saturate(${this.saturation}) hue-rotate(${this.hueRotation}deg)`

    }

    /**
     * Inicia la animación
     */
    animate() {

        //* Inicio la animación
        this.animation = requestAnimationFrame(() => {
            this.animate()
        })

        this.duration+=1

        if(this.duration >= 100) {
            this.duration = 0
        }

        if(this.duration % this.speed == 0) {
            this.changeImgIndex()
        }

    }

    /**
     * Elimina y reinserta a pugberto en el dom
     */
    reinsertPugberto() {
        //* Elimino el pugberto anterior del contenedor
        this.pugbertoContainer.removeChild(this.pugberto)

        //*Seteo la url de la imagen
        this.pugberto = this.images[this.imgIndex]

        //* Seteo los estilos del pugberto
        this.modifyStyle()

        //* Agrego el nuevo pugberto al contenedor
        this.pugbertoContainer.appendChild(this.pugberto)
    }

    /**
     * Cambia el index de la imagen
     */
    changeImgIndex() {

        //* Cambio el index
        this.imgIndex+=1
    
        //* Si el index llega al final, entonces reinicio el ciclo
        if(this.imgIndex >= 50) {
            this.imgIndex = 1
        }

        //* Reinserto al pugberto con el nuevo index
        this.reinsertPugberto()
    }

    /**
     * Detiene la animación
     */
    stopAnimation() {
        cancelAnimationFrame(this.animation)
    }

    /**
     * Inicia la animación
     */
    startAnimation() {

        //* Empiezo la función de animar
        this.animate()

        //* Inicio el interval de nuevo
        this.changeImgIndex()
    }

 }