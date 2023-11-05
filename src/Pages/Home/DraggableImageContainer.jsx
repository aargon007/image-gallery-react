import React from "react";
import {
	arraySwap,
	defaultAnimateLayoutChanges,
	rectSortingStrategy,
	rectSwappingStrategy,
} from "@dnd-kit/sortable";

import { Sortable } from "./Sortable";
import { GridContainer } from "../ImageGallery/GridContainer";

const props = {
	adjustScale: true,
	Container: (props) => <GridContainer {...props} columns={5} />,
	strategy: rectSortingStrategy,
	wrapperStyle: () => ({
		width: 140,
		height: 140,
	}),
};

const LargeFirstTile = () => (
	<Sortable
		{...props}
		getItemStyles={({ index }) => {
			if (index === 0) {
				return {
					fontSize: "2rem",
					// padding: "36px 40px",
				};
			}

			return {};
		}}
		wrapperStyle={({ index }) => {
			if (index === 0) {
				return {
					height: 288,
					gridRowStart: "span 2",
					gridColumnStart: "span 2",
				};
			}

			return {
				width: 140,
				height: 140,
			};
		}}
	/>
);

export default LargeFirstTile;