import React, { useContext, useEffect, useRef, useState } from "react";
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
import { ImageContext } from "../../Providers/ImageProvider";

const dropAnimationConfig = {
	sideEffects: defaultDropAnimationSideEffects({
		styles: {
			active: {
				opacity: "0.5",
				transition: "transform",
			},
		},
	}),
};

export const Sortable = ({
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
}) => {
	// set images
	const { images } = useContext(ImageContext);
	const [items, setItems] = useState(images);
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
	const activeIndex = activeId ? getIndex(activeId) : -1;

	const onDragOver = ({ active, over }) => {
		if (active.id !== over.id) {
			setItems((items) => {
				const oldIndex = items.findIndex((item) => item.id === active.id);
				let newIndex = items.findIndex((item) => item.id === over.id);
				// re-order items
				return arrayMove(items, oldIndex, newIndex);
			});
		}
	};

	const onDragEnd = ({ active, over }) => {
		setActiveId(null);

		if (active && over) {
			const activeIndex = getIndex(active.id);
			const overIndex = getIndex(over.id);

			if (activeIndex !== overIndex) {
				setItems((items) => reorderItems(items, activeIndex, overIndex));
			}
		}
	};

	useEffect(() => {
		if (!activeId) {
			isFirstAnnouncement.current = true;
		}
	}, [activeId]);

	// update images data
	useEffect(() => {
		setItems(images);
	}, [images.length]);

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={collisionDetection}
			onDragStart={({ active }) => {
				if (!active) {
					return;
				}

				setActiveId(active.id);
			}}
			onDragOver={onDragOver}
			onDragEnd={onDragEnd}
			onDragCancel={() => setActiveId(null)}
			measuring={measuring}
			modifiers={modifiers}
		>
			<Wrapper style={style} center>
				<SortableContext items={items} strategy={strategy}>
					<Container>
						{/* loop the images data  */}
						{items.map((value, index) => (
							<SortableItem
								key={index}
								id={value}
								handle={handle}
								index={index}
								style={getItemStyles}
								wrapperStyle={wrapperStyle}
								disabled={isDisabled(value)}
								renderItem={renderItem}
								animateLayoutChanges={animateLayoutChanges}
								useDragOverlay={useDragOverlay}
								getNewIndex={getNewIndex}
							/>
						))}
						{/* add image - static */}
						<div className="w-[170px] h-[170px] border-[2px] rounded border-gray-300 border-dashed bg-gray-50 flex items-center flex-col justify-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-6 h-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
								/>
							</svg>
							<div className="font-semibold text-gray-700">Add Images</div>
						</div>
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
};

export const SortableItem = ({
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
}) => {
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
};
