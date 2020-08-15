import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, ToastAndroid, Picker, FlatList, TextInput } from 'react-native';
import socketIO from 'socket.io-client';

interface MessagesInterface {
	id: string;
	userDe: string;
	userPara: string;
	message: string;
}

//Declaração com let para ser iniciado no useEffect, e para ser usado em outros locais
let socket: SocketIOClient.Socket;

export default function App() {
	const [mensagems, setMensagems] = useState<MessagesInterface[]>([]);
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
		socket = socketIO('http://localhost:3000');

		//Escuta
		//Quando este client encontrar o servidor
		socket.on('connect', () => {
			//ToastAndroid.show('Chat - Conectado', ToastAndroid.LONG);
			socket.emit('login', userLogado, userDestino);
		});

		//Escuta
		//Este evento recebe tudo que vier do evento 'message' do servidor
		socket.on('oldmessages', (data: MessagesInterface[]) => {
			//ToastAndroid.show(data, ToastAndroid.LONG);
			data.forEach(msg => {
				setMensagems(prev => [...prev, msg]);
			});
		});

		//Escuta
		//Este evento recebe tudo que vier do evento 'message' do servidor
		socket.on('messageroom', (data: MessagesInterface) => {
			//ToastAndroid.show(data, ToastAndroid.LONG);
			setMensagems(prev => [...prev, data]);
		});

		//Escuta
		//Este evento recebe tudo que vier do evento 'ping' do servidor.
		socket.on('ping', (data: string) => {
			setPing(data || '');
		});

		//Escuta
		//Quando este client perder conexão
		socket.on('disconnect', (data: string) => {
			//ToastAndroid.show('Chat - Desconectado', ToastAndroid.LONG);
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
				<Picker.Item label="1 - Professor" value="1" />
				<Picker.Item label="2 - Aluno" value="2" />
				<Picker.Item label="3 - Aluno" value="3" />
				<Picker.Item label="4 - Professor" value="4" />
				<Picker.Item label="5 - Aluno" value="5" />
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
				<Picker.Item label="1 - Professor" value="1" />
				<Picker.Item label="2 - Aluno" value="2" />
				<Picker.Item label="3 - Aluno" value="3" />
				<Picker.Item label="4 - Professor" value="4" />
				<Picker.Item label="5 - Aluno" value="5" />
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
				renderItem={data =>
					data.item.userDe === userLogado ? (
						<Text
							style={{
								width: 300,
								borderBottomColor: 'black',
								borderBottomWidth: 1,
								fontSize: 15,
								fontWeight: '700',
								textAlign: 'right',
								padding: 5,
							}}
						>
							{data.item.message}
						</Text>
					) : (
						<Text
							style={{
								width: 300,
								borderBottomColor: 'black',
								borderBottomWidth: 1,
								fontSize: 15,
								padding: 5,
							}}
						>
							{data.item.message}
						</Text>
					)
				}
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
