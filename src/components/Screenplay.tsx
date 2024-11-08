import { createEditor, BaseEditor, Descendant, Transforms, Element, Editor, BaseElement } from "slate"
import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from 'react'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { HocuspocusProvider } from '@hocuspocus/provider'

import * as Y from 'yjs'
import { Cursors } from "./Cursors"
import debounce from 'lodash.debounce'
import { colors } from "../utils/lists"
import { FadeLoader } from "react-spinners"

const isDev = import.meta.env.DEV
const weburl = isDev ? import.meta.env.VITE_WEBSOCKET_PORT_DEV : import.meta.env.VITE_WEBSOCKET_PORT_PROD

//* Components
import { Leaf } from './Screenplay/Leafs'
import { useMutation } from "@tanstack/react-query"
import { LeafProps, ScreenplayProps } from '../utils/types'
import { withCursors, withYjs, YjsEditor } from '@slate-yjs/core'
import { postScreenplay, updateScreenplayById } from "../api/apiCalls"
import { BreakElement, CharacterElement, DefaultElement, DialogElement, FadeElement, HeadingElement, PageElement } from './Screenplay/Elements'

type CustomElement = { type: 'page' | 'heading' | 'description' | 'character' | 'dialog' | 'fade' | 'break', children: CustomText[] | CustomElement[] }
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

const generateRandomColor = () => {
  const index = Math.floor(Math.random() * colors.length)
  return colors[index]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ScreenEditor = ({ sharedType, provider, username, documentId }: { sharedType: any, provider: any, connectToServerAsync: any, username: string, documentId: string | undefined }): ReactElement => {

  const screenplayRef = useRef<HTMLDivElement>(null)
  const [enterHappened, setEnterHappened] = useState<boolean>(false)

  const editor = useMemo(() => {
    const e = withReact(withCursors(withYjs(createEditor(), sharedType), provider.awareness, {
      data: {
        name: username,
        color: generateRandomColor()
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

  const [childrenCount, setChildrenCount] = useState<number>(editor.children.length)

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

  const insertContentIntoPage = (editor: BaseEditor & ReactEditor, contentNode: CustomElement) => {
    const { children } = editor
    const lastNodeIndex = children.length - 1
    let pageIndex = lastNodeIndex
    let pagePath = [pageIndex]

    const lastNode = children[pageIndex] as CustomElement

    if (!lastNode || lastNode.type !== 'page') {
      Transforms.insertNodes(
        editor,
        { type: 'page', children: [] },
        { at: [children.length] }
      )
      pageIndex = children.length
      pagePath = [pageIndex]
    }

    const insertionPath = pagePath.concat([(editor.children[pageIndex] as CustomElement)?.children?.length || 0])

    Transforms.insertNodes(
      editor,
      contentNode,
      {
        at: insertionPath,
      }
    )

    Transforms.select(editor, Editor.end(editor, insertionPath))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const lastPageIndex = editor.children.length - 1
    const lastPage = (editor.children[lastPageIndex] as CustomElement).children as CustomElement[]
    const prevType = lastPage.length > 0 ? (lastPage[lastPage.length - 1] as CustomElement).type : null

    if (e.key === 'Backspace' && prevType) {
      console.log(editor.children)
      if (childrenCount > editor.children.length) {
        //const lastBreak = editor.children.fin
        setChildrenCount(editor.children.length)
      }
    }

    if (e.key === 'Enter' && prevType) {

      console.log(prevType)

      setEnterHappened(!enterHappened)

      let newNode: CustomElement

      switch (prevType) {
        case 'heading': {
          e.preventDefault()
          newNode = {
            type: 'description',
            children: [{ text: '' }]
          }
          break
        }

        case 'description': {
          e.preventDefault()
          newNode = {
            type: 'description',
            children: [{ text: '' }]
          }
          break
        }

        case 'character': {
          e.preventDefault()
          newNode = {
            type: 'dialog',
            children: [{ text: '' }]
          }
          break
        }

        case 'dialog': {
          e.preventDefault()
          newNode = {
            type: 'character',
            children: [{ text: '' }]
          }
          break
        }

        default: {
          e.preventDefault()
          newNode = {
            type: 'description',
            children: [{ text: '' }]
          }
          break
        }
      }
      insertContentIntoPage(editor, newNode)
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
      case 'page':
        return <PageElement {...props} />
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
      case 'break':
        return <BreakElement {...props} />
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
      if (documentId && content.length > 0) {
        updateScreenplayById(documentId, content)
        return
      }
      //localStorage.setItem('ctlst-user-screenplay', content)
    }, 2000), []
  )

  const handleEditorChange = (value: Descendant[]) => {
    debouncedSave(value)
  }

  useEffect(() => {
    YjsEditor.connect(editor)
    return () => YjsEditor.disconnect(editor)
  }, [editor])

  console.log(editor.children)

  useEffect(() => {
    if (editor.children.length > 0 && (editor.children[0] as CustomElement).type !== 'page') {
      Transforms.wrapNodes(
        editor,
        { type: 'page', children: [] },
        {
          at: [0],
          match: n => Element.isElement(n) && n.type !== 'page'
        }
      )
    }
  }, [])

  return (
    <div ref={screenplayRef} className="shrink-0 font-screenplay border rounded-[10px] text-[1rem]">
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
            className="outline-none px-20 py-12 w-[816px] min-h-[416px]"
          />
        </Cursors>
      </Slate>
    </div>
  )
}

const Screenplay = ({ title = '', documentId, setDocumentId, isCollaboration }: ScreenplayProps) => {
  const [connected, setConnected] = useState<boolean>(false)
  const [sharedType, setSharedType] = useState<Y.XmlText>()
  const [provider, setProvider] = useState<HocuspocusProvider>()
  const currUser = JSON.parse(localStorage.getItem('ctlst-user') || '')

  const mutation = useMutation({
    mutationFn: postScreenplay,
    onSuccess: (res) => {
      connectToServerAsync(res.id)
      setDocumentId(res.id)
    },
    onError: (error) => {
      console.log(error.message)
    }
  })

  const connectToServerAsync = async (id: string) => {
    const token = currUser.token
    const yDoc = new Y.Doc()
    const sharedDoc = yDoc.get('screenplay', Y.XmlText)

    const yProvider = new HocuspocusProvider({
      url: weburl,
      name: id,
      document: yDoc,
      token
    })

    yProvider.on('sync', (isSynced: boolean) => {
      setConnected(true)
      console.log('Sync event - isSynced:', isSynced)
    })

    yProvider.on('status', ({ status }: { status: string }) => {
      console.log('Provider status:', status)
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
    if (!isCollaboration) mutation.mutate({ title, body: '' })
    else connectToServerAsync(documentId as string)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!connected || !sharedType || !provider) {
    return <div className='w-screen h-screen flex justify-center items-center'>
      <FadeLoader />
    </div>
  }

  return (
    <ScreenEditor
      documentId={documentId}
      username={currUser.username || ''}
      connectToServerAsync={connectToServerAsync}
      sharedType={sharedType}
      provider={provider}
    />
  )
}

export default Screenplay