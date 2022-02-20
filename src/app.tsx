import "antd/dist/antd.less";
import { default as styled, ThemeProvider } from "styled-components";
import defaultTheme from "./themes/default.json";

const Header = styled.div`
    background-color: ${(props) => props.theme.primaryColor};
    padding: 20px;
    font-size: 3em;
    color: #fff;
    font-weight: 700;
`;

function App(): JSX.Element {
    return (
        <ThemeProvider theme={defaultTheme}>
            <div className="App">
                <Header>checklist</Header>
                <header className="App-header">
                    <p>
                        Edit <code>src/App.tsx</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React wdafdsadsdf
                    </a>
                </header>
            </div>
        </ThemeProvider>
    );
}

export default App;
