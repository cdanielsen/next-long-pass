import { Link, NavLink } from "react-router";

import styles from "./AppHeader.module.css";

const AppHeader = () => (
  <header className={styles.header}>
    <h1 className={styles.title}>
      <Link to="/" className={styles.titleLink}>
        You Need a Passphrase
      </Link>
    </h1>
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
  </header>
);

export default AppHeader;
