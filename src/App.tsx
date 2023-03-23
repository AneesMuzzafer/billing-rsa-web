import { Provider } from 'react-redux';
import { store } from './state/store';
import Navigation from './Navigation/Navigation';

function App() {
    return (
        <Provider store={store}>
            <Navigation />
        </Provider>
    );
}

export default App;
