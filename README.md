projeto desenvolvido com minhas ideias.

## Configurações do projeto

caso você baixe o projeto faça as seguintes configurações para que o projeto funcione 100% correto.

primeiro abra o terminal e digite ```npm i```.

após isso crie um arquivo com o nome ```.env``` as informações nescessarias para ser colocada nesse arquivo estão informadas no arquivo ```.env.exemple```.

## Oque o usuario da API pode fazer?

caso esteja com os seguintes emojis ✔️ finalizado, ❌ a fazer e 🚧 sendo desenvolvido.

<hr>

User Routes | Descrição
--- | --- |
/sign-up | criar a conta (ao criar a conta será gerado um token auth, ele é utilizado para autenticar a sua conta). ✔️
/sign-in | efetuar login (caso você faça login com um ip ou um ```"user-agent"``` diferente do ultimo login a sua sessão será desconectada). ✔️
/profile | ver o perfil da conta que ele está logado. ✔️
/user/:username | exibição de perfil de outros usuarios. ✔️
/update/username | alteração do ```username``` ✔️
/update/fullname | alteração do ```fullname``` ✔️
/update/password | alteração da ```password``` ✔️
/update/genre | alteração do ```genre``` ✔️
/friend/request |  enviar pedido de amizade para um usuario. ✔️
/accept/friend-request | aceitar pedido de amizade. ✔️
/recuse/friend-request | aceitar pedido de amizade. ❌
/generation/token/auth | geração de token para autenticar a sua conta, caso você tenha perdido o token gerado na criação ou o token tenha expirado. ✔️
/verify-account | verificar a conta com o token gerado. ✔️
/generation/token/change-password | geração de token para alteração de password. ✔️
/change-password | trocar a senha com o token gerado. ✔️
/generation/token/change-email | geração de token para alteração de email. ✔️
/change-email | alterar o email com o token gerado. ✔️
/generation/token/delete-account | geração de token para deleção de conta. ✔️
/delete-account | deletar a conta com o token gerado. ✔️

<hr>

Article Routes | Descrição
--- | --- |
/create/article | criar um post. ✔️
/articles | listagem de todos os artigos postados. ✔️
/article | exibir um unico article (ao visualizar um artigo especifico será adicionado uma visualização nele). ✔️
/article/update/title | alteração do ```title``` do article ✔️
/article/update/body | alteração do ```body``` do article ✔️
/article/add-lie | adicionar ou remover like a um article ✔️
/article/delete | deletar um article ✔️
/friend/request |  enviar pedido de amizade para um usuario. ✔️
/article/add-comment | adicionar um comentario a um artigo. ✔️
/article/delete-comment | deletar um comentario de um artigo. ✔️## Criando um novo post
/article/update-comment | atualizar um comentario de um article. ✔️



