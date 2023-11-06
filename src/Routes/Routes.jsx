import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home/Home";
import ImageProvider from "../Providers/ImageProvider";

const router = createBrowserRouter([
	{
		path: "/",
		element: <ImageProvider><Home /></ImageProvider>,
	},
]);

export default router;
