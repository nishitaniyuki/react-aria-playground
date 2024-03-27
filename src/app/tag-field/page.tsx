"use client";

import { useListData } from "react-stately";

import ReorderableTagField from "./reorderable-tag-field";

const USERS = [
  { id: 1, name: "Paul McCartney" },
  { id: 2, name: "John Lennon" },
  { id: 3, name: "George Harrison" },
  { id: 4, name: "Ringo Starr" },
];

export default function TagFieldExample() {
  const usersList = useListData({
    initialItems: USERS,
    getKey: (item) => item.id,
    filter: (item, filterText) => {
      return item.name.includes(filterText);
    },
  });

  const selectedUsersList = useListData({
    initialItems: USERS.slice(0, 2),
    getKey: (item) => item.id,
  });

  return (
    <main>
      <h1>TagField Example</h1>
      <small>※ ComboBox is not working properly.</small>

      <ReorderableTagField
        aria-label="selected users"
        list={usersList}
        selectedList={selectedUsersList}
        renderTagLabel={(user) => user.name}
        renderComboBoxListItem={(user) => <span>{user.name}</span>}
      />
    </main>
  );
}
