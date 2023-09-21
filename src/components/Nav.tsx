import { Flex, HStack, Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <nav id="Navbar">
      <Flex justify="flex-end" marginTop="1rem">
        <HStack as="ul" spacing="4rem" listStyleType="none">
          <Box as="li">
            <Link to="/">/</Link>
          </Box>
          <Box as="li">
            <Link to="/about">About</Link>
          </Box>
        </HStack>
      </Flex>
    </nav>
  );
};

export default Nav;
