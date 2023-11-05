import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable as Droppable } from "../../helpers/StrictModeDroppable";
import { useState } from "react";
import DraggableImageContainer from "./DraggableImageContainer";


const Home = () => {
    // set default images array
    const [images, setImages] = useState([
        {
            id : "11",
            srcPath : "/images/image-1.webp"
        },
        {
            id : "22",
            srcPath : "/images/image-2.webp"
        },
        {
            id : "33",
            srcPath : "/images/image-3.webp"
        },
        {
            id : "44",
            srcPath : "/images/image-4.webp"
        },
        {
            id : "55",
            srcPath : "/images/image-5.webp"
        },
        {
            id : "66",
            srcPath : "/images/image-6.webp"
        },
        {
            id : "77",
            srcPath : "/images/image-7.webp"
        },
        {
            id : "88",
            srcPath : "/images/image-8.webp"
        },
        {
            id : "99",
            srcPath : "/images/image-9.webp"
        },
        {
            id : "100",
            srcPath : "/images/image-10.jpeg"
        },
        {
            id : "111",
            srcPath : "/images/image-11.jpeg"
        },
    ])
    // selected images
    const [selectedImages, setSelectedImages] = useState(null);

    const onDragEndColumns = (result) => {
        // Dropped outside the list
		if (!result.destination) return;

		const { source, destination } = result;

		// Re-ordering the images array
        const newImages = Array.from(images);
        const [reorderedItem] = newImages.splice(source.index, 1);
        newImages.splice(destination.index, 0, reorderedItem);
    
        // Setting the state to the new images order
        setImages(newImages);

	};

	// Helper function to reorder an array
	const reorderArray = (array, startIndex, endIndex) => {
		const result = [...array];
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);
		return result;
	};
	return (
		<div className="bg-[#EDF2F7]">
			{/* main container */}
			<div className="w-[1200px] h-full mx-auto pt-5">
				<div className="bg-white rounded-lg shadow">
					{/* top side */}
					<div className="w-full px-[25px] py-[10px] border-b-2">
						{/* if selected image is none show gallery */}
						<div className="text-left font-bold leading-[120%] text-[rgb(32,33,34)]">
							Gallery
						</div>
						{/* if image selected */}
						<div className="text-left font-bold leading-[120%] flex items-center justify-between">
							{/* checkbox */}
							<div className="flex items-center justify-center gap-2 text-[rgb(32,33,34)]">
								<input type="checkbox" name="" id="" />
								<div>1 File Selected</div>
							</div>
							{/* delete  */}
							<div className="text-[rgb(255,35,5)]">Delete file</div>
						</div>
					</div>
					{/* image container */}
					<div className="w-full p-[25px]">
						{/* <DragDropContext onDragEnd={onDragEndColumns}>
							<Droppable droppableId="images" direction="all">
								{(provided) => (
									<div
										ref={provided.innerRef}
										{...provided.droppableProps}
										className="inline-flex flex-wrap m-0"
									>
										{images &&
											images.map((image, index) => (
												<Draggable
													key={image?.id}
													draggableId={image?.id}
													index={index}
												>
													{(provided, snapshot, dragHandleProps) => (
														<div
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
															style={{
																...provided.draggableProps.style,
															}}
															className={` ${
																snapshot.isDragging
																	? "bg-[rgba(55,53,47,0.20)]"
																	: ""
															}`}
														>
															<img width={250} src={image.srcPath} alt="" />
														</div>
													)}
												</Draggable>
											))}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</DragDropContext> */}
                        <DraggableImageContainer/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
