import { useQuery, gql } from "@apollo/client"

const GET_ACTIVE_ITEMS = gql`
    {
        activeItems(first: 5, where: { buyer: null }) {
            id
            tokenId
            buyer
            seller
            nftAddress
            price
        }
    }
`
export default GET_ACTIVE_ITEMS
