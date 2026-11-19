import { Route, Routes } from "react-router";

import AppHeader from "./AppHeader";
import Root from "../routes/Root";
import About from "../routes/About";
import NotFound from "./NotFound";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
