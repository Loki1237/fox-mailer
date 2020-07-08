import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { configureStore } from './store/configureStore';

import { SnackbarProvider } from 'notistack';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import deepOrange from '@material-ui/core/colors/deepOrange';
import amber from '@material-ui/core/colors/amber';

const store = configureStore();
const theme = createMuiTheme({
    palette: {
        primary: {
            main: deepOrange[700],
        },
        secondary: {
            main: amber[400],
        }
    }
});

ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <SnackbarProvider>
                <App />
            </SnackbarProvider>
        </ThemeProvider>
    </Provider>,
	document.getElementById('root')
);
