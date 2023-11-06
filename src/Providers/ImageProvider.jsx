import React, { createContext, useState } from "react";

export const ImageContext = createContext(null);

const ImageProvider = ({ children }) => {
	// set default images array
	const [images, setImages] = useState([
		{
			id: "0",
			srcPath: "/images/image-11.jpeg",
		},
		{
			id: "1",
			srcPath: "/images/image-1.webp",
		},
		{
			id: "2",
			srcPath: "/images/image-2.webp",
		},
		{
			id: "3",
			srcPath: "/images/image-3.webp",
		},
		{
			id: "4",
			srcPath: "/images/image-4.webp",
		},
		{
			id: "5",
			srcPath: "/images/image-5.webp",
		},
		{
			id: "6",
			srcPath: "/images/image-6.webp",
		},
		{
			id: "7",
			srcPath: "/images/image-7.webp",
		},
		{
			id: "8",
			srcPath: "/images/image-8.webp",
		},
		{
			id: "9",
			srcPath: "/images/image-9.webp",
		},
		{
			id: "10",
			srcPath: "/images/image-10.jpeg",
		},
	]);
	// selected images
	const [selectedImages, setSelectedImages] = useState([]);

	function deleteFromImages(array1, array2) {
		const newImages = array1.filter(
			(item1) => !array2.some((item2) => item2.id === item1.id)
		);
		setImages(newImages);
		setSelectedImages([]);
	}

	function toggleImage(images, imageObject) {
		const array = [...images];

		const index = array.findIndex((item) => item.id === imageObject.id);

		if (index === -1) {
			// Image object is not in the array, so add it
			array.push(imageObject);
		} else {
			// Image object is already in the array, so remove it
			array.splice(index, 1);
		}

		setSelectedImages(array);
	}

	const imageInfo = {
		images,
		setImages,
		selectedImages,
		setSelectedImages,
		deleteFromImages,
		toggleImage,
	};

	return (
		<ImageContext.Provider value={imageInfo}>{children}</ImageContext.Provider>
	);
};

export default ImageProvider;
