# 3 Modelagem e diagramas arquiteturais: (Modelo C4)
Como visão geral das duas aplicações, temos:
- LANDING PAGE: É um website simples (Landing Page) construído com WordPress que tem uma arquitetura monolítica e desacoplada (devido ao uso de API REST), e será armazenado na Hostinger. O navegador acessa o site via Internet, que utiliza um banco de dados MySQL para gerenciar dados como usuários e posts. A comunicação utiliza a REST API do WordPress com formatos JSON, HTTP e JWT.

<p align="center">
 <img width="929" height="509" alt="image" src="https://github.com/user-attachments/assets/c59502fb-0a3a-40ff-816a-8c7e3f83cbc0" />
 <br>
  Figura 5: Visão geral da Landing Page
</p>

- SISTEMA: É uma aplicação mais complexa com uma arquitetura Arquitetura de Três Camadas (3-Tier Architecture). O Front-End (React.js) é hospedado na Hostinger e o usuário ao acessar via navegador. O Front-End se comunica com o Servidor de Aplicação (.NET Web API), que é hospedado no IIS e usa JSON. O servidor acessa um banco de dados SQL Server, utilizando o Entity Framework (ORM).

<p align="center">
 <img width="876" height="485" alt="image" src="https://github.com/user-attachments/assets/f2240feb-803f-449c-8242-268e3fd010b7" />
 <br>
  Figura 6: Visão geral da Landing Page
</p>

## 3.1 Nível 1: Diagrama de Contexto
<p align="center">
  <img width="748" height="591" alt="image" src="https://github.com/user-attachments/assets/2c7bc9b8-9707-44ef-bf2a-3dd283ad9bf2" /><br>
  Figura 7: Visão geral da Landing Page
</p>

## 3.2 Nível 2: Diagrama de Contêiner
<p align="center">
  <img width="1041" height="731" alt="image" src="https://github.com/user-attachments/assets/e423d628-5e4f-4de5-ab87-7f3f948cb798" /><br>
  Figura 8 – Diagrama de Contêiner
</p>


## 3.3 Nível 3: Diagrama de Componentes
<p align="center">
  <img width="468" height="685" alt="image" src="https://github.com/user-attachments/assets/5bc77f12-cfe0-4f73-a342-5a2964573318" /><br>
  Figura 9 – Diagrama de Componentes  
</p>


## 3.4 Nível 4: Código
O diagrama de classes modela as entidades principais do sistema. Usuário é a superclasse (atributos protegidos: id, nome, email, passwordHash, criadoEm) e é especializada em Administrador, Voluntário e Beneficiário para comportamentos e dados específicos; Agenda e Aluguel representam, respectivamente, eventos/atendimentos e reservas de espaço, que podem ser criados e gerenciados por usuários, com relação N:N entre Agenda e Usuario para participantes; RelatorioVoluntario e RelatorioFinanceiro agregam métricas de voluntariado e fluxos financeiros (sumarizando agendas e aluguéis por período). A modelagem privilegia encapsulamento (atributos privados/protected com getters públicos) e facilita persistência relacional.

<p align="center">
  <img width="1313" height="1600" alt="image" src="https://github.com/user-attachments/assets/5629724a-d5ac-49ac-b874-3afaf925c709" /> <br>
  Figura 10 – Diagrama de Entidade Relacionamento (ER)
</p>

