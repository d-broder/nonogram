```
Condições de gravação para regras de segurança do Cloud Firestore

bookmark_border
Este guia foi desenvolvido com base no guia Como estruturar regras de segurança. O objetivo dele é mostrar como adicionar condições ao Cloud Firestore Security Rules. Se você não estiver familiarizados com os conceitos básicos do Cloud Firestore Security Rules, consulte o guia Primeiras etapas.

O principal elemento básico do Cloud Firestore Security Rules é a condição. Uma condição é uma expressão booleana que determina se uma operação específica deve ser permitida ou negada. Use regras de segurança para criar condições que verifiquem a autenticação do usuário, validem dados recebidos ou acessem outras partes do seu banco de dados.

Observação: as bibliotecas de cliente do servidor ignoram todas as Cloud Firestore Security Rules e fazem a autenticação pelo serviço Application Default Credentials do Google. Se você estiver usando as bibliotecas de cliente do servidor ou as APIs REST ou RPC, configure o Identity and Access Management (IAM) para Cloud Firestore.
Autenticação
Um dos padrões de regras de segurança mais comuns é o controle do acesso com base no estado de autenticação do usuário. Por exemplo, seu aplicativo pode permitir que apenas usuários conectados gravem dados:


service cloud.firestore {
  match /databases/{database}/documents {
    // Allow the user to access documents in the "cities" collection
    // only if they are authenticated.
    match /cities/{city} {
      allow read, write: if request.auth != null;
    }
  }
}
Outro padrão comum é garantir que os usuários possam ler e gravar apenas os próprios dados:


service cloud.firestore {
  match /databases/{database}/documents {
    // Make sure the uid of the requesting user matches name of the user
    // document. The wildcard expression {userId} makes the userId variable
    // available in rules.
    match /users/{userId} {
      allow read, update, delete: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null;
    }
  }
}
Se o app usa o Firebase Authentication ou o Google Cloud Identity Platform, a variável request.auth contém as informações de autenticação para o cliente que solicita dados. Para mais informações sobre request.auth, consulte a documentação de referência.

Validação de dados
Muitos aplicativos armazenam informações de controle de acesso como campos em documentos no banco de dados. As Cloud Firestore Security Rules podem permitir ou negar acesso dinamicamente com base nos dados do documento:


service cloud.firestore {
  match /databases/{database}/documents {
    // Allow the user to read data if the document has the 'visibility'
    // field set to 'public'
    match /cities/{city} {
      allow read: if resource.data.visibility == 'public';
    }
  }
}
A variável resource refere-se ao documento solicitado, e resource.data é um mapa de todos os campos e valores armazenados no documento. Para mais informações sobre a variável resource, consulte a documentação de referência.

Ao gravar dados, pode ser necessário comparar as informações novas com as existentes. Nesse caso, se o conjunto de regras permitir a gravação pendente, a variável request.resource conterá o estado futuro do documento. Para operações update que apenas modificam um subconjunto dos campos do documento, a variável request.resource conterá o estado do documento pendente após a operação. É possível verificar os valores dos campos em request.resource para evitar atualizações de dados indesejados ou inconsistentes:


service cloud.firestore {
  match /databases/{database}/documents {
    // Make sure all cities have a positive population and
    // the name is not changed
    match /cities/{city} {
      allow update: if request.resource.data.population > 0
                    && request.resource.data.name == resource.data.name;
    }
  }
}
Acesso a outros documentos
Usando as funções get() e exists(), suas regras de segurança podem avaliar solicitações recebidas em relação a outros documentos no banco de dados. As funções get() e exists() aguardam caminhos de documento totalmente especificados. Ao usar variáveis a fim de criar caminhos para get() e exists(), é preciso escapá-las explicitamente usando a sintaxe $(variable).

No exemplo abaixo, a variável database é capturada pela instrução de correspondência match /databases/{database}/documents e usada para formar o caminho:


service cloud.firestore {
  match /databases/{database}/documents {
    match /cities/{city} {
      // Make sure a 'users' document exists for the requesting user before
      // allowing any writes to the 'cities' collection
      allow create: if request.auth != null && exists(/databases/$(database)/documents/users/$(request.auth.uid));

      // Allow the user to delete cities if their user document has the
      // 'admin' field set to 'true'
      allow delete: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.admin == true;
    }
  }
}
Para gravações, é possível usar a função getAfter() para acessar o estado de um documento após a conclusão de uma transação ou lote de gravações, mas antes da confirmação da transação ou do lote. Como get(), a função getAfter() usa um caminho de documento totalmente especificado. É possível usar getAfter() para definir conjuntos de gravações que precisam ocorrer juntos como uma transação ou um lote.

Limites de chamadas de acesso
Há limites nas chamadas de acesso a documentos por avaliação do conjunto de regras:

10 para solicitações de documento único e de consulta.
20 para leituras de vários documentos, transações e gravações em lote. O limite anterior de 10 também se aplica a cada operação.

Por exemplo, imagine que você crie uma solicitação de gravação em lote com três operações de gravação, e que suas regras de segurança usem duas chamadas de acesso a documentos para validar cada gravação. Nesse caso, cada gravação usa duas das 10 chamadas de acesso, e a solicitação de gravação em lote usa seis das 20 chamadas de acesso.

Ao exceder qualquer um desses limites, ocorrerá um erro de permissão negada. Algumas chamadas de acesso a documentos podem ser armazenadas em cache. Elas não entram na conta dos limites.

Para uma explicação detalhada de como esses limites afetam transações e gravações em lote, consulte o guia de proteção de operações atômicas.

Preços e chamadas de acesso
O uso dessas funções executa uma operação de leitura no banco de dados. Isso significa que você será faturado pela leitura de documentos, mesmo que as regras rejeitem a solicitação. Consulte os Preços do Cloud Firestore para informações de faturamento mais específicas.

Funções personalizadas
À medida que suas regras de segurança se tornam mais complexas, recomendamos reunir conjuntos de condições em funções que você pode reutilizar no seu conjunto de regras. As regras de segurança dão suporte a funções personalizadas. A sintaxe para funções personalizadas é um pouco parecida com JavaScript, mas as funções de regras de segurança são escritas em uma linguagem de programação específica de domínio com algumas limitações importantes:

As funções podem conter apenas uma única instrução return. Elas não podem conter nenhuma lógica adicional. Por exemplo, eles não podem executar loops ou chamar serviços externos.
As funções podem acessar automaticamente funções e variáveis do escopo em que são definidas. Por exemplo, uma função definida no escopo service cloud.firestore tem acesso à variável resource e às funções integradas como get() e exists().
Elas podem chamar outras funções, mas não são executadas novamente. A profundidade total da pilha de chamadas é limitada a 10.
Na versão v2 das regras, as funções podem definir variáveis usando a palavra-chave let. As funções podem ter até 10 vinculações de permissão, mas precisam terminar com uma instrução de retorno.
Uma função é definida com a palavra-chave function e usa zero ou mais argumentos. Por exemplo, pode ser necessário combinar os dois tipos de condição usados nos exemplos acima em uma única função:


service cloud.firestore {
  match /databases/{database}/documents {
    // True if the user is signed in or the requested data is 'public'
    function signedInOrPublic() {
      return request.auth.uid != null || resource.data.visibility == 'public';
    }

    match /cities/{city} {
      allow read, write: if signedInOrPublic();
    }

    match /users/{user} {
      allow read, write: if signedInOrPublic();
    }
  }
}
O uso de funções nas regras de segurança as torna mais fáceis de atualizar à medida que a complexidade delas aumenta.

Regras não são filtros
Depois de proteger seus dados e começar a gravar consultas, lembre-se de que as regras de segurança não são filtros. Não é possível gravar uma consulta para todos os documentos em uma coleção e esperar que o Cloud Firestore retorne apenas os documentos que o cliente atual tem permissão para acessar.

Por exemplo, veja a seguinte regra de segurança:


service cloud.firestore {
  match /databases/{database}/documents {
    // Allow the user to read data if the document has the 'visibility'
    // field set to 'public'
    match /cities/{city} {
      allow read: if resource.data.visibility == 'public';
    }
  }
}
Recusada: esta regra recusa a consulta a seguir porque o conjunto de resultados pode incluir documentos em que visibility não é public:

Web

db.collection("cities").get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            console.log(doc.id, " => ", doc.data());
    });
});
Permitida: esta regra permite a consulta a seguir porque a cláusula where("visibility", "==", "public") garante que o conjunto de resultados corresponda à condição da regra:

Web

db.collection("cities").where("visibility", "==", "public").get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            console.log(doc.id, " => ", doc.data());
        });
    });
As regras de segurança do Cloud Firestore avaliam cada consulta com relação a possíveis resultados. Elas gerarão uma falha da solicitação se puderem retornar um documento que o cliente não tenha permissão para ler. As consultas precisam seguir as restrições definidas nas suas regras de segurança. Para mais informações sobre regras de segurança e consultas, acesse Como consultar dados de maneira segura.
```
