import Typewriter from "typewriter-effect";
import "./Description.css";

interface DescriptionProps {
  description: string;
}

const Passphrase = ({ description }: DescriptionProps) => {
  return (
    <section id="Description">
      <code>
        <Typewriter
          options={{
            strings: description,
            autoStart: true,
            delay: 35,
          }}
        />
      </code>
    </section>
  );
};

export default Passphrase;
