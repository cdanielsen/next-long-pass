import "./Header.css";

const Header = () => {
  const titleWords = ["You", "Need", "A", "Pass", "Phrase"];
  return (
    <header className="header__title">
      {titleWords.map((word) => (
        <div key={word}>{word}</div>
      ))}
    </header>
  );
};

export default Header;
