import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";

// Gera o HTML completo do mapa Leaflet com os marcadores
function gerarHTMLMapa(usuarios, lat, lon, zoom) {
  const markersJS = usuarios
    .map(
      (u) =>
        `L.marker([${u.latitude}, ${u.longitude}])
          .addTo(map)
          .bindPopup("<b>${u.nome}</b>")
          .openPopup();`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    #map { width: 100vw; height: 100vh; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map').setView([${lat}, ${lon}], ${zoom});
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    ${markersJS}
  </script>
</body>
</html>`;
}

export default function Main() {
  // Estados do formulário
  const [nome, setNome] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  // Lista de usuários cadastrados
  const [usuarios, setUsuarios] = useState([]);

  // Controla loading
  const [carregando, setCarregando] = useState(false);

  // Centro e zoom do mapa (começa no Brasil)
  const [mapaConfig, setMapaConfig] = useState({
    lat: -14.235,
    lon: -51.925,
    zoom: 4,
  });

  async function cadastrarUsuario() {
    if (!nome || !rua || !numero || !cidade || !estado) {
      Alert.alert("Campos obrigatórios", "Preencha todos os campos!");
      return;
    }

    setCarregando(true);

    try {
      // Solicita permissão de localização (exigida pelo expo-location para geocodeAsync)
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "Permissão de localização é necessária para geocodificar.");
        setCarregando(false);
        return;
      }

      // Monta o endereço completo para geocodificar
      const enderecoCompleto = `${rua}, ${numero}, ${cidade}, ${estado}, Brasil`;

      // Converte endereço → coordenadas via expo-location
      const resultados = await Location.geocodeAsync(enderecoCompleto);

      if (!resultados || resultados.length === 0) {
        Alert.alert(
          "Endereço não encontrado",
          "Não foi possível localizar o endereço. Verifique os dados e tente novamente."
        );
        setCarregando(false);
        return;
      }

      const { latitude, longitude } = resultados[0];

      // Adiciona o usuário à lista
      const novoUsuario = { nome, latitude, longitude };
      setUsuarios((prev) => [...prev, novoUsuario]);

      // Centraliza o mapa no endereço cadastrado
      setMapaConfig({ lat: latitude, lon: longitude, zoom: 15 });

      // Limpa o formulário
      setNome("");
      setRua("");
      setNumero("");
      setCidade("");
      setEstado("");

      Alert.alert("Sucesso!", `"${nome}" adicionado ao mapa!`);
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao buscar o endereço.");
      console.error(error);
    }

    setCarregando(false);
  }

  const htmlMapa = gerarHTMLMapa(usuarios, mapaConfig.lat, mapaConfig.lon, mapaConfig.zoom);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Mapa via WebView + Leaflet (sem API key) */}
      <WebView
        key={`${mapaConfig.lat}-${mapaConfig.lon}-${usuarios.length}`}
        style={styles.mapa}
        source={{ html: htmlMapa }}
        originWhitelist={["*"]}
      />

      {/* Formulário de cadastro */}
      <ScrollView style={styles.formulario} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>Cadastro de Usuário</Text>

        <Text style={styles.label}>Nome completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: João da Silva"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>Rua</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Av. Paulista"
          value={rua}
          onChangeText={setRua}
        />

        <Text style={styles.label}>Número</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 1000"
          value={numero}
          onChangeText={setNumero}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Cidade</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: São Paulo"
          value={cidade}
          onChangeText={setCidade}
        />

        <Text style={styles.label}>Estado (sigla)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: SP"
          value={estado}
          onChangeText={setEstado}
          maxLength={2}
          autoCapitalize="characters"
        />

        {carregando ? (
          <ActivityIndicator size="large" color="#4734db" style={{ marginVertical: 16 }} />
        ) : (
          <TouchableOpacity style={styles.botao} onPress={cadastrarUsuario}>
            <Text style={styles.botaoTexto}>Cadastrar no Mapa</Text>
          </TouchableOpacity>
        )}

        {/* Lista de usuários cadastrados */}
        {usuarios.length > 0 && (
          <View style={styles.listaContainer}>
            <Text style={styles.listaTitulo}>Usuários cadastrados ({usuarios.length})</Text>
            {usuarios.map((u, i) => (
              <Text key={i} style={styles.listaItem}>
                📍 {u.nome}
              </Text>
            ))}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapa: {
    flex: 1,
  },
  formulario: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    backgroundColor: "#f9f9f9",
  },
  botao: {
    backgroundColor: "#4734db",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  listaContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#f0eeff",
    borderRadius: 8,
    marginBottom: 32,
  },
  listaTitulo: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 8,
    color: "#4734db",
  },
  listaItem: {
    fontSize: 14,
    color: "#333",
    paddingVertical: 2,
  },
});