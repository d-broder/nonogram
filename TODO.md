Obs.: para todos os itens da lista, ter em mente que devemos manter a estilização consistente com a já existente no projeto.

As instruções a seguir devem ser seguidas da seguinte forma: são 8 páginas a serem modificadas. Para cada uma, eu quero que você siga a estrutura conferindo se está igual a estrutura que estou pedindo. Pode demorar o tempo que for necessário, mas eu quero que siga igual o que estou pedindo.

Reformular a estrutura de todas as páginas seguindo as instruções:

- O "pageContent" é onde todo o conteúdo da página - excluindo o que será exibida na sidebar/topbar - será exibido. É uma área dentro da "pageContentArea" delimitando para que o conteúdo não fique muito espalhada pela "pageContentArea", para que o conteúdo não fique muito longes um dos outros para uma melhor experiência do usuário.
- No caso do mobile, a pageContent irá ocupar 100% do tamanho de pageContentArea.
- A sidebar ocupa 250px no lado esquerdo da tela e pageContentArea ocupa o restante do espaço disponível (isso já está configurado. Manter ou ajustar conforme necessário).
- A mobileTopBar ocupa 10% do tamanho da tela na parte superior e pageContentArea ocupa o restante (isso já está configurado. Manter ou ajustar conforme necessário).
- Todas as telas que tem algum botão de voltar para a tela anterior (Por exemplo, "← Back to Game Mode Selection"), este botão será subsituído por um ícone minimalista de "voltar".
- Os nomes das classes podem ser alteradas para algo que siga melhor as boas práticas e que sejam intuitivas.

## 1. HomePage

### 1.1 Single Player e Multiplayer (nesta tela ainda não há distinção)

#### 1.1.1 Desktop

```html
<div class="sideBar">
  <div class="projectTitle">Nonogram</div>
</div>
<div class="pageContentArea">
  <div class="pageContent"><!-- Conteúdo --></div>
</div>
```

#### 1.1.2 Mobile

```html
<div class="mobileTopBar">
  <div class="projectTitle">Nonogram</div>
</div>
<div class="pageContentArea">
  <div class="pageContent"><!-- Conteúdo --></div>
</div>
```

## 2. PuzzleSelectionPage (Junção de PuzzleTypePage e PuzzleSelectionPage)

### 2.1 Single Player

#### 2.1.1 Desktop

```html
<div class="sideBar">
  <div class="projectTitle">Nonogram</div>
</div>
<div class="pageContentArea">
  <div class="pageContent">
    <div class="backButton"><!-- Conteúdo --></div>
    <!-- Conteúdo -->
  </div>
</div>
```

#### 2.1.2 Mobile

```html
<div class="mobileTopBar">
  <div class="backButton"><!-- Conteúdo --></div>
  <div class="projectTitle">Nonogram</div>
</div>
<div class="pageContentArea">
  <div class="pageContent"><!-- Conteúdo --></div>
</div>
```

### 2.2 Multiplayer

#### 2.2.1 Desktop

```html
<div class="sideBar">
  <div class="projectTitle">Nonogram</div>
  <div class="roomInfo"><!-- Conteúdo --></div>
</div>
<div class="pageContentArea">
  <div class="pageContent"><!-- Conteúdo --></div>
</div>
```

#### 2.2.2 Mobile

##### 2.2.2.1 Recolhida

```html
<div class="mobileTopBar">
  <div class="backButton"><!-- Conteúdo --></div>
  <div class="projectTitle">Nonogram</div>
  <div class="hamburgerButton"><!-- Conteúdo --></div>
</div>
<div class="pageContentArea">
  <div class="pageContent"><!-- Conteúdo --></div>
</div>
```

##### 2.2.2.2 Expandida

```html
<div class="mobileTopBar">
  <div class="projectTitle">Nonogram</div>
  <div class="closeButton"><!-- Conteúdo --></div>
</div>
<div class="topBarExpanded">
  <div class="roomInfo"><!-- Conteúdo --></div>
</div>
```

