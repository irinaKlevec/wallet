import { Flex, Text } from "@chakra-ui/react"
import { FC } from "react"

import InfoIcon from "./icons/InfoIcon"
import { FieldError } from "./Typography"

const ErrorMessage: FC<{ message: string }> = ({ message }) => (
  <Flex position="relative" justifyContent="flex-start" gap="1" mt="1" mb="1">
    <Text fontSize="sm" color="error.500">
      <InfoIcon />
    </Text>
    <FieldError>{message}</FieldError>
  </Flex>
)

export { ErrorMessage }
