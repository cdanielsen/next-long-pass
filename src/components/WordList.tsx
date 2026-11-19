import { useTypedText } from "../hooks/useTypedText";
import styles from "./WordList.module.css";

interface WordListProps {
  words: string[];
  labelledBy: string;
}

const TypedWords = ({ words, labelledBy }: WordListProps) => {
  // Type the whole phrase in one pass, then split it back into rows so the
  // rows keep their place while the words fill in.
  const typed = useTypedText(words.join(" ")).split(" ");

  return (
    <ol className={styles.list} aria-labelledby={labelledBy}>
      {words.map((word, i) => (
        <li key={`${String(i)}-${word}`} className={styles.item}>
          <span className={styles.number} aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className={styles.word}>
            <span className="visually-hidden">{word}</span>
            <span aria-hidden="true">{typed[i] ?? ""}</span>
          </span>
        </li>
      ))}
    </ol>
  );
};

/** The passphrase as a numbered list, typed out when it changes. */
const WordList = (props: WordListProps) => (
  // key restarts the typing animation for each new passphrase
  <TypedWords key={props.words.join(" ")} {...props} />
);

export default WordList;
