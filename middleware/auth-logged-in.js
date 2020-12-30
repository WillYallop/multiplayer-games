export default function ({ store, redirect, $auth }) {
    if (!store.state.auth.loggedIn) {
        return redirect('/sign-in');
    }
}