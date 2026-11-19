import { ErrorBoundary } from "react-error-boundary";

import PassphraseGenerator from "../components/PassphraseGenerator";
import ServerError from "../components/ServerError";

const Root = () => (
  <ErrorBoundary fallback={<ServerError />}>
    <PassphraseGenerator />
  </ErrorBoundary>
);

export default Root;
