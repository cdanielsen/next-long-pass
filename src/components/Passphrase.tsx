import "./Passphrase.css";

interface PassphraseProps {
  passPhrase: string | null;
}

const Passphrase = ({ passPhrase }: PassphraseProps) => {
  return (
    <section id="Passphrase">
      {passPhrase ? <code>{`"${passPhrase}"`}</code> : null}
    </section>
  );
};

export default Passphrase;
