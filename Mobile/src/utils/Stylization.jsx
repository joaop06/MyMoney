// import DeviceTheme from './DeviceTheme'

export const Colors = {
    /**
     * Neutras
     */
    black: '#000000',
    white: '#FFFFFF',
    transparent: 'rgba(0, 0, 0, 0)',

    /**
     * Vermelho
     */
    red: '#FF0000',
    red_darken: '#D50000',
    red_lighten_1: '#EF9A9A',
    red_lighten_2: '#FFEBEE',

    /**
     * Azul
     */
    blue: '#42A5F5',
    blue_darken: '#0D47A1',
    blue_lighten_1: '#90CAF9',
    blue_lighten_2: '#BBDEFB',
    blue_lighten_3: '#E3F2FD',

    /**
     * Cinza
     */
    grey: '#757575',
    grey_darken: '#424242',
    grey_lighten_1: '#BDBDBD',
    grey_lighten_2: '#EEEEEE',

    /**
     * Verde
     */
    green: '#00C700',
    green_darken: '#1B5E20',
    green_lighten_1: '#64DD17',
    green_lighten_2: '#B2FF59',

    /**
     * Amarelo
     */
    yellow: '#FFFF00',
    yellow_darken: '#FFAB00',
    yellow_lighten_1: '#FDD835',
    yellow_lighten_2: '#FFF59D',
}


export const Components = {
    Buttons: {
        FontColor: (theme) => theme === 'dark' ? Colors.black : Colors.white,
        BackColor: (theme) => theme === 'dark' ? Colors.black : Colors.blue,
    },
    Icons: {
        focus: Colors.blue,
        unfocus: Colors.grey_lighten_1,
    }
}
