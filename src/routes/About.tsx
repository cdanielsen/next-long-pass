import styles from "./About.module.css";

const About = () => (
  <section className={styles.about} aria-label="About">
    <p className={styles.inspired}>
      Inspired by <a href="https://xkcd.com/936/">xkcd</a>
    </p>
    <a href="https://xkcd.com/936/" className={styles.comic}>
      <img
        src="https://imgs.xkcd.com/comics/password_strength_2x.png"
        alt="xkcd comic 936, Password Strength: four random common words are easier to remember and harder to guess than a short password full of symbols."
        width={740}
        height={601}
      />
    </a>
  </section>
);

export default About;
