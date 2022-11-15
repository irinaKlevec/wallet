import { Button, H6, P4 } from "@argent/ui"
import { Flex } from "@chakra-ui/react"
import { ComponentProps, FC } from "react"

import {
  prettifyCurrencyValue,
  prettifyTokenBalance,
} from "../../../shared/token/price"
import { LoadingPulse } from "../../components/LoadingPulse"
import { TokenIcon } from "./TokenIcon"
import { useTokenBalanceToCurrencyValue } from "./tokenPriceHooks"
import { toTokenView } from "./tokens.service"
import { TokenDetailsWithBalance } from "./tokens.state"

interface TokenListItemContainerProps
  extends Omit<TokenListItemProps, "currencyValue"> {
  token: TokenDetailsWithBalance
}

export const TokenListItemContainer: FC<TokenListItemContainerProps> = ({
  token,
  ...rest
}) => {
  const currencyValue = useTokenBalanceToCurrencyValue(token)
  return <TokenListItem token={token} currencyValue={currencyValue} {...rest} />
}

export type TokenListItemVariant = "default" | "no-currency"

interface TokenListItemProps extends ComponentProps<typeof Button> {
  token: TokenDetailsWithBalance
  variant?: TokenListItemVariant
  isLoading?: boolean
  currencyValue: string | undefined
  showTokenSymbol?: boolean
}

export const TokenListItem: FC<TokenListItemProps> = ({
  token,
  variant,
  isLoading = false,
  showTokenSymbol = false,
  currencyValue,
  ...rest
}) => {
  const { name, image, symbol } = toTokenView(token)
  const displayBalance = prettifyTokenBalance(token)
  const displayCurrencyValue = prettifyCurrencyValue(currencyValue)
  const isNoCurrencyVariant = variant === "no-currency"
  return (
    <Button
      rounded="xl"
      width="100%"
      h="initial"
      justifyContent="initial"
      textAlign={"initial"}
      px={4}
      py={3.5}
      gap={3}
      {...rest}
    >
      <TokenIcon size={9} url={image} name={name} />
      <Flex
        flexGrow={1}
        alignItems="center"
        justifyContent={"space-between"}
        gap={2}
        overflow={"hidden"}
      >
        <Flex direction={"column"} overflow="hidden">
          <H6 overflow="hidden" textOverflow={"ellipsis"}>
            {name === "Ether" ? "Ethereum" : name}
          </H6>
          {!isNoCurrencyVariant && (
            <LoadingPulse isLoading={isLoading}>
              <P4
                color="neutrals.400"
                fontWeight={"semibold"}
                overflow="hidden"
                textOverflow={"ellipsis"}
              >
                {displayBalance}
              </P4>
            </LoadingPulse>
          )}
          {showTokenSymbol && (
            <P4 color="neutrals.400" fontWeight={"semibold"}>
              {symbol}
            </P4>
          )}
        </Flex>
        <Flex direction={"column"} overflow="hidden">
          <LoadingPulse isLoading={isLoading}>
            <H6 overflow="hidden" textOverflow={"ellipsis"}>
              {isNoCurrencyVariant ? displayBalance : displayCurrencyValue}
            </H6>
          </LoadingPulse>
        </Flex>
      </Flex>
    </Button>
  )
}
