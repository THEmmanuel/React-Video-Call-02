import React from 'react';
import ReactDOM from 'react-dom'
import MainWindow from './containers/MainWindow';

const App = () => {
    return (
        <MainWindow/>
    )
}

ReactDOM.render(<App/>, document.getElementById('root'));