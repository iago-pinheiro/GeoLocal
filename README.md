# GeoLocal 📍

Aplicativo prático desenvolvido durante o 4° semestre do curso de **DSM (Desenvolvimento de Software Multiplataforma)** na **Fatec Franca**, para a matéria de **Programação de Dispositivos Móveis**.

## 📱 Sobre o Projeto

O **GeoLocal** é um aplicativo mobile que utiliza a API de localização do dispositivo para exibir a posição geográfica atual do usuário em um mapa, demonstrando o uso de geolocalização em aplicativos React Native.

## 🚀 Tecnologias Utilizadas

- **React Native** com **Expo**
- **expo-location** - Permissões e obtenção de localização
- **react-native-maps** - Exibição de mapas interativos

## 📋 Funcionalidades

- Solicitação de permissão de localização ao usuário
- Obtenção das coordenadas atuais (latitude e longitude)
- Exibição da localização em mapa interativo

## 🔧 Como Executar

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd GeoLocal
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Inicie o projeto:**
   ```bash
   npm start
   # ou
   expo start
   ```

4. **Execute em um dispositivo:**
   - Escaneie o QR Code com o app **Expo Go** (Android/iOS)
   - Ou pressione `a` para Android / `i` para iOS

## 📁 Estrutura do Projeto

```
GeoLocal/
├── src/
│   ├── hooks/
│   │   └── useLocation.js    # Hook personalizado para geolocalização
│   └── pages/
│       └── Main.js           # Tela principal do aplicativo
├── assets/                   # Ícones e imagens
├── App.js                    # Componente principal
├── app.json                  # Configurações do Expo
└── package.json              # Dependências e scripts
```

## 👥 Equipe

Desenvolvido por alunos do 4° semestre de DSM - Fatec Franca

## 📄 Licença

Projeto acadêmico desenvolvido para fins educacionais.
