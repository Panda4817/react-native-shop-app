import React, {useEffect} from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  Platform
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
	HeaderButtons,
	Item,
} from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";

import Colors from '../../constants/Colors';
import * as cartActions from '../../store/actions/cart';

const ProductDetailScreen = props => {
  const productId = props.route.params.productId;
  const selectedProduct = useSelector(state =>
    state.products.availableProducts.find(prod => prod.id === productId)
  );
  const cartItems = useSelector(
		(state) => state.cart.totalItems
	);
  const dispatch = useDispatch();

  useEffect(() => {
		props.navigation.setOptions({
			headerRight: () => (
				<HeaderButtons HeaderButtonComponent={HeaderButton}>
					<Item
						title="Cart"
						iconName={
							Platform.OS === "android"
								? "md-cart"
								: "ios-cart"
						}
						onPress={() => {
							props.navigation.navigate("Cart");
						}}
					></Item>
					<View style={styles.cartNumContainer}>
						<Text style={styles.cartNum}>{cartItems}</Text>
					</View>
				</HeaderButtons>
			),
		})
	}, [cartItems])

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
      <View style={styles.actions}>
        <Button
          color={Colors.primary}
          title="Add to Cart"
          onPress={() => {
            dispatch(cartActions.addToCart(selectedProduct));
          }}
        />
      </View>
      <Text style={styles.price}>£{selectedProduct.price.toFixed(2)}</Text>
      <Text style={styles.description}>{selectedProduct.description}</Text>
    </ScrollView>
  );
};

export const screenOptions = navData => {
  return {
    headerTitle: navData.route.params.productTitle
  };
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 300
  },
  actions: {
    marginVertical: 10,
    alignItems: 'center'
  },
  price: {
    fontSize: 20,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'open-sans-bold'
  },
  description: {
    fontFamily: 'open-sans',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20
  },
  cartNum: {
		color: Platform.OS === 'android' ? Colors.primary: 'white',
		fontFamily: 'open-sans',
		fontSize: 15,
		textAlign: 'center',
		textAlignVertical: 'center',
		borderWidth: 1,
		borderColor: Platform.OS === 'android' ? 'white' : Colors.primary,
	},
	cartNumContainer: {
		borderRadius: 100,
		overflow: 'hidden',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Platform.OS === 'android' ? 'white' : Colors.primary,
		width: '50%',
		height: Platform.OS === 'android' ? '80%' : '90%',
	}
});

export default ProductDetailScreen;
