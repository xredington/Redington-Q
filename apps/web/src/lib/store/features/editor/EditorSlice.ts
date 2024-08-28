import type { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../../createAppSlice";
import { Block, BlockSchema, DefaultInlineContentSchema, DefaultStyleSchema, defaultStyleSchema, InlineContentSchema, StyleSchema } from "@blocknote/core";
interface EditorSliceState {
  blocks: any[];
  isDocumentLoaded: boolean;
}

const initialState: EditorSliceState = {
  blocks: [
    {
      type: "heading",
      content: "Welcome to this note editor!",
      children: [],
    },
    {
      type: "paragraph",
      content: "Write your notes or documents here!",
      children: [],
    },
  ],
  isDocumentLoaded: false,
};

export const editorSlice = createAppSlice({
  name: "editor",
  initialState,
  reducers: (create) => (
    {
      updateDocument: create.reducer(
        (state, action: PayloadAction<any[]>) => {
          state.blocks = action.payload;
        }
      ),
      setDocumentLoaded: create.reducer((state, action: PayloadAction<boolean>) => {
        state.isDocumentLoaded = action.payload;
      }
      ),
    }
  ),
  selectors: {
    selectDocument: (state: EditorSliceState) => state.blocks,
    selectDocumentLoaded: (state: EditorSliceState) => state.isDocumentLoaded,
  },
});

export const { updateDocument, setDocumentLoaded } = editorSlice.actions;

export const { selectDocument, selectDocumentLoaded } = editorSlice.selectors;