## 3. GamePage

### 3.1 Single Player

#### 3.1.1 Desktop

```html
<div class="sideBar">
  <div class="projectTitle">Nonogram</div>
  <div class="subTitle"><!-- Conteúdo --></div>
  <div class="gameControls1"><!-- Conteúdo --></div>
  <div class="gameControls2">
    <div class="paintModePanel"><!-- Conteúdo --></div>
    <div class="zoomPanel"><!-- Conteúdo --></div>
    <div class="toggleButton"><!-- Conteúdo --></div>
  </div>
</div>
<div class="nonogramContainerArea">
  <div class="nonogramContainer">
    <!-- Sem o backButton -->
    <!-- Conteúdo -->
  </div>
</div>
```

#### 3.1.2 Mobile

```html
<div class="mobileTopBar">
  <div class="backButton"><!-- Conteúdo --></div>
  <div class="projectTitle">Nonogram</div>
</div>
<div class="nonogramContainerArea"><!-- Na GamePage versão mobile, "pageContentArea" ocupará verticalmente 80% da tela -->
  <div class="nonogramContainer"><!-- Conteúdo --></div>
</div>
<div class="mobileBottonBar"><!-- Ocupara verticalmente 10% da tela na parte de baixo -->
  <div class="gameControls2">
    <div class="paintModePanel"><!-- Conteúdo --></div>
    <div class="zoomPanel"><!-- Conteúdo --></div>
    <div class="toggleButton"><!-- Conteúdo --></div>
  </div>
</div>
```

### 3.2 Multiplayer

#### 3.2.1 Desktop

```html
<div class="sideBar">
  <div class="projectTitle">Nonogram</div>
  <div class="subTitle"><!-- Conteúdo --></div>
  <div class="gameControls1"><!-- Conteúdo --></div>
  <div class="gameControls2">
    <div class="paintModePanel"><!-- Conteúdo --></div>
    <div class="zoomPanel"><!-- Conteúdo --></div>
    <div class="toggleButton"><!-- Conteúdo --></div>
  </div>
  <div class="roomInfo"><!-- Conteúdo --></div>
</div>
<div class="pageContentArea">
  <div class="nonogramContainer">
    <!-- Sem o backButton -->
    <!-- Conteúdo -->
  </div>
</div>
```

#### 3.2.2 Mobile

##### 3.2.2.1 Recolhida

```html
<div class="mobileTopBar">
  <div class="backButton"><!-- Conteúdo --></div>
  <div class="projectTitle">Nonogram</div>
</div>
<div class="nonogramContainerArea"><!-- Na GamePage versão mobile, "pageContentArea" ocupará verticalmente 80% da tela -->
  <div class="nonogramContainer"><!-- Conteúdo --></div>
</div>
<div class="mobileBottonBar"><!-- Ocupara verticalmente 10% da tela na parte de baixo -->
  <div class="gameControls2">
    <div class="paintModePanel"><!-- Conteúdo --></div>
    <div class="zoomPanel"><!-- Conteúdo --></div>
    <div class="toggleButton"><!-- Conteúdo --></div>
  </div>
</div>
```

##### 3.2.2.2 Expandida

```html
<div class="mobileTopBar">
  <div class="projectTitle">Nonogram</div>
  <div class="closeButton"><!-- Conteúdo --></div>
</div>
<div class="topBarExpanded">
  <div class="subTitle"><!-- Conteúdo --></div>
  <div class="gameControls1"><!-- Conteúdo --></div>
  <div class="roomInfo"><!-- Conteúdo --></div>
</div>
```

## 4. CreateRoomPage

### 4.1 Multiplayer (apenas Multiplayer)

#### 4.1.1 Desktop

```html
<div class="sideBar">
  <div class="projectTitle">Nonogram</div>
</div>
<div class="pageContentArea">
  <div class="pageContent">
    <div class="backButton"><!-- Conteúdo --></div>
    <!-- Conteúdo -->
    </div>
</div>
```

#### 4.1.2 Mobile

