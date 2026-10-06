# Memorial Técnico de Desenvolvimento

Portal de Solicitações: API REST em Spring Boot e interface web em Next.js para registrar e acompanhar solicitações internas.

-----------------------------------------------------

# 1. Tecnologias utilizadas

# Backend

- Linguagem: Java 25
- Framework: Spring Boot 4 (Web MVC)
- Persistência: Spring Data JPA com Hibernate
- Banco de dados: PostgreSQL
- Autenticação: Spring Security, JWT (biblioteca JJWT) e BCrypt
- Validação: Jakarta Bean Validation
- Bibliotecas de apoio: MapStruct e Lombok
- Build: Maven
- Testes: JUnit 5, Mockito e H2

# Frontend

- Linguagem: TypeScript
- Framework: Next.js 16 com React 19
- Estilo: Tailwind CSS 4
- Ícones: React Icons
- Qualidade: ESLint
- Testes: Vitest

# Ferramentas

- Git e IntelliJ IDEA
- O projeto pode ser executado localmente, sem depender de serviços cloud.

---

# 2. Justificativa técnica

# Java 25

Escolhi Java por já ser bastante utilizado em sistemas corporativos e por ter um ecossistema bem consolidado para APIs, segurança e acesso a banco de dados.

O projeto usa a versão 25, que é LTS. Também aproveitei recursos mais recentes da linguagem, como `records` para os DTOs, deixando essas classes menores e imutáveis.

# Spring Boot

Spring Boot foi uma escolha automática para o backend, principalmente pela experiência que eu já tenho com o ecossistema Spring e pela quantidade de recursos que ele oferece para uma API REST.

A configuração inicial fica simples por causa da autoconfiguração e do servidor embutido. Recursos como tratamento de erros, validação, acesso ao banco e segurança também se integram bem ao restante do projeto.

Como a API não mantém sessão no servidor, ela também pode ser executada em mais de uma instância sem precisar compartilhar estado entre elas.

# Spring Data JPA / Hibernate

Usei Spring Data JPA para evitar escrever SQL para as operações mais comuns do sistema.

Os repositórios ficam responsáveis pelo acesso aos dados, enquanto as regras de negócio permanecem nos services. Para os filtros da lista de solicitações, usei Specifications, permitindo combinar os filtros sem precisar montar consultas SQL manualmente.

Isso também facilita adicionar novos filtros posteriormente.

# PostgreSQL

O PostgreSQL foi escolhido por ser um banco relacional robusto e gratuito, além de ser bastante utilizado em aplicações reais.

O modelo do sistema também combina bem com um banco relacional: um usuário pode ter várias solicitações, e as solicitações possuem seus próprios dados e relacionamentos.

Outro ponto importante foi poder usar PostgreSQL tanto instalado localmente quanto através do Supabase.

# Spring Security + JWT

A autenticação foi feita com Spring Security e JWT.

A ideia foi não manter uma sessão no servidor. Depois do login, a API gera um token assinado contendo as informações necessárias para identificar o usuário. Nas próximas requisições, esse token é validado pelo filtro de autenticação.

Para o tamanho do projeto, achei essa abordagem mais simples do que introduzir uma solução como OAuth2 ou Keycloak.

Uma limitação dessa escolha é que, depois de emitido, o token continua válido até expirar. Neste projeto, o tempo definido é de 24 horas.

# BCrypt

As senhas não são armazenadas diretamente no banco. O sistema guarda apenas o hash gerado pelo BCrypt.

O BCrypt utiliza salt e um custo de processamento maior, o que dificulta ataques de força bruta. Também já existe integração com ele no Spring Security, então não foi necessário adicionar uma solução separada para isso.

# Bean Validation

Usei Jakarta Bean Validation para deixar as validações básicas junto dos DTOs.

Por exemplo, regras como `@NotBlank` e `@Size` ficam declaradas no próprio objeto que recebe os dados da requisição. Isso evita espalhar vários `if` pelos controllers e services.

Além de deixar o código mais organizado, o próprio DTO passa a mostrar parte do que a API espera receber.

# MapStruct

O MapStruct foi utilizado para fazer as conversões entre entidades e DTOs.

Em vez de colocar essas conversões dentro dos services, elas ficam concentradas nos mappers, consequentemente deixando o service mais "clean". O código de conversão é gerado durante a compilação, sem depender de reflexão em tempo de execução.

Também ajuda a encontrar problemas de mapeamento já durante o build.

# Lombok

Usei Lombok principalmente para reduzir código repetitivo nas entidades e em algumas classes de configuração.

