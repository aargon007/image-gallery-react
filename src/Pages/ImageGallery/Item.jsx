import React, {
	useEffect,
	memo,
	forwardRef,
	useState,
	useContext,
} from "react";
import classNames from "classnames";

import { Remove } from "./components/Remove";
import { Handle } from "./components/Handle";

import styles from "./Item.module.css";
import { ImageContext } from "../../Providers/ImageProvider";

export const Item = memo(
	forwardRef(
		(
			{
				color,
				dragOverlay,
				dragging,
				disabled,
				fadeIn,
				handle,
				handleProps,
				height,
				index,
				listeners,
				onRemove,
				renderItem,
				sorting,
				style,
				transition,
				transform,
				value,
				wrapperStyle,
				...props
			},
			ref
		) => {
			// set hover state
			const [isHovered, setIsHovered] = useState(false);
			const {
				selectedImages,
				images,
				toggleImage,
				setSelectedImages,
			} = useContext(ImageContext);
			// Custom function to check if an element should not trigger drag
			const shouldNotDrag = (event) => {
				const nonDraggableSelectors = [".checkbox", ".no-drag"];
				return nonDraggableSelectors.some((selector) =>
					event.target.matches(selector)
				);
			};
			// Custom listeners to wrap the provided listeners with additional logic
			const customListeners = {
				...listeners,
				onMouseDown: (event) => {
					if (shouldNotDrag(event)) {
						event.stopPropagation();
					} else {
						setIsHovered(true);
						listeners.onMouseDown?.(event);
					}
				},
				onTouchStart: (event) => {
					console.log("Custom touch logic");
					listeners.onTouchStart(event);
				},
			};

			//
			useEffect(() => {
				if (!dragOverlay) {
					return;
				}
				document.body.style.cursor = "pointer";

				return () => {
					document.body.style.cursor = "pointer";
				};
			}, [dragOverlay]);

			return renderItem ? (
				renderItem({
					dragOverlay: !!dragOverlay,
					dragging: !!dragging,
					sorting: !!sorting,
					index,
					fadeIn: !!fadeIn,
					listeners,
					ref,
					style,
					transform,
					transition,
					value,
				})
			) : (
				<li
					className={classNames(
						styles.Wrapper,
						fadeIn && styles.fadeIn,
						sorting && styles.sorting,
						dragOverlay && styles.dragOverlay
					)}
					style={{
						...wrapperStyle,
						transition: [transition, wrapperStyle?.transition]
							.filter(Boolean)
							.join(", "),
						"--translate-x": transform
							? `${Math.round(transform.x)}px`
							: undefined,
						"--translate-y": transform
							? `${Math.round(transform.y)}px`
							: undefined,
						"--scale-x": transform?.scaleX ? `${transform.scaleX}` : undefined,
						"--scale-y": transform?.scaleY ? `${transform.scaleY}` : undefined,
						"--index": index,
						"--color": color,
						...style,
					}}
					ref={ref}
					onMouseEnter={(e) => {
						e.preventDefault;
						setIsHovered(true);
					}}
					onMouseLeave={() => setIsHovered(false)}
				>
					<div
						className={classNames(
							styles.Item,
							dragging && styles.dragging,
							handle && styles.withHandle,
							dragOverlay && styles.dragOverlay,
							disabled && styles.disabled,
							color && styles.color
						)}
						data-cypress="draggable-item"
						{...(!handle ? customListeners : undefined)}
						{...props}
						tabIndex={!handle ? 0 : undefined}
					>
						{/* {value.id} */}
						<img
							onMouseDown={(e) => e.stopPropagation()}
							src={value.srcPath}
							alt=""
							className={`w-full h-full ${
								selectedImages.includes(value) ? "opacity-40" : ""
							}
							 rounded-[4px]`}
						/>

						<div
							className={`absolute top-0 p-2 left-0 w-full h-full ${
								isHovered ? "bg-black opacity-60" : ""
							} transition-all rounded`}
						>
							{(isHovered === true || selectedImages.includes(value)) && (
								<input
									type="checkbox"
									className="w-5 h-5 checkbox"
									checked={selectedImages.includes(value)}
									onMouseDown={(e) => e.stopPropagation()}
									onChange={(e) => {
										// Handle checkbox change
										e.stopPropagation();
										toggleImage(selectedImages, value);
									}}
								/>
							)}
						</div>

						<span className={styles.Actions}>
							{onRemove ? (
								<Remove className={styles.Remove} onClick={onRemove} />
							) : null}
							{handle ? <Handle {...handleProps} {...listeners} /> : null}
						</span>
					</div>
				</li>
			);
		}
	)
);
