import { useRef } from "react";
import {
  Button,
  ComboBox,
  Input,
  ListBox,
  ListBoxItem,
  Popover,
} from "react-aria-components";
import {
  useFocusRing,
  useTagGroup,
  useTag,
  useDraggableCollection,
  useDraggableItem,
  mergeProps,
  ListKeyboardDelegate,
  useDroppableCollection,
  ListDropTargetDelegate,
  useDropIndicator,
  useHover,
  DragPreview,
} from "react-aria";
import {
  Item,
  useDraggableCollectionState,
  useDroppableCollectionState,
  useListState,
} from "react-stately";

import type { ReactNode } from "react";
import type {
  AriaTagGroupProps,
  AriaTagProps,
  DropIndicatorProps as OriginalDropIndicatorProps,
  DroppableCollectionReorderEvent,
} from "react-aria";
import type {
  DraggableCollectionState,
  DroppableCollectionState,
  Key,
  ListData,
  ListState,
  Node,
} from "react-stately";

type DropIndicatorProps = OriginalDropIndicatorProps & {
  dropState: DroppableCollectionState;
};

function DropIndicator(props: DropIndicatorProps) {
  const { dropState, ...rest } = props;
  const ref = useRef(null);
  const { dropIndicatorProps, isHidden, isDropTarget } = useDropIndicator(
    rest,
    dropState,
    ref
  );

  if (isHidden) {
    return null;
  }

  return <div {...dropIndicatorProps} role="row" ref={ref} />;
}

type ReorderableTagProps<T extends object> = AriaTagProps<T> & {
  state: ListState<T>;
  dragState: DraggableCollectionState;
  dropState: DroppableCollectionState;
};

function ReorderableTag<T extends object>(props: ReorderableTagProps<T>) {
  const { item, state, dragState, dropState } = props;

  const ref = useRef(null);

  const { focusProps, isFocusVisible } = useFocusRing({ within: true });
  const { hoverProps, isHovered } = useHover({});

  const { rowProps, gridCellProps, removeButtonProps } = useTag(
    props,
    state,
    ref
  );
  const { dragProps } = useDraggableItem({ key: item.key }, dragState);

  return (
    <>
      <DropIndicator
        target={{ type: "item", key: item.key, dropPosition: "before" }}
        dropState={dropState}
      />
      <div
        ref={ref}
        {...mergeProps(rowProps, dragProps, focusProps, hoverProps)}
        data-focus-visible={isFocusVisible || null}
        data-hovered={isHovered || null}
      >
        <div {...gridCellProps}>
          {item.rendered}
          <Button {...removeButtonProps}>x</Button>
        </div>
      </div>
      {state.collection.getKeyAfter(item.key) == null && (
        <DropIndicator
          target={{ type: "item", key: item.key, dropPosition: "after" }}
          dropState={dropState}
        />
      )}
    </>
  );
}

const TAG_DATA_FORMAT = "react-aria-playground/tag-data";

type ReorderableTagGroupProps<T extends object> = AriaTagGroupProps<T> & {
  onReorder: (e: DroppableCollectionReorderEvent) => void;
};

function ReorderableTagGroup<T extends object>(
  props: ReorderableTagGroupProps<T>
) {
  const ref = useRef(null);
  const state = useListState(props);

  const preview = useRef(null);
  const dragState = useDraggableCollectionState({
    ...props,
    collection: state.collection,
    selectionManager: state.selectionManager,
    preview,
    getItems: (keys) => {
      return [...keys]
        .map((key) => state.collection.getItem(key))
        .filter((item): item is Node<T> => item !== null)
        .map((item) => {
          return {
            [TAG_DATA_FORMAT]: item.textValue,
          };
        });
    },
    getAllowedDropOperations: () => ["move"],
  });
  useDraggableCollection(props, dragState, ref);

  const dropState = useDroppableCollectionState({
    ...props,
    collection: state.collection,
    selectionManager: state.selectionManager,
    acceptedDragTypes: [TAG_DATA_FORMAT],
  });
  const { collectionProps } = useDroppableCollection(
    {
      ...props,
      keyboardDelegate: new ListKeyboardDelegate(
        state.collection,
        state.disabledKeys,
        ref
      ),
      dropTargetDelegate: new ListDropTargetDelegate(state.collection, ref),
    },
    dropState,
    ref
  );

  const { gridProps } = useTagGroup(props, state, ref);

  return (
    <div {...mergeProps(collectionProps, gridProps)} ref={ref}>
      {[...state.collection].map((item) => (
        <ReorderableTag
          key={item.key}
          item={item}
          state={state}
          dragState={dragState}
          dropState={dropState}
        />
      ))}
      <DragPreview ref={preview}>
        {(items) => <div>{items[0][TAG_DATA_FORMAT]}</div>}
      </DragPreview>
    </div>
  );
}

type ReorderableTagFieldProps<T extends object> = {
  list: ListData<T>;
  selectedList: ListData<T>;
  renderTagLabel(item: T): ReactNode;
  renderComboBoxListItem(item: T): ReactNode;
  "aria-label": string;
};

export default function ReorderableTagField<T extends object>({
  list,
  selectedList,
  renderTagLabel,
  renderComboBoxListItem,
  "aria-label": ariaLabel,
}: ReorderableTagFieldProps<T>) {
  const handleReorder = (e: DroppableCollectionReorderEvent) => {
    if (e.target.dropPosition === "before") {
      selectedList.moveBefore(e.target.key, e.keys);
    } else if (e.target.dropPosition === "after") {
      selectedList.moveAfter(e.target.key, e.keys);
    }
  };

  const handleSelectionChange = (key: Key) => {
    const item = list.getItem(key);
    const isItemAlreadySelected =
      typeof selectedList.getItem(key) !== "undefined";
    if (typeof item !== "undefined" && !isItemAlreadySelected) {
      selectedList.append(item);
    }
    list.setFilterText("");
  };

  return (
    <div>
      <ReorderableTagGroup
        aria-label={ariaLabel}
        items={selectedList.items}
        selectionMode="single"
        selectedKeys={selectedList.selectedKeys}
        onSelectionChange={selectedList.setSelectedKeys}
        onRemove={(keys) => selectedList.remove(...keys)}
        onReorder={handleReorder}
      >
        {(item) => <Item>{renderTagLabel(item)}</Item>}
      </ReorderableTagGroup>
      <ComboBox
        items={list.items}
        onInputChange={list.setFilterText}
        onSelectionChange={handleSelectionChange}
      >
        <Input />
        <Popover>
          <ListBox<T>>
            {(item) => (
              <ListBoxItem>{renderComboBoxListItem(item)}</ListBoxItem>
            )}
          </ListBox>
        </Popover>
      </ComboBox>
    </div>
  );
}
