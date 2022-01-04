import { ProductsState, ProductType } from "../../types";
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
// get products from Contentful
const contentful = require("contentful");
const client = contentful.createClient({
	space: "69zmk43v6ege",
	accessToken: "I6fhcXp5FM9WoNmysJAVDFS7n8s95Tn0OBL878kdmk0",
});

export const fetchProducts = createAsyncThunk(
	"products/loadProducts",
	async () => {
		const response1 = client.getEntries({
			content_type: "shoppingCart",
		});

		const response2 = await fetch("https://fakestoreapi.com/products");
		const allProducts = await Promise.all([response1, response2]);
		const contentfulProducts = allProducts[0].items;
		const fakeStoreProducts = await allProducts[1].json();
		const combinedProducts = contentfulProducts.concat(fakeStoreProducts);
		console.log(contentfulProducts);

		return combinedProducts;
	}
);
const initialState: ProductsState = {
	products: [],
	loading: "idle",
};

const ProductsSlice = createSlice({
	name: "Products",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchProducts.pending, (state, action) => {
				state.loading = "loading";
			})
			.addCase(fetchProducts.fulfilled, (state, action) => {
				state.loading = "success";
				state.products = action.payload.map(
					(product: any, id: number): ProductType => {
						if (product.metadata) {
							const {
								fields: {
									title,
									price,
									description,
									image: {
										fields: {
											file: { url: image },
										},
									},
								},
							} = product;
							return { id, title, price, image, total: 0, description };
						} else {
							const { id, title, price, image, description } = product;
							return { id, title, price, image, total: 0, description };
						}
					}
				);
			})
			.addCase(fetchProducts.rejected, (state, action) => {
				state.loading = "failed";
			});
	},
});

// selectors
export const selectProducts = (state: RootState) => state.products.products;
export const selectLoading = (state: RootState) => state.products.loading;

export const {} = ProductsSlice.actions;
export default ProductsSlice.reducer;