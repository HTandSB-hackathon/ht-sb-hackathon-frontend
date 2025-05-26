import { ChakraProvider } from "@chakra-ui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const rootElement = document.getElementById("root");

if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<ChakraProvider>
				<App />
			</ChakraProvider>
		</StrictMode>,
	);
} else {
	console.error("Root element with id 'root' not found");
}
