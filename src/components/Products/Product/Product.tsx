import {
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Paper,
	Typography,
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { ProductType } from "../../../types";
import { Box } from "@mui/system";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import {
	selectProducts,
	DISABLE_BUTTON,
} from "../../../features/Products/ProductsSlice";
import { ADD_TO_CART, INCREASE_ITEM } from "../../../features/CartSlice";
import { flex } from "./Product.styles";

// ====COMPONENT =====
const Product = (props: ProductType) => {
	const { id, title, price, image, description, disabled } = props;
	const PRODUCTS = useAppSelector(selectProducts);
	const dispatch = useAppDispatch();

	// Add To Cart
	const handleAddToCart = () => {
		PRODUCTS.map((product) => {
			if (product.id === id) {
				dispatch(ADD_TO_CART(product));
				// dispatch(INCREASE_ITEM(id));
				dispatch(DISABLE_BUTTON(id));
			} else return;
		});
	};
	return (
		<Box>
			<Paper elevation={3}>
				<Card sx={{ maxWidth: "100%" }}>
					<CardMedia component={"img"} height={"170"} alt="img" image={image} />
					<CardContent>
						<Box
							sx={{
								...flex,
								py: 0.1,
							}}
						>
							<Typography component="h4" variant="body2">
								{title.length > 20 ? title.slice(0, 20) + "..." : title}
							</Typography>
							<Typography component="h4" variant="body2">
								${price}
							</Typography>
						</Box>
						<Typography variant="body2" sx={{ mt: 1 }}>
							{description
								? description.length > 30
									? description.slice(0, 30).toLowerCase() + "..."
									: description
								: "Product"}
						</Typography>
					</CardContent>
					<CardActions>
						<Box flexGrow={1} />
						{disabled ? (
							<Button variant="text" disabled>
								in cart
							</Button>
						) : (
							<Button
								variant="text"
								disableElevation
								sx={{ "&:hover": { background: 0 } }}
								onClick={() => handleAddToCart()}
							>
								<ShoppingCartOutlinedIcon sx={{ color: "#000" }} />
							</Button>
						)}
					</CardActions>
				</Card>
			</Paper>
		</Box>
	);
};

export default Product;
