import { useContext } from "react";
import DraggableImageContainer from "./DraggableImageContainer";
import { ImageContext } from "../../Providers/ImageProvider";
import { Link } from "react-router-dom";

const Home = () => {
	const { images, selectedImages, deleteFromImages } =
		useContext(ImageContext);

	return (
		<div className="bg-[#EDF2F7] min-h-screen cursor-default">
			{/* main container */}
			<div className="lg:w-[1000px] h-full mx-auto pt-5 px-5">
				<div className="bg-white rounded-lg shadow">
					{/* top side */}
					<div className="w-full px-[25px] py-[10px] border-b-2">
						{/* if selected image is none show gallery */}
						{selectedImages.length == 0 && (
							<div className="text-left font-bold leading-[120%] text-[rgb(32,33,34)]">
								Gallery
							</div>
						)}
						{/* if image selected */}
						{selectedImages.length !== 0 && (
							<div className="text-left font-bold leading-[120%] flex items-center justify-between">
								{/* checkbox */}
								<div className="flex items-center justify-center gap-2 text-[rgb(32,33,34)]">
									<input type="checkbox" checked onChange={(e)=> e.preventDefault()} name="" id="" />
									<div>{selectedImages.length} File Selected</div>
								</div>
								{/* delete  */}
								<div
									onClick={() => deleteFromImages(images, selectedImages)}
									className="text-[rgb(255,35,5)]"
								>
									Delete file
								</div>
							</div>
						)}
					</div>
					{/* image container */}
					<div className="w-full ">
						<DraggableImageContainer />
					</div>
				</div>
			</div>
			{/* footer */}
			<footer className="bottom-0 w-full p-2 text-center">
				Design By @ <Link className="text-blue-500" to="https://muhaiminul101.vercel.app/" >Md Muhaiminul</Link>
			</footer>
		</div>
	);
};

export default Home;
