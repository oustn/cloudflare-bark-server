import {render} from 'preact'
import {StyledEngineProvider,} from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";

import AppTheme from './theme/AppTheme'
import { App } from "./app"
import './index.scss'

function Main() {

    return (
        <StyledEngineProvider injectFirst>
            <AppTheme>
                <CssBaseline enableColorScheme />
                <App/>
            </AppTheme>
        </StyledEngineProvider>
    )
}

render(<Main/>, document.getElementById('app')!);

