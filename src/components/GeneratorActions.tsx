import { Button, ButtonGroup, IconButton } from "@chakra-ui/react";
import { GiCog } from "react-icons/gi";

const BUTTON_SIZES = ["xs", "sm", "md"];

interface GeneratorActionsProps {
  hasPassphrase: boolean;
  isLoading: boolean;
  onNewPassphrase: () => void;
  onRegenerate: () => void;
  onToggleConfig: () => void;
}

const GeneratorActions = ({
  hasPassphrase,
  isLoading,
  onNewPassphrase,
  onRegenerate,
  onToggleConfig,
}: GeneratorActionsProps) => (
  <ButtonGroup
    marginTop={["0.5rem", "1rem", "2rem"]}
    orientation="vertical"
    alignItems="flex-start"
    width="fit-content"
  >
    <ButtonGroup
      isAttached
      orientation="horizontal"
      alignItems="center"
      width="100%"
    >
      <Button
        colorScheme="red"
        onClick={onNewPassphrase}
        size={BUTTON_SIZES}
        aria-label="Generate a new passphrase"
        width="100%"
      >
        {`Make me ${hasPassphrase ? "another" : "one"}`}
      </Button>
      <IconButton
        colorScheme="red"
        variant={"outline"}
        size={BUTTON_SIZES}
        aria-label="Passphrase configuration"
        onClick={onToggleConfig}
        icon={<GiCog />}
      />
    </ButtonGroup>
    {hasPassphrase && (
      <Button
        colorScheme="blue"
        isLoading={isLoading}
        size={BUTTON_SIZES}
        aria-label="Regenerate the AI mnemonic"
        onClick={onRegenerate}
      >
        Regenerate AI mnemonic
      </Button>
    )}
  </ButtonGroup>
);

export default GeneratorActions;
