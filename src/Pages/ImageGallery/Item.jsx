import React, { useEffect, memo, forwardRef } from "react";
import classNames from "classnames";

import { Remove } from "./components/Remove";
import {Handle} from "./components/Handle";

import styles from "./Item.module.css";

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
			useEffect(() => {
				if (!dragOverlay) {
					return;
				}

				document.body.style.cursor = "grabbing";

				return () => {
					document.body.style.cursor = "";
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
						{...(!handle ? listeners : undefined)}
						{...props}
						tabIndex={!handle ? 0 : undefined}
					>
						{/* {value.id} */}
						<img src={value.srcPath} alt="" className="w-full h-full rounded-[4px]"/>
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
