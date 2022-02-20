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
                Hello
            </div>
        </ThemeProvider>
    );
}

export default App;
