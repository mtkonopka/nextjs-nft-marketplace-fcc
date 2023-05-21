import { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import nftAbi from "../constants/BasicNFT.json"
import Image from "next/image"
import { Card } from "web3uikit"
import { ethers } from "ethers"
import networkMapping from "../constants/networkMapping.json"

export default function NFTBox({ price, nftAddress, tokenId, marketplaceAddress, seller }) {
    console.log(`NFTBox: nftAddress: ${nftAddress} tokenId: ${tokenId}`)
    const { isWeb3Enabled, account } = useMoralis()
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    })

    async function updateUI() {
        console.log("UpdateUI")

        const tokenURI = await getTokenURI()
        console.log(`TokenURI: ${tokenURI}`)

        if (tokenURI) {
            const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            const tokenURIResponse = await (await fetch(requestURL)).json()
            const imageURI = tokenURIResponse.image
            const imageURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            setImageURI(imageURL)
            setTokenName(tokenURIResponse.name)
            setTokenDescription(tokenURIResponse.description)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) updateUI()
    }, [isWeb3Enabled])

    const isOwnedByUser = seller === account || seller === undefined
    const formattedSeller = isOwnedByUser ? "you" : seller

    return (
        <div>
            <div>
                {imageURI ? (
                    <Card title={tokenName} description={tokenDescription}>
                        <div className="p-2">
                            <div className="flex flex-col items-end gap-2">
                                <div>#{tokenId}</div>
                                <div className="italic text-sm">Owned by: {formattedSeller}</div>
                                <Image loader={() => imageURI} src={imageURI} height="200" width="200" />
                                <div className="font-bold">{ethers.utils.formatUnits(price, "ether")} MATIC</div>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <div>
                        {" "}
                        NFT {tokennftAddressName}-{tokenId} image not found ...{" "}
                    </div>
                )}
            </div>
        </div>
    )
}
