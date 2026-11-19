import { Link, useLocation } from "react-router";

import styles from "./StatusPage.module.css";

export default function NotFound() {
  const { pathname } = useLocation();

  return (
    <section className={styles.page} aria-labelledby="not-found-title">
      <h2 id="not-found-title" className={styles.code}>
        404
      </h2>
      <p className={styles.message}>{`There's no page at ${pathname}.`}</p>
      <Link to="/" className={styles.home}>
        Make a passphrase
      </Link>
    </section>
  );
}