```html
<div class="mobileTopBar">
  <div class="backButton"><!-- Conteúdo --></div>
  <div class="projectTitle">Nonogram</div>
</div>
<div class="pageContentArea">
  <div class="pageContent"><!-- Conteúdo --></div>
</div>
```

## 5. JoinRoomPage

### 5.1 Multiplayer (apenas Multiplayer)

#### 5.1.1 Desktop

```html
<div class="sideBar">
  <div class="projectTitle">Nonogram</div>
  <div class="roomInfo"><!-- Conteúdo --></div>
</div>
<div class="pageContentArea">
  <div class="nonogramContainer">
    <!-- Sem o backButton -->
    <!-- Conteúdo -->
  </div>
</div>
```

#### 5.2.2 Mobile

##### 5.2.2.1 Recolhida

```html
<div class="mobileTopBar">
  <!-- Sem o backButton -->
  <div class="projectTitle">Nonogram</div>
  <div class="hamburgerButton"><!-- Conteúdo --></div>
</div>
<div class="pageContentArea">
  <div class="pageContent"><!-- Conteúdo --></div>
</div>
```

##### 5.2.2.2 Expandida

```html
<div class="mobileTopBar">
  <div class="projectTitle">Nonogram</div>
  <div class="closeButton"><!-- Conteúdo --></div>
</div>
<div class="topBarExpanded">
  <div class="roomInfo"><!-- Conteúdo --></div>
</div>
```

## 6. WaitingRoomPage

### 6.1 Multiplayer (apenas Multiplayer)

#### 6.1.1 Desktop

```html
<div class="sideBar">
  <div class="projectTitle">Nonogram</div>
  <div class="roomInfo"><!-- Conteúdo --></div>
</div>
<div class="pageContentArea">
  <div class="nonogramContainer">
    <div class="backButton"><!-- Conteúdo --></div>
    <div> >
  </div>
</div>
```

#### 6.2.2 Mobile

##### 6.2.2.1 Recolhida

```html
<div class="mobileTopBar">
  <div class="backButton"><!-- Conteúdo --></div>
  <div class="projectTitle">Nonogram</div>
  <div class="hamburgerButton"><!-- Conteúdo --></div>
</div>
<div class="pageContentArea">
  <div class="statusContainer">
    <div class="loadingSpinner"></div>
    <p class="statusText">Waiting for creator to select a puzzle...</p>
  </div>
</div>
```

##### 6.2.2.2 Expandida

```html
<div class="mobileTopBar">
  <div class="projectTitle">Nonogram</div>
  <div class="closeButton"><!-- Conteúdo --></div>
</div>
<div class="topBarExpanded">
  <div class="roomInfo"><!-- Conteúdo --></div>
</div>
```

Para todos os itens a seguir, verifique a estrutura desejada em TODO.md

[ ] A página WaitingRoomPage ainda não está completa. Arrume:
  - Não conseguimos ver as informações dos participantes na versão de Desktop
  - Não conseguimos ver as informações dos participantes na versão mobile porque não está sendo possível expandir a topBar
[ ] Eu quero que na versão mobile e na Desktop da GamePage tenha a div gameControls2 (isso deve ser corrigido junto com o item seguinte)
[ ] Não está sendo exibido o botão toggleButton na versão Desktop (isso deve ser corrigido junto com o item anterior)
[ ] Eu reparei que em GamePage existe um div externa à pageContainer (a gamePageContainer). Isso não deveria acontecer, a pageContainer deveria ser a única div de nível superior, sendo um padrão para todas as páginas. Se isso se repetir em outra página, deve ser corrigido.
[ ] Eu quero que que "pageContentContainer" se comporte diferente na GamePage. Inclusive, nesta página em especial eu renomeei a div "pageContentContainer" para "nonogramContainerArea". Ela vai ter propriedades diferentes e ela vai comportar o nonogramContainer diretamente. Crie um CSS de uma forma que você achar melhor para esta classe, mas eu vou alterá-la manualmente depois