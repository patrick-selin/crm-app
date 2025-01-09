// testItemModel.js
export interface TestItem {
  id: string;
  content: string;
  important: boolean;
}

// eslint-disable-next-line prefer-const
export let testItems: TestItem[] = [
  {
    id: "1",
    content: "Test Word 1",
    important: true,
  },
  {
    id: "2",
    content: "Test Word 2",
    important: false,
  },
  {
    id: "3",
    content: "Test Word 3",
    important: true,
  },
];

export const addTestItem = (newItem: TestItem): void => {
  testItems.push(newItem);
};
