import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, ToastAndroid, Picker, FlatList, TextInput } from 'react-native';
import socketIO from 'socket.io-client';

//Declaração com let para ser iniciado no useEffect, e para ser usado em outros locais
let socket: SocketIOClient.Socket;

export default function App() {
	const [mensagems, setMensagems] = useState<string[]>([]);
	const [msg, setMsg] = useState('');
	const [userLogado, setUserLogado] = useState('0');
	const [userDestino, setUserDestino] = useState('0');
	const [ping, setPing] = useState('');

	//Ao acessar a primeira vez
	useEffect(() => {
		if (!userLogado || userLogado === '0') return;

		// socket = socketIO('http://192.168.1.10:3000', {
		// 	transports: ['websocket'],
		// });
		socket = socketIO('http://192.168.1.10:3000');

		//Escuta
		//Quando este client encontrar o servidor
		socket.on('connect', () => {
			//ToastAndroid.show('Chat - Conectado', ToastAndroid.LONG);
			socket.emit('login', userLogado, userDestino);
		});

		//Escuta
		//Quando este client perder conexão
		socket.on('disconnect', (data: string) => {
			//ToastAndroid.show('Chat - Desconectado', ToastAndroid.LONG);
		});

		//Escuta
		//Este evento recebe tudo que vier do evento 'message' do servidor
		socket.on('messageroom', (data: string) => {
			//ToastAndroid.show(data, ToastAndroid.LONG);
			setMensagems(prev => [...prev, data]);
		});

		//Escuta
		//Este evento recebe tudo que vier do evento 'ping' do servidor.
		socket.on('ping', (data: string) => {
			setPing(data || '');
		});
	}, [userLogado]);

	//Ao fechar ou dar novo build
	useEffect(() => {
		return () => {
			socket.disconnect();
		};
	}, []);

	const onEnviarTeste = () => {
		try {
			socket.emit('messageroom', msg, userLogado, userDestino);
			setMsg('');
		} catch (error) {}
	};

	return (
		<View style={styles.container}>
			<Text>Destino:</Text>
			<Picker
				selectedValue={userDestino}
				style={{
					height: 40,
					width: 300,
					textAlign: 'center',
				}}
				onValueChange={itemValue => {
					setUserDestino(itemValue);
				}}
			>
				<Picker.Item label="-" value="0" />
				<Picker.Item label="A" value="1" />
				<Picker.Item label="B" value="2" />
				<Picker.Item label="C" value="3" />
				<Picker.Item label="D" value="4" />
				<Picker.Item label="E" value="5" />
			</Picker>

			<Text>Origem:</Text>
			<Picker
				selectedValue={userLogado}
				style={{
					height: 40,
					width: 300,
					textAlign: 'center',
				}}
				onValueChange={itemValue => {
					setUserLogado(itemValue);
				}}
			>
				<Picker.Item label="-" value="0" />
				<Picker.Item label="A" value="1" />
				<Picker.Item label="B" value="2" />
				<Picker.Item label="C" value="3" />
				<Picker.Item label="D" value="4" />
				<Picker.Item label="E" value="5" />
			</Picker>

			<Text>{ping}</Text>
			<FlatList
				style={{
					backgroundColor: 'white',
					flex: 1,
					marginBottom: 20,
					marginTop: 20,
					borderColor: 'black',
					borderWidth: 1,
				}}
				data={mensagems}
				renderItem={data => (
					<Text
						style={{
							width: 300,
							borderBottomColor: 'black',
							borderBottomWidth: 1,
						}}
					>
						{data.item}
					</Text>
				)}
				keyExtractor={(item, index) => index.toString()}
			/>
			<TextInput
				style={{
					height: 50,
					width: 300,
					textAlign: 'center',
					marginBottom: 10,
					borderColor: 'black',
					borderWidth: 1,
					backgroundColor: 'white',
				}}
				value={msg}
				onChangeText={setMsg}
			/>
			<Button title="Enviar teste" onPress={onEnviarTeste}>
				<Text>Enviar teste</Text>
			</Button>
			<StatusBar style="auto" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'lightblue',
		alignItems: 'center',
		justifyContent: 'center',
		paddingBottom: 30,
		paddingTop: 80,
	},
});
