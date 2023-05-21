import { useQuery, gql } from "@apollo/client"
const GET_ACTIVE_ITEM = gql`
    {
        activeItems(first: 5, where: { buyer: null }) {
            id
            buyer
            seller
            nftAddress
            price
        }
    }
`
export default function GraphExample() {
    const { loading, error, data } = useQuery(GET_ACTIVE_ITEM)
    console.log(data)
    return <>Hi!</>
}
