import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
	closestCenter,
	DragOverlay,
	DndContext,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
	defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
	arrayMove,
	useSortable,
	SortableContext,
	sortableKeyboardCoordinates,
	rectSortingStrategy,
} from "@dnd-kit/sortable";
import { Wrapper } from "../ImageGallery/Wrapper";
import { List } from "../ImageGallery/List";
import { Item } from "../ImageGallery/Item";

const defaultInitializer = (index) => index;

export function createRange(length, initializer = defaultInitializer) {
	return [...new Array(length)].map((_, index) => initializer(index));
}

const images = [
	{
		id: "11",
		srcPath: "/images/image-1.webp",
	},
	{
		id: "22",
		srcPath: "/images/image-2.webp",
	},
	{
		id: "33",
		srcPath: "/images/image-3.webp",
	},
	{
		id: "44",
		srcPath: "/images/image-4.webp",
	},
	{
		id: "55",
		srcPath: "/images/image-5.webp",
	},
	{
		id: "66",
		srcPath: "/images/image-6.webp",
	},
	{
		id: "77",
		srcPath: "/images/image-7.webp",
	},
	{
		id: "88",
		srcPath: "/images/image-8.webp",
	},
	{
		id: "99",
		srcPath: "/images/image-9.webp",
	},
	{
		id: "100",
		srcPath: "/images/image-10.jpeg",
	},
	{
		id: "111",
		srcPath: "/images/image-11.jpeg",
	},
];

const dropAnimationConfig = {
	sideEffects: defaultDropAnimationSideEffects({
		styles: {
			active: {
				opacity: "0.5",
			},
		},
	}),
};

const screenReaderInstructions = {
	draggable: `
    To pick up a sortable item, press the space bar.
    While sorting, use the arrow keys to move the item.
    Press space again to drop the item in its new position, or press escape to cancel.
  `,
};

