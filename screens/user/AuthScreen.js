import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
	ScrollView,
	View,
	KeyboardAvoidingView,
	StyleSheet,
	Button,
	ActivityIndicator,
	Alert,
	Text,
	TouchableOpacity,
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
			updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
		}
		return {
			formIsValid: updatedFormIsValid,
			inputValidities: updatedValidities,
			inputValues: updatedValues,
		};
	}
	return state;
};

const AuthScreen = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();
	const [isSignup, setIsSignup] = useState(false);
	const dispatch = useDispatch();

	const [formState, dispatchFormState] = useReducer(formReducer, {
		inputValues: {
			email: "",
			password: "",
		},
		inputValidities: {
			email: false,
			password: false,
		},
		formIsValid: false,
	});

	useEffect(() => {
		if (error) {
			Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
		}
	}, [error]);

	const authHandler = async () => {
		let action;
		if (isSignup) {
			action = authActions.signup(formState.inputValues.email, formState.inputValues.password);
		} else {
			action = authActions.login(formState.inputValues.email, formState.inputValues.password);
		}
		setError(null);
		setIsLoading(true);
		try {
			await dispatch(action);
			if (isSignup) {
				Alert.alert("Check your email!", "Verify your email first and then come back to login.", [
					{ text: "Okay" },
				]);
				setIsLoading(false);
			}
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
		<KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={1} style={styles.screen}>
			<LinearGradient colors={["#e8fbe8", "#d2f8d2"]} style={styles.gradient}>
				<View style={styles.textContainer}>
					<Text style={styles.text}>
						{isSignup ? "Sign Up " : "Login "}to buy and sell cacti related products!
					</Text>
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
						<Input
							id="password"
							label="Password"
							keyboardType="default"
							secureTextEntry
							required
							minLength={6}
							autoCapitalize="none"
							errorText="Please enter a valid password."
							onInputChange={inputChangeHandler}
							initialValue=""
							placeholder="minimum 6 characters"
						/>
						<View style={styles.buttonContainer}>
							{isLoading ? (
								<ActivityIndicator size="small" color={Colors.primary} />
							) : (
								<Button
									title={isSignup ? "Sign Up" : "Login"}
									color={Colors.primary}
									onPress={authHandler}
								/>
							)}
						</View>
						<View style={styles.buttonContainer}>
							<Button
								title={`Switch to ${isSignup ? "Login" : "Sign Up"}`}
								color={Colors.accent}
								onPress={() => {
									setIsSignup((prevState) => !prevState);
								}}
							/>
						</View>
						{isSignup ? null : (
							<View style={styles.buttonContainer}>
								<TouchableOpacity onPress={() => props.navigation.navigate("ForgotPassword")}>
									<Text style={styles.forgotText}>Forgot password?</Text>
								</TouchableOpacity>
							</View>
						)}
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
	forgotText: {
		fontSize: 15,
		fontFamily: "open-sans",
		color: "red",
		textAlign: "center",
	},
});

export default AuthScreen;
