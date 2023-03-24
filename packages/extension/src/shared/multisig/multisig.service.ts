import urlJoin from "url-join"

import { ARGENT_MULTISIG_URL } from "../api/constants"
import { Fetcher, fetcher } from "../api/fetcher"
import { Network } from "../network"
import { networkToStarknetNetwork } from "../utils/starknetNetwork"
import { urlWithQuery } from "../utils/url"
import {
  ApiMultisigContent,
  ApiMultisigDataForSigner,
  ApiMultisigDataForSignerSchema,
} from "./multisig.model"

export interface IFetchMultisigDataForSigner {
  signer: string
  network: Network
  fetcher?: Fetcher<ApiMultisigDataForSigner>
}

export async function fetchMultisigDataForSigner({
  signer,
  network,
  fetcher: fetcherImpl = fetcher,
}: IFetchMultisigDataForSigner): Promise<ApiMultisigDataForSigner> {
  if (!ARGENT_MULTISIG_URL) {
    throw "Argent Multisig endpoint is not defined"
  }

  const starknetNetwork = networkToStarknetNetwork(network)

  const url = urlWithQuery([ARGENT_MULTISIG_URL, starknetNetwork], {
    signer,
  })

  const data = await fetcherImpl(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })

  return ApiMultisigDataForSignerSchema.parse(data)
}

export const getMultisigAccountData = async ({
  address,
  networkId,
}: {
  address: string
  networkId: string
}) => {
  try {
    if (!ARGENT_MULTISIG_URL) {
      throw new Error("Multisig endpoint is not defined")
    }
    const url = urlJoin(ARGENT_MULTISIG_URL, `${networkId}/${address}`)
    return fetcher<{
      content: ApiMultisigContent
    }>(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
  } catch (e) {
    throw new Error(`An error occured ${e}`)
  }
}
