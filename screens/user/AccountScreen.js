import React, {
	useState,
	useEffect,
	useReducer,
	useCallback,
} from "react";
import {
	ScrollView,
	View,
	KeyboardAvoidingView,
	StyleSheet,
	Button,
	ActivityIndicator,
	Alert,
	Text,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import {
	HeaderButtons,
	Item,
} from "react-navigation-header-buttons";

import HeaderButton from "../../components/UI/HeaderButton";
import Input from "../../components/UI/Input";
import Card from "../../components/UI/Card";
import Colors from "../../constants/Colors";
import * as authActions from "../../store/actions/auth";
import * as productsActions from "../../store/actions/products";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
	if (action.type === FORM_INPUT_UPDATE) {
		const updatedValues = {
			...state.inputValues,
			[action.input]: action.value,
		};
		const updatedValidities = {
			...state.inputValidities,
			[action.input]: action.isValid,
		};
		let updatedFormIsValid = true;
		for (const key in updatedValidities) {
			updatedFormIsValid =
				updatedFormIsValid && updatedValidities[key];
		}
		return {
			formIsValid: updatedFormIsValid,
			inputValidities: updatedValidities,
			inputValues: updatedValues,
		};
	}
	return state;
};

const AccountScreen = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();
	const dispatch = useDispatch();
	const { token, email } = useSelector(
		(state) => state.auth
	);
	const userProducts = useSelector(
		(state) => state.products.userProducts
	);

	const [formState, dispatchFormState] = useReducer(
		formReducer,
		{
			inputValues: {
				email: "",
			},
			inputValidities: {
				email: false,
			},
			formIsValid: false,
		}
	);

	useEffect(() => {
		if (error) {
			Alert.alert("An Error Occurred!", error, [
				{ text: "Okay" },
			]);
		}
	}, [error]);

	const resetEmailHandler = async () => {
		setError(null);
		setIsLoading(true);
		try {
			await dispatch(
				authActions.resetEmail(
					token,
					formState.inputValues.email
				)
			);
			Alert.alert(
				"Email changed!",
				"Verify new email and login again.",
				[{ text: "Okay" }]
			);
		} catch (err) {
			setError(err.message);
			setIsLoading(false);
		}
	};

	const resetPasswordHandler = async () => {
		setError(null);
		setIsLoading(true);
		try {
			dispatch(authActions.resetPassword(email));
			Alert.alert(
				"Check your email!",
				"Password reset email sent",
				[{ text: "Okay" }]
			);
		} catch (err) {
			setError(err.message);
			setIsLoading(false);
		}
	};

	const deleteAccountHandler = async () => {
		setError(null);
		Alert.alert(
			"Are you sure?",
			"Do you really want to delete your account?",
			[
				{ text: "No", style: "default" },
				{
					text: "Yes",
					style: "destructive",
					onPress: async () => {
						setIsLoading(true);
						try {
							await userProducts.map((item) =>
								dispatch(
									productsActions.deleteProduct(item.id)
								)
							);
							await dispatch(
								authActions.deleteAccount(token)
							);
							Alert.alert("Account Deleted", "Bye :(", [
								{ text: "Okay" },
							]);
						} catch (err) {
							setError(err.message);
							setIsLoading(false);
						}
					},
				},
			]
		);
	};

	const inputChangeHandler = useCallback(
		(inputIdentifier, inputValue, inputValidity) => {
			dispatchFormState({
				type: FORM_INPUT_UPDATE,
				value: inputValue,
				isValid: inputValidity,
				input: inputIdentifier,
			});
		},
		[dispatchFormState]
	);

	return (
		
		
		<KeyboardAvoidingView
			behavior="padding"
			keyboardVerticalOffset={50}
			style={styles.screen}
		>
			<ScrollView contentContainerStyle={Platform.OS == 'ios' ? styles.screen : {}}>
			<LinearGradient
				colors={["#e8fbe8", "#d2f8d2"]}
				style={styles.gradient}
			>
				
				<View style={styles.textContainer}>
					<Text style={styles.small}>Note: All actions below will log you out!</Text>
				</View>
				<Card style={styles.authContainer}>
						<View style={styles.textContainer}>
							<Text style={styles.text}>Change E-Mail</Text>
						</View>
						<Input
							id="email"
							label="New E-Mail"
							keyboardType="email-address"
							required
							email
							autoCapitalize="none"
							errorText="Please enter a valid email address."
							onInputChange={inputChangeHandler}
							initialValue={email}
						/>
						<View style={styles.buttonContainer}>
							{isLoading ? (
								<ActivityIndicator
									size="small"
									color={Colors.primary}
								/>
							) : (
								<Button
									title="Change Email"
									color={Colors.primary}
									onPress={resetEmailHandler}
								/>
							)}
						</View>
				</Card>
				<Card style={styles.authContainer}>
						<View style={styles.textContainer}>
							<Text style={styles.text}>
								Change Password
							</Text>
						</View>
						<View style={styles.buttonContainer}>
							{isLoading ? (
								<ActivityIndicator
									size="small"
									color={Colors.primary}
								/>
							) : (
								<Button
									title="Reset Password"
									color={Colors.primary}
									onPress={resetPasswordHandler}
								/>
							)}
						</View>
				</Card>
				<Card style={styles.authContainer}>
					<View style={styles.textContainer}>
						<Text style={styles.text}>
							Remove Account
						</Text>
					</View>
					<View style={styles.buttonContainer}>
						{isLoading ? (
							<ActivityIndicator
								size="small"
								color={Colors.primary}
							/>
						) : (
							<Button
								title="Delete Account"
								color='red'
								onPress={deleteAccountHandler}
							/>
						)}
					</View>
				</Card>
				
			</LinearGradient>
			</ScrollView>
		</KeyboardAvoidingView>
		
	);
};

export const screenOptions = (navData) => {
	return {
		headerTitle: "Account Settings",
		headerLeft: () => (
			<HeaderButtons HeaderButtonComponent={HeaderButton}>
				<Item
					title="Menu"
					iconName={
						Platform.OS === "android"
							? "md-menu"
							: "ios-menu"
					}
					onPress={() => {
						navData.navigation.toggleDrawer();
					}}
				/>
			</HeaderButtons>
		),
	};
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	gradient: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	authContainer: {
		width: "80%",
		maxWidth: 400,
		maxHeight: 400,
		padding: 20,
		margin: 10,
	},
	buttonContainer: {
		marginTop: 10,
	},
	text: {
		fontFamily: "open-sans",
		color: Colors.accent,
		padding: 10,
		textAlign: "center",
		fontSize: 20,
	},
	small: {
		fontSize: 12,
		padding: 10
	},
});

export default AccountScreen;
