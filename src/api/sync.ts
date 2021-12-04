import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://bsync.herokuapp.com/api/',
  timeout: 30000,
});

export type TBookmark = { chapter: number; paragraph: number };

export const syncApi = {
  setBookmark: async (body: { id: string; bookmark: TBookmark }) => {
    await instance.put(`bookmark`, body);
  },

  getBookmark: async (id: string) => {
    const result = await instance.get<TBookmark>(`bookmark?id=${id}`);
    return result.data;
  },
};
