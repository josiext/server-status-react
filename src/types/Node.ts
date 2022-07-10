export interface Block {
  id: string;
  data: string;
}

export interface Node {
  online: boolean;
  name: string;
  url: string;
  loading: boolean;
  blocks: {
    loading: boolean;
    error: null | string;
    data: Block[];
  };
}
