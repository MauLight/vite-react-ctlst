import { type ReactElement } from "react"

export const HeadingElement = (props: { attributes: object, children: ReactElement }) => {
    return <h1 {...props.attributes} className="uppercase font-semibold pt-5">{props.children}</h1>
  }
  
  export const DefaultElement = (props: { attributes: object, children: ReactElement }) => {
    return <p {...props.attributes} className="mt-5">{props.children}</p>
  }
  
  export const CharacterElement = (props: { attributes: object, children: ReactElement }) => {
    return (
      <div {...props.attributes} className="w-full flex justify-center pt-5">
        <h2 className="uppercase">{props.children}</h2>
      </div>
    )
  }
  
  export const DialogElement = (props: { attributes: object, children: ReactElement }) => {
    return (
      <div {...props.attributes} className="w-full flex justify-center">
        <p className="w-[14rem]">{props.children}</p>
      </div>
    )
  }
  
  export const FadeElement = (props: { attributes: object, children: ReactElement }) => {
    return (
      <div {...props.attributes} className="w-full flex justify-end py-10">
        <p className="uppercase font-semibold">{props.children}</p>
      </div>
    )
  }