import styles from "./About.module.css";

const About = () => (
  <section className={styles.about} aria-labelledby="about-title">
    <h2 id="about-title" className={styles.heading}>
      About
    </h2>
    <p className={styles.lede}>
      A few random words make a password that is hard to guess and easy to
      remember. This app picks them for you and can ask an AI to write a
      sentence that helps them stick.
    </p>
    <figure className={styles.comic}>
      <a href="https://xkcd.com/936/">
        <img
          src="https://imgs.xkcd.com/comics/password_strength_2x.png"
          alt="xkcd comic 936, Password Strength: four random common words are easier to remember and harder to guess than a short password full of symbols."
          width={740}
          height={601}
        />
      </a>
      <figcaption className={styles.caption}>
        Inspired by <a href="https://xkcd.com/936/">xkcd 936</a>.
      </figcaption>
    </figure>
    <p className={styles.credit}>
      Words come from the{" "}
      <a href="https://www.eff.org/dice">EFF large wordlist</a> (CC BY 3.0 US).
    </p>
  </section>
);

export default About;
