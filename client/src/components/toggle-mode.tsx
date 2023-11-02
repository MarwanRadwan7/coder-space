import { useColorMode } from '@chakra-ui/react';

function ColorModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <button onClick={toggleColorMode}>
      Toggle {colorMode === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
}

export default ColorModeToggle;