As entidades JPA precisam ser mutáveis e possuem alguns métodos e construtores que não fazem sentido escrever manualmente. O Lombok ajuda a deixar essas classes menores.

Os DTOs principais usam `records`, então nesses casos o Lombok não é necessário.

Durante o desenvolvimento, foi necessário manter o projeto no Java 25 por causa da compatibilidade do Lombok utilizada no projeto.

# Maven

O Maven foi utilizado para gerenciar as dependências e o build do backend.

O projeto também inclui o Maven Wrapper (`mvnw`), então não é necessário instalar uma versão específica do Maven na máquina. Basta ter o JDK instalado.

Isso ajuda a manter o ambiente de build mais previsível entre máquinas diferentes.

# TypeScript

No frontend, escolhi TypeScript para ter tipagem tanto nos componentes quanto na comunicação com a API.

Os tipos utilizados no frontend representam os dados que a API trabalha, como solicitações, usuários, categorias e status. Isso ajuda principalmente durante alterações e refatorações, já que muitos erros aparecem durante a compilação em vez de somente em execução.

# Next.js + React

Usei React para a interface e Next.js como framework.

O Next.js já resolve algumas partes que seriam necessárias configurar separadamente em um projeto React mais simples, principalmente roteamento e build de produção.

Também aproveitei a estrutura de rotas e layouts do Next.js para manter as telas autenticadas com uma estrutura compartilhada.

Para o tamanho deste projeto, essa combinação atende bem sem trazer uma estrutura muito pesada.

# Tailwind CSS

O Tailwind foi escolhido para acelerar a construção da interface e facilitar a adaptação para diferentes tamanhos de tela.

A maior parte dos estilos fica diretamente nos componentes, e as classes responsivas (`sm:`, `md:`, `lg:`) permitem ajustar o layout conforme o tamanho da tela.

Isso também evita criar vários arquivos CSS separados para componentes relativamente pequenos.

# Testes: JUnit, Mockito, H2 e Vitest

No backend, JUnit e Mockito são usados para testar as regras da aplicação e isolar dependências quando necessário.

O H2 permite executar os testes com um banco em memória, sem precisar configurar um PostgreSQL só para rodar a suíte.

No frontend, usei Vitest para testar as partes que possuem lógica própria.

A ideia dos testes não é tentar cobrir absolutamente tudo, mas garantir principalmente os comportamentos mais importantes da aplicação.

-----------------------------------------------------

# 3. Justificativa conceitual

# Estrutura geral

O projeto foi separado em dois projetos independentes:

- backend, responsável pela API REST;
- frontend, responsável pela interface.

A comunicação entre eles acontece por HTTP. Com isso, cada parte pode ser executada e publicada separadamente, e a mesma API poderia futuramente atender outro frontend ou outro cliente.

# Organização das camadas (backend)

O backend segue uma separação simples por responsabilidades:

- Controller: recebe as requisições HTTP e devolve as respostas.
- Service: concentra as regras de negócio.
- Repository: cuida do acesso ao banco.
- DTO: define os dados que entram e saem da API, sem expor diretamente as entidades.
- Exception: concentra o tratamento dos erros e transforma as exceções em respostas HTTP.

As regras mais importantes ficam no backend, independentemente do que o frontend faça.

Atualmente:

- Toda solicitação começa com status *Aberto*;
- O solicitante é definido a partir do usuário autenticado;
- Somente solicitações abertas podem ser editadas ou excluídas.

# Modelagem de dados

O sistema possui duas tabelas principais: `users` e `solicitations`.

Um usuário pode ter várias solicitações, formando uma relação de um para muitos.

Algumas decisões da modelagem:

- IDs em UUID: evitam IDs sequenciais e dificultam a descoberta de registros apenas observando a URL.
- Categoria e status como texto: deixam os valores mais fáceis de visualizar no banco.
- Data de criação definida pelo servidor: o cliente não pode escolher ou alterar a data de criação da solicitação.

# Padrões de projeto

Não foi adotido nenhum padrão muito complexo. A ideia foi manter a estrutura compatível com o tamanho do sistema.

- Repository e DTO: separam o acesso ao banco e o contrato da API.
- Specification: permite combinar filtros sem montar SQL manualmente.
- Mapper (MapStruct): concentra as conversões entre entidades e DTOs.
- Injeção de dependência: reduz o acoplamento e facilita os testes.
- Filtro de autenticação:** deixa a validação do JWT fora dos controllers.
- Frontend: um Context concentra os modais e avisos compartilhados, enquanto uma camada de serviços centraliza as chamadas à API.

# Estratégia de autenticação

