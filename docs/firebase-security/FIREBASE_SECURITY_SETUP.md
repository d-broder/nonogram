# Como Aplicar as Regras de Segurança do Firebase

## 🚨 URGENTE - SEU BANCO EXPIRA EM 2 DIAS!

Siga estes passos para aplicar as novas regras de segurança:

## 1. Acesse o Console do Firebase

1. Vá para [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto "Nonogram"
3. No menu lateral, clique em **"Firestore Database"**
4. Clique na aba **"Regras"**

## 2. Substitua as Regras Atuais

1. Você verá o código atual que expira em 2025-09-05
2. **Selecione todo o conteúdo** (Ctrl+A)
3. **Delete tudo**
4. **Copie todo o conteúdo** do arquivo `firestore.rules` que foi criado
5. **Cole no editor** do Firebase Console

## 3. Teste as Regras (Recomendado)

1. Clique no botão **"Simular"**
2. Configure um teste básico:
   - **Tipo**: `get`
   - **Localização**: `/rooms/test-room-123`
   - **Autenticação**: Marque "Autenticado" e coloque um UID fictício
3. Clique em **"Executar"**

## 4. Publique as Regras

1. Clique no botão **"Publicar"**
2. Confirme a publicação

## ✅ O que essas regras fazem:

### 🔒 **Segurança por Autenticação**

- Apenas usuários autenticados podem acessar salas
- Usuários só podem ver salas onde estão participando

### 🎮 **Controle de Salas**

- **Criar sala**: Apenas usuários autenticados
- **Entrar na sala**: Máximo 8 jogadores
- **Sair da sala**: Com transferência automática de host
- **Deletar sala**: Apenas quando vazia

### 🧩 **Controle de Jogo**

- **Selecionar puzzle**: Apenas o criador da sala
- **Atualizar grade**: Apenas jogadores na sala durante o jogo
- **Marcar pistas**: Apenas jogadores na sala durante o jogo
- **Reset da sala**: Apenas o criador

### 🔄 **Migração de Estado**

- Permite migrar jogos single-player para multiplayer
- Controla quais campos podem ser atualizados

## 🚨 Se algo der errado:

### Erro "Permission denied"

1. Verifique se o usuário está autenticado
2. Verifique se o usuário está na sala que está tentando acessar
3. Verifique se a operação está sendo feita pelo usuário correto (ex: apenas criador pode selecionar puzzle)

### Teste Local

Você pode testar as regras localmente usando o Firebase Emulator:

```bash
npm install -g firebase-tools
firebase login
firebase init emulators
firebase emulators:start
```

## 📞 Suporte

Se encontrar problemas após aplicar as regras:

1. Verifique os logs do console do navegador
2. Teste as operações básicas do seu app
3. Use o simulador de regras no Firebase Console para debugar

**IMPORTANTE**: Aplique essas regras o quanto antes para evitar que seu banco seja bloqueado!
