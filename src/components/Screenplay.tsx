import { createEditor, BaseEditor, Descendant, Transforms, Element, Editor } from "slate"
import { useCallback, useEffect, useMemo, useState, type ReactElement } from 'react'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { HocuspocusProvider } from '@hocuspocus/provider'

import debounce from 'lodash.debounce'
import { Cursors } from "./Cursors"
import * as Y from 'yjs'
import { FadeLoader } from "react-spinners"

const isDev = import.meta.env.DEV
const weburl = isDev ? import.meta.env.VITE_WEBSOCKET_PORT_DEV : import.meta.env.VITE_WEBSOCKET_PORT_PROD

//* Components
import { CharacterElement, DefaultElement, DialogElement, FadeElement, HeadingElement } from './Screenplay/Elements'
import { LeafProps } from '../utils/types'
import { Leaf } from './Screenplay/Leafs'
import { withCursors, withYjs, YjsEditor } from '@slate-yjs/core'

type CustomElement = { type: 'heading' | 'description' | 'character' | 'dialog' | 'fade', children: CustomText[] }
type CustomText = { text: string, bold?: boolean, italic?: boolean }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}

interface RenderElementsProps {
  element: CustomElement
  children: ReactElement
  attributes: Record<string, unknown>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ScreenEditor = ({ sharedType, provider, username }: { sharedType: any, provider: any, connectToServerAsync: any, username: string }): ReactElement => {

  const editor = useMemo(() => {
    const e = withReact(withCursors(withYjs(createEditor(), sharedType), provider.awareness, {
      data: {
        name: username,
        color: '#ec4899'
      }
    }))
    const { normalizeNode } = e
    e.normalizeNode = entry => {
      const [node] = entry
      if (!Editor.isEditor(node) || node.children.length > 0) {
        return normalizeNode(entry)
      }
      Transforms.insertNodes(editor, initialValue, { at: [0] })
    }
    return e
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const initialValue: Descendant[] = useMemo(() => editor.children.length > 0 ? editor.children : [
    {
      type: 'description',
      children: [{ text: '' }]
    }
  ], [editor.children])

  const CustomEditor = {
    isBoldMarkActive(editor: BaseEditor & ReactEditor) {
      const marks = Editor.marks(editor)
      return marks ? marks.bold === true : false
    },

    isItalicMarkActive(editor: BaseEditor & ReactEditor) {
      const marks = Editor.marks(editor)
      return marks ? marks.italic === true : false
    },

    toggleBoldMark(editor: BaseEditor & ReactEditor) {
      const isActive = CustomEditor.isBoldMarkActive(editor)
      if (isActive) {
        Editor.removeMark(editor, 'bold')
      } else {
        Editor.addMark(editor, 'bold', true)
      }
    },

    toggleItalicMark(editor: BaseEditor & ReactEditor) {
      const isActive = CustomEditor.isItalicMarkActive(editor)
      if (isActive) {
        Editor.removeMark(editor, 'italic')
      } else {
        Editor.addMark(editor, 'italic', true)
      }
    },


  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const prevType = editor.children.length > 0 ? (editor.children[editor.children.length - 1] as CustomElement).type : null

    if (e.key === 'Enter' && prevType) {
      switch (prevType) {
        case 'heading': {
          e.preventDefault()
          Transforms.insertNodes(
            editor,
            {
              type: 'description',
              children: [{ text: '' }]
            }
          )
          break
        }

        case 'description': {
          e.preventDefault()
          Transforms.insertNodes(
            editor,
            {
              type: 'description',
              children: [{ text: '' }]
            }
          )
          break
        }

        case 'character': {
          e.preventDefault()
          Transforms.insertNodes(
            editor,
            {
              type: 'dialog',
              children: [{ text: '' }]
            }
          )
          break
        }

        case 'dialog': {
          e.preventDefault()
          Transforms.insertNodes(
            editor,
            {
              type: 'character',
              children: [{ text: '' }]
            }
          )
          break
        }

        default: {
          e.preventDefault()
          Transforms.insertNodes(
            editor,
            {
              type: 'description',
              children: [{ text: '' }]
            }
          )
          break
        }
      }
    }

    //* If command key (mac) hasn't been pressed, return.
    if (!e.metaKey) {
      return
    }

    switch (e.key) {
      case '1': {
        e.preventDefault()
        Transforms.setNodes(
          editor,
          { type: 'heading' },
          { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
        )
        break
      }

      case '2': {
        e.preventDefault()
        Transforms.setNodes(
          editor,
          { type: 'description' },
          { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
        )
        break
      }

      case '3': {
        e.preventDefault()
        Transforms.setNodes(
          editor,
          { type: 'character' },
          { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
        )
        break
      }

      case '4': {
        e.preventDefault()
        Transforms.setNodes(
          editor,
          { type: 'dialog' },
          { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
        )
        break
      }

      case '5': {
        e.preventDefault()
        Transforms.setNodes(
          editor,
          { type: 'fade' },
          { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
        )
        break
      }

      case 'b': {
        e.preventDefault()
        CustomEditor.toggleBoldMark(editor)
        break
      }

      case 'i': {
        e.preventDefault()
        CustomEditor.toggleItalicMark(editor)
        break
      }
    }
  }

  const renderElement = useCallback((props: RenderElementsProps) => {
    switch (props.element.type) {
      case 'heading':
        return <HeadingElement {...props} />
      case 'description':
        return <DefaultElement {...props} />
      case 'character':
        return <CharacterElement {...props} />
      case 'dialog':
        return <DialogElement {...props} />
      case 'fade':
        return <FadeElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  const renderLeaf = useCallback((props: LeafProps) => {
    return <Leaf {...props} />
  }, [])

  const debouncedSave = useCallback(
    debounce((value: Descendant[]) => {
      const content = JSON.stringify(value)
      localStorage.setItem('ctlst-user-screenplay', content)
    }, 2000), []
  )

  const handleEditorChange = (value: Descendant[]) => {
    debouncedSave(value)
  }

  useEffect(() => {
    YjsEditor.connect(editor)
    return () => YjsEditor.disconnect(editor)
  }, [editor])

  return (
    <div className="shrink-0 pt-20 font-screenplay border rounded-[10px] text-[1rem]">
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={handleEditorChange}
      >
        <Cursors>
          <Editable
            id="screenplay"
            onKeyDown={handleKeyDown}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            className="outline-none p-20 w-[816px] min-h-[416px]"
          />
        </Cursors>
      </Slate>
    </div>
  )
}

const Screenplay = () => {
  const [connected, setConnected] = useState<boolean>(false)
  const [sharedType, setSharedType] = useState<Y.XmlText>()
  const [provider, setProvider] = useState<HocuspocusProvider>()
  const currUser = JSON.parse(localStorage.getItem('ctlst-user') || '')

  const connectToServerAsync = async () => {
    const token = currUser.token
    const yDoc = new Y.Doc()
    const sharedDoc = yDoc.get('screenwriter', Y.XmlText)
    const yProvider = new HocuspocusProvider({
      url: weburl,
      name: 'ctlst-screenwriter',
      document: yDoc,

      token
    })
    yProvider.on('sync', () => {
      setConnected(true)
    })
    yProvider.forceSync()
    setSharedType(sharedDoc)
    setProvider(yProvider)

    return () => {
      yDoc?.destroy()
      yProvider?.off('sync', setConnected)
      yProvider?.destroy()
    }
  }

  useEffect(() => {
    connectToServerAsync()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!connected || !sharedType || !provider) {
    return <div className='w-screen h-screen flex justify-center items-center'>
      <FadeLoader />
    </div>
  }

  return (
    <ScreenEditor
      username={currUser.username || ''}
      connectToServerAsync={connectToServerAsync}
      sharedType={sharedType}
      provider={provider}
    />
  )
}

export default Screenplay