O fluxo de autenticação funciona da seguinte forma:

1. O usuário informa usuário e senha no login.
2. A API compara a senha informada com o hash BCrypt salvo no banco.
3. Se estiver correta, a API gera um JWT com validade de 24 horas.
4. O frontend guarda o token e o envia nas requisições protegidas.
5. O filtro de autenticação valida o token e identifica o usuário.
6. Se o token estiver inválido ou expirado, a API retorna `401` e o frontend direciona o usuário para o login.

# Comunicação frontend ↔ backend

A comunicação é feita por uma API REST que utiliza JSON e possui os endpoints organizados em `/v1`.

Os métodos HTTP seguem suas funções:

- `GET` para consultas;
- `POST` para criação;
- `PUT` para edição;
- `PATCH` para alteração de status;
- `DELETE` para exclusão.

Os filtros, paginação e ordenação são enviados pela URL.

No frontend, as chamadas passam por uma função central (`apiFetch`), que fica responsável por enviar o token e tratar os erros comuns da API.

# Organização do código-fonte

No backend, o código está separado por responsabilidade:

```text
controller
service
repository
dto
entity
security
config
```

No frontend, a organização segue uma ideia parecida:

```text
components
services
context
utils
```

As rotas autenticadas ficam agrupadas em `(portal)`.

Como convenção, o código utiliza nomes em inglês, enquanto os textos exibidos na interface e os comentários ficam em português.

---

# 4. Análise crítica

# Limitações

O projeto atende ao escopo proposto, mas existem alguns pontos que eu melhoraria em uma versão mais completa:

- Qualquer usuário autenticado atualmente consegue visualizar, editar e alterar o status de qualquer solicitação. Ainda não existem perfis separados para solicitante e atendente.
- O status pode voltar de **Concluído** para **Aberto**, e o sistema ainda não possui histórico das alterações.
- O JWT fica armazenado no `localStorage`. Em uma aplicação com requisitos maiores de segurança, seria preferível utilizar um cookie `HttpOnly`.
- O logout não invalida o token no servidor. Na prática, o token continua válido até expirar.
- Os erros da API ainda são retornados como texto simples, em vez de seguir um formato de erro padronizado.
- Algumas validações feitas no frontend, como tamanho do título e da descrição, ainda poderiam ser repetidas no backend.
- A unicidade do nome de usuário é verificada no código, mas também seria interessante reforçar essa regra diretamente no banco.
- O dashboard faz várias requisições separadas. Um endpoint específico para os dados do dashboard poderia reduzir isso.
- Em telas pequenas, a tabela de solicitações precisa de rolagem horizontal.
- Ainda não existem testes de integração utilizando PostgreSQL real nem testes ponta a ponta.

# Melhorias futuras

Algumas melhorias que fariam sentido em uma próxima versão:

- Criar perfis de acesso, permitindo que o solicitante veja apenas suas solicitações e que o atendente seja responsável pelo andamento.
- Criar um fluxo de status mais controlado, registrando quem alterou o status e quando.
- Adicionar documentação interativa da API com Swagger.
- Criar um endpoint específico para os dados do dashboard.
- Adicionar testes de integração, testes ponta a ponta e um pipeline de CI.
- Adaptar a lista de solicitações para utilizar cartões em telas menores.

# Requisitos que poderiam ser aperfeiçoados

Alguns pontos do próprio requisito poderiam ser mais detalhados em uma aplicação real:

- Definir quem é responsável por atender cada solicitação.
- Adicionar prioridade e prazo.
- Usar cancelamento em vez de exclusão, preservando o histórico.
- Restringir o cadastro para usuários da própria empresa.
- Permitir que as categorias sejam configuradas sem precisar alterar o código.

# O que seria diferente em produção corporativa

Se esse sistema fosse utilizado em uma empresa de verdade, algumas decisões provavelmente seriam diferentes:

- *Login:* integração com o sistema de autenticação da empresa (SSO), em vez de manter cadastro próprio.
- *Token:* utilização de cookie seguro (`HttpOnly`) em vez de `localStorage`.
- *Segredos:* armazenamento em um serviço próprio de gerenciamento de segredos, em vez de variáveis configuradas manualmente.
- *Banco:* uso de migrações versionadas, backups e um banco gerenciado.
- *Monitoramento:* logs estruturados, métricas e monitoramento da aplicação.
- *Entrega:* pipeline de CI/CD com testes e verificações antes de cada publicação.
- *Datas:* armazenamento em UTC para evitar problemas de fuso horário.
- *Dados pessoais:* cuidados específicos com privacidade e adequação à LGPD.