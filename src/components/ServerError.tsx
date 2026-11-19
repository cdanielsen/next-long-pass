import styles from "./StatusPage.module.css";

export default function ServerError() {
  return (
    <section className={styles.page} aria-labelledby="server-error-title">
      <h2 id="server-error-title" className={styles.code}>
        500
      </h2>
      <p className={styles.message}>
        Something unexpected went wrong. Reload the page to try again.
      </p>
    </section>
  );
}
