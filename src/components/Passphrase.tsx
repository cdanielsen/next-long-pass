import "./Passphrase.css";

interface PassphraseProps {
  passphrase: string;
}

const Passphrase = ({ passphrase }: PassphraseProps) => {
  return (
    <section id="Passphrase">
      <code>{passphrase}</code>
    </section>
  );
};

export default Passphrase;
