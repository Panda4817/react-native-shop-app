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
import { useDispatch } from "react-redux";

import Input from "../../components/UI/Input";
import Card from "../../components/UI/Card";
import Colors from "../../constants/Colors";
import * as authActions from "../../store/actions/auth";

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

const ForgotPasswordScreen = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();
	const dispatch = useDispatch();

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

	const resetPasswordHandler = async () => {
		setError(null);
		setIsLoading(true);
		try {
			await dispatch(
				authActions.resetPassword(
					formState.inputValues.email
				)
			);
            Alert.alert("Check your email!", "Password reset email sent", [
                { text: "Okay" },
            ]);
            props.navigation.navigate("Auth");
		} catch (err) {
			setError(err.message);
			setIsLoading(false);
		}
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
			<LinearGradient
				colors={["#e8fbe8", "#d2f8d2"]}
				style={styles.gradient}
			>
				<View style={styles.textContainer}>
					<Text style={styles.text}>Reset Password</Text>
				</View>
				<Card style={styles.authContainer}>
					<ScrollView>
						<Input
							id="email"
							label="E-Mail"
							keyboardType="email-address"
							required
							email
							autoCapitalize="none"
							errorText="Please enter a valid email address."
							onInputChange={inputChangeHandler}
							initialValue=""
						/>
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
					</ScrollView>
				</Card>
			</LinearGradient>
		</KeyboardAvoidingView>
	);
};

export const screenOptions = {
	headerTitle: "The Secret Cacti Shop",
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	gradient: {
		flex: 1,
		justifyContent: "flex-start",
		alignItems: "center",
	},
	authContainer: {
		width: "80%",
		maxWidth: 400,
		maxHeight: 400,
		padding: 20,
	},
	buttonContainer: {
		marginTop: 10,
	},
	text: {
		fontFamily: "open-sans",
		color: Colors.accent,
		padding: 50,
		textAlign: "center",
		fontSize: 20,
	},
	small: {
		fontSize: 10,
	},
});

export default ForgotPasswordScreen;
