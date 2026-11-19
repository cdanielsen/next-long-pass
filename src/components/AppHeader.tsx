import { Link, NavLink } from "react-router";

import AccentPicker from "./AccentPicker";
import { GitHubIcon } from "./icons";
import styles from "./AppHeader.module.css";

export const REPO_URL = "https://github.com/cdanielsen/next-long-pass";

const AppHeader = () => (
  <header className={styles.header}>
    <h1 className={styles.title}>
      <Link to="/" className={styles.titleLink}>
        You Need a Passphrase
      </Link>
    </h1>
    <div className={styles.end}>
      <nav aria-label="Main">
        <ul className={styles.links}>
          <li>
            <NavLink to="/" end className={styles.link}>
              Generator
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={styles.link}>
              About
            </NavLink>
          </li>
        </ul>
      </nav>
      <AccentPicker />
      <a
        href={REPO_URL}
        className={styles.iconLink}
        aria-label="Source code on GitHub"
      >
        <GitHubIcon />
      </a>
    </div>
  </header>
);

export default AppHeader;
