import AsyncStorage from '@react-native-community/async-storage';
import { nanoid } from '@reduxjs/toolkit';
import { FileSystem } from 'react-native-unimodules';

const STORAGE_KEY = 'cached-epub-books';
const MAX_CACHE_SIZE = 10;
const CACHE_DIRECTORY = FileSystem.documentDirectory + 'cached-books/';

type RegisterItem = { id: string; dir: string };
type Items = RegisterItem[];
type Register = {
  _getRegister: () => Promise<Items>;
  _saveRegister: (register: Items) => void;
  set: (id: string) => Promise<RegisterItem>;
  /** get register item. Create new item if 'create' is true */
  get: (
    id: string,
    create?: boolean
  ) => Promise<{ item: RegisterItem; created: boolean }>;
  remove: (id: string) => Promise<void>;
  clear: () => Promise<void>;
};

export const register: Register = {
  _getRegister: async (): Promise<Items> => {
    const registerString = await AsyncStorage.getItem(STORAGE_KEY);
    const _items: RegisterItem[] = registerString
      ? JSON.parse(registerString)
      : [];
    if (_items.length > MAX_CACHE_SIZE - 1) {
      _items.pop();
    }
    return _items;
  },
  _saveRegister: (register) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(register));
  },

  async set(this: Register, id) {
    const _items = await this._getRegister();
    const existingIndex = _items.findIndex((item) => item.id === id);
    const newItem = { id, dir: CACHE_DIRECTORY + nanoid() + '/' };

    existingIndex > -1
      ? (_items[existingIndex] = newItem)
      : _items.unshift(newItem);

    this._saveRegister(_items);
    return newItem;
  },

  async get(this: Register, id, create = true) {
    const _items = await this._getRegister();
    const item = _items.find((item) => item.id === id);
    if (!item && create) {
      const created = await this.set(id);
      return { item: created, created: true };
    }
    return { item, created: false };
  },

  async remove(this: Register, id) {
    const _items = await this._getRegister();
    const itemIndex = _items.findIndex((item) => item.id === id);

    await FileSystem.deleteAsync(_items[itemIndex].dir);
    _items.splice(itemIndex, 1);
    this._saveRegister(_items);
  },

  async clear() {
    await FileSystem.deleteAsync(CACHE_DIRECTORY, { idempotent: true });
    await this._saveRegister([]);
  },
};
