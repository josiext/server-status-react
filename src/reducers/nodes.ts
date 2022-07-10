import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import initialState from "./initialState";
import { Node } from "../types/Node";
import { RootState } from "../store/configureStore";
import fetch from "cross-fetch";

export interface NodesState {
  list: Node[];
}

export const getNodeBlocks = createAsyncThunk(
  "nodes/getNodeBlocks",
  async (node: Node) => {
    const response = await fetch(`${node.url}/api/v1/blocks`);
    const data: {
      data: {
        id: string;
        attributes: {
          data: string;
        };
      }[];
    } = await response.json();
    return data.data.map((item) => ({
      id: item.id,
      data: item.attributes.data,
    }));
  }
);

export const checkNodeStatus = createAsyncThunk(
  "nodes/checkNodeStatus",
  async (node: Node) => {
    const response = await fetch(`${node.url}/api/v1/status`);
    const data: { node_name: string } = await response.json();
    return data;
  }
);

export const checkNodesStatus = createAsyncThunk(
  "nodes/checkNodesStatus",
  async (nodes: Node[], thunkAPI) => {
    const { dispatch } = thunkAPI;
    nodes.forEach((node) => {
      dispatch(checkNodeStatus(node));
    });
  }
);

export const nodesSlice = createSlice({
  name: "nodes",
  initialState: initialState().nodes as NodesState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkNodeStatus.pending, (state, action) => {
        const node = state.list.find((n) => n.url === action.meta.arg.url);
        if (node) node.loading = true;
      })
      .addCase(checkNodeStatus.fulfilled, (state, action) => {
        const node = state.list.find((n) => n.url === action.meta.arg.url);
        if (node) {
          node.online = true;
          node.loading = false;
          node.name = action.payload.node_name;
        }
      })
      .addCase(checkNodeStatus.rejected, (state, action) => {
        const node = state.list.find((n) => n.url === action.meta.arg.url);
        if (node) {
          node.online = false;
          node.loading = false;
        }
      })
      .addCase(getNodeBlocks.pending, (state, action) => {
        const node = state.list.find((n) => n.url === action.meta.arg.url);
        if (node) node.blocks.loading = true;
      })
      .addCase(getNodeBlocks.fulfilled, (state, action) => {
        const node = state.list.find((n) => n.url === action.meta.arg.url);
        if (node) {
          node.blocks.loading = false;
          node.blocks.data = action.payload;
        }
      })
      .addCase(getNodeBlocks.rejected, (state, action) => {
        const node = state.list.find((n) => n.url === action.meta.arg.url);
        if (node) {
          node.blocks.error = action.error?.message ?? "Api error";
          node.blocks.loading = false;
        }
      });
  },
});

export const selectNodes = (state: RootState) => state.nodes.list;
export default nodesSlice.reducer;
