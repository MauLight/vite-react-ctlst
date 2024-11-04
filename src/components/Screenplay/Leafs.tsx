import { LeafProps } from "../../utils/types"


//* Leaves must be inline elements.
export const Leaf = (props: LeafProps) => {
    return (
        <span {...props.attributes} className={`${props.leaf.bold ? 'font-bold' : ''} ${props.leaf.italic ? 'italic' : ''}`}>{props.children}</span>
    )
}