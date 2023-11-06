import { rectSortingStrategy } from "@dnd-kit/sortable";

import { Sortable } from "./Sortable";
import { GridContainer } from "../ImageGallery/GridContainer";
// grid container
const props = {
	adjustScale: true,
	Container: (props) => <GridContainer {...props} />,
	strategy: rectSortingStrategy,
	wrapperStyle: () => ({
		width: 140,
		height: 140,
	}),
};
// make first index larger
const LargeFirstTile = () => (
	<Sortable
		{...props}
		getItemStyles={({ index }) => {
			if (index === 0) {
				return {
					fontSize: "2rem",
				};
			}
			return {};
		}}
		wrapperStyle={({ index }) => {
			if (index === 0) {
				return {
					height: 350,
					width: 350,
					gridRowStart: "span 2",
					gridColumnStart: "span 2",
				};
			}

			return {
				width: 170,
				height: 170,
			};
		}}
	/>
);

export default LargeFirstTile;
