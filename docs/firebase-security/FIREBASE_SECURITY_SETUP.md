# Como Aplicar as Regras de Segurança do Firebase

## 🚨 URGENTE - SEU BANCO EXPIRA EM 2 DIAS!

Siga estes passos para aplicar as novas regras de segurança:

## 1. Habilitar Autenticação Anônima (NOVO!)

1. Vá para [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto "Nonogram"
3. No menu lateral, clique em **"Authentication"**
4. Clique na aba **"Sign-in method"**
5. Clique em **"Anonymous"**
6. **Ative o toggle** "Enable"
7. Clique em **"Save"**

## 2. Aplicar Regras de Segurança

1. No menu lateral, clique em **"Firestore Database"**
2. Clique na aba **"Regras"**

## 3. Substitua as Regras Atuais

1. Você verá o código atual que expira em 2025-09-05
2. **Selecione todo o conteúdo** (Ctrl+A)
3. **Delete tudo**
4. **Copie todo o conteúdo** do arquivo `firestore.rules` que foi criado
5. **Cole no editor** do Firebase Console

## 4. Teste as Regras (Recomendado)

1. Clique no botão **"Simular"**
2. Configure um teste básico:
   - **Tipo**: `get`
   - **Localização**: `/rooms/test-room-123`
   - **Autenticação**: Marque "Autenticado" e coloque um UID fictício
3. Clique em **"Executar"**

## 5. Publique as Regras

1. Clique no botão **"Publicar"**
2. Confirme a publicação

## ✅ O que essas regras fazem:

### 🔒 **Segurança por Autenticação**

- Apenas usuários autenticados podem acessar salas
- Usuários só podem ver salas onde estão participando
- **Autenticação automática anônima** - usuários são autenticados automaticamente

### 🎮 **Controle de Salas**

- **Criar sala**: Apenas usuários autenticados
- **Entrar na sala**: Máximo 8 jogadores, apenas em salas "waiting"
- **Ver salas**: Qualquer usuário autenticado pode ver salas em status "waiting"
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

## 🧪 **Como Testar**

### ✅ **Teste Normal (deve funcionar):**

1. Abra http://localhost:5174/
2. Crie uma sala com um nome
3. Copie o link da sala
4. Abra o link em **nova aba normal** (não anônima)
5. Entre na sala com outro nome

### ❌ **Teste de Segurança (deve funcionar agora):**

1. Abra o link da sala em **janela anônima**
2. Deve conseguir ver a sala em status "waiting"
3. Deve conseguir entrar na sala
4. **NÃO** deve conseguir ver salas em jogo (status "playing")

## 🚨 Se algo der errado:

### Erro "Permission denied" ou "Missing permissions"

1. **Primeira coisa**: Verifique se habilitou **Authentication → Anonymous** no Firebase
2. Verifique se aplicou as novas regras de segurança
3. Verifique se o usuário está autenticado (deve aparecer loading na tela)
4. Para salas em jogo: apenas jogadores na sala podem acessar

### Erro "Failed to create room"

1. Verifique se habilitou **Authentication → Anonymous** no Firebase
2. Verifique se aplicou as regras de segurança
3. Abra o console do navegador (F12) para ver erros detalhados

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
