import io from 'socket.io-client'

export default ({ app, redirect, store }, inject) => {
    if(store.state.auth.loggedIn) {
        let cookies = document.cookie;
        let authToken = decodeURI(cookies.split('auth._token.local=')[1])
    
        let socket = io.connect('https://multiplayer-game-api.herokuapp.com', {
            extraHeaders: { Authorization: authToken }
        });
    
        socket.on('unauthorized', (error) => {
            if (error.data.type == 'UnauthorizedError' || error.data.code == 'invalid_token') {
                // redirect user to login page perhaps?
                console.log('User token has expired');
                redirect('/sign-in');
            }
        })
    
        // Inject $hello(msg) in Vue, context and store.
        inject('socketTest', socket)
    } else {
        redirect('/sign-in');
    }
}