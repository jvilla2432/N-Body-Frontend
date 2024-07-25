import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import CanvasContainer from "./CanvasContainer"
export default function App() {
  return <MantineProvider theme={theme}>
    <CanvasContainer></CanvasContainer>
  </MantineProvider>;
}