export function Sortable({
	activationConstraint,
	animateLayoutChanges,
	adjustScale = false,
	Container = List,
	collisionDetection = closestCenter,
	coordinateGetter = sortableKeyboardCoordinates,
	dropAnimation = dropAnimationConfig,
	getItemStyles = () => ({}),
	getNewIndex,
	handle = false,
	itemCount = 16,
	items: initialItems,
	isDisabled = () => false,
	measuring,
	modifiers,
	removable,
	renderItem,
	reorderItems = arrayMove,
	strategy = rectSortingStrategy,
	style,
	useDragOverlay = true,
	wrapperStyle = () => ({}),
}) {
	const [items, setItems] = useState(
		 [
            {
                id: "11",
                srcPath: "/images/image-1.webp",
            },
            {
                id: "22",
                srcPath: "/images/image-2.webp",
            },
            {
                id: "33",
                srcPath: "/images/image-3.webp",
            },
            {
                id: "44",
                srcPath: "/images/image-4.webp",
            },
            {
                id: "55",
                srcPath: "/images/image-5.webp",
            },
            {
                id: "66",
                srcPath: "/images/image-6.webp",
            },
            {
                id: "77",
                srcPath: "/images/image-7.webp",
            },
            {
                id: "88",
                srcPath: "/images/image-8.webp",
            },
            {
                id: "99",
                srcPath: "/images/image-9.webp",
            },
            {
                id: "100",
                srcPath: "/images/image-10.jpeg",
            },
            {
                id: "111",
                srcPath: "/images/image-11.jpeg",
            },
        ]
	);
	const [activeId, setActiveId] = useState(null);
	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint,
		}),
		useSensor(TouchSensor, {
			activationConstraint,
		}),
		useSensor(KeyboardSensor, {
			scrollBehavior: "Cypress" in window ? "auto" : undefined,
			coordinateGetter,
		})
	);
	const isFirstAnnouncement = useRef(true);
	const getIndex = (id) => items.indexOf(id);
	const getPosition = (id) => getIndex(id) + 1;
	const activeIndex = activeId ? getIndex(activeId) : -1;
	const handleRemove = removable
		? (id) => setItems((items) => items.filter((item) => item !== id))
		: undefined;
	const announcements = {
		onDragStart({ active: { id } }) {
			return `Picked up sortable item ${String(
				id
			)}. Sortable item ${id} is in position ${getPosition(id)} of ${
				items.length
			}`;
		},
		onDragOver({ active, over }) {
			// In this specific use-case, the picked up item's `id` is always the same as the first `over` id.
			// The first `onDragOver` event therefore doesn't need to be announced, because it is called
			// immediately after the `onDragStart` announcement and is redundant.
			if (isFirstAnnouncement.current === true) {
				isFirstAnnouncement.current = false;
				return;
			}

			if (over) {
				return `Sortable item ${
					active.id
				} was moved into position ${getPosition(over.id)} of ${items.length}`;
			}

			return;
		},
		onDragEnd({ active, over }) {
			if (over) {
				return `Sortable item ${
					active.id
				} was dropped at position ${getPosition(over.id)} of ${items.length}`;
			}

			return;
		},
		onDragCancel({ active: { id } }) {
			return `Sorting was cancelled. Sortable item ${id} was dropped and returned to position ${getPosition(
				id
			)} of ${items.length}.`;
		},
	};

	useEffect(() => {
		if (!activeId) {
			isFirstAnnouncement.current = true;
		}
	}, [activeId]);

	return (
		<DndContext
			accessibility={{
				announcements,
				screenReaderInstructions,
			}}
			sensors={sensors}
			collisionDetection={collisionDetection}
			onDragStart={({ active }) => {
				if (!active) {
					return;
				}

				setActiveId(active.id);
			}}
			onDragEnd={({ over }) => {
				setActiveId(null);

				if (over) {
					const overIndex = getIndex(over.id);
					if (activeIndex !== overIndex) {
						setItems((items) => reorderItems(items, activeIndex, overIndex));
					}
				}
			}}
			onDragCancel={() => setActiveId(null)}
			measuring={measuring}
			modifiers={modifiers}
		>
			<Wrapper style={style} center>
				<SortableContext items={items} strategy={strategy}>
					<Container>
						{items.map((value, index) => (
							<SortableItem
								key={value.id}
								id={value}
								handle={handle}
								index={index}
								style={getItemStyles}
								wrapperStyle={wrapperStyle}
								disabled={isDisabled(value)}
								renderItem={renderItem}
								onRemove={handleRemove}
								animateLayoutChanges={animateLayoutChanges}
								useDragOverlay={useDragOverlay}
								getNewIndex={getNewIndex}
							/>
						))}
					</Container>
				</SortableContext>
			</Wrapper>
			{useDragOverlay
				? createPortal(
						<DragOverlay
							adjustScale={adjustScale}
							dropAnimation={dropAnimation}
						>
							{activeId ? (
								<Item
									value={items[activeIndex]}
									handle={handle}
									renderItem={renderItem}
									wrapperStyle={wrapperStyle({
										active: { id: activeId },
										index: activeIndex,
										isDragging: true,
										id: items[activeIndex],
									})}
									style={getItemStyles({
										id: items[activeIndex],
										index: activeIndex,
										isSorting: activeId !== null,
										isDragging: true,
										overIndex: -1,
										isDragOverlay: true,
									})}
									dragOverlay
								/>
							) : null}
						</DragOverlay>,
						document.body
				  )
				: null}
		</DndContext>
	);
}

export function SortableItem({
	disabled,
	animateLayoutChanges,
	getNewIndex,
	handle,
	id,
	index,
	onRemove,
	style,
	renderItem,
	useDragOverlay,
	wrapperStyle,
}) {
	const {
		active,
		attributes,
		isDragging,
		isSorting,
		listeners,
		overIndex,
		setNodeRef,
		setActivatorNodeRef,
		transform,
		transition,
	} = useSortable({
		id,
		animateLayoutChanges,
		disabled,
		getNewIndex,
	});

	return (
		<Item
			ref={setNodeRef}
			value={id}
			disabled={disabled}
			dragging={isDragging}
			sorting={isSorting}
			handle={handle}
			handleProps={
				handle
					? {
							ref: setActivatorNodeRef,
					  }
					: undefined
			}
			renderItem={renderItem}
			index={index}
			style={style({
				index,
				id,
				isDragging,
				isSorting,
				overIndex,
			})}
			onRemove={onRemove ? () => onRemove(id) : undefined}
			transform={transform}
			transition={transition}
			wrapperStyle={wrapperStyle?.({ index, isDragging, active, id })}
			listeners={listeners}
			data-index={index}
			data-id={id}
			dragOverlay={!useDragOverlay && isDragging}
			{...attributes}
		/>
	);
}
