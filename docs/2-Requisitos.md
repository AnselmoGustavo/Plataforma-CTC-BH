# 2 Requisitos
## 2.1 Lista de Atores

---

### História de Usuário – Paulo

**Sobre:**  
Funcionário público, 37 anos, que gosta de participar de eventos voltados para caridade.

**História:**  
Paulo costuma participar dos eventos promovidos pelo CTC como visitante e voluntário.

**Dores:**  
- Dificuldade de encontrar os eventos da instituição na internet.  
- Não consegue se cadastrar como voluntário de forma remota.  

**Motivações:**  
- Participar dos eventos promovidos pela instituição.  
- Ajudar pessoas necessitadas em ações beneficentes.  

**Necessidades:**  
- Conseguir se cadastrar como voluntário de forma remota.  
- Ter maior visibilidade sobre os eventos da instituição.

---

### História de Usuário – Shirley

**Sobre:**  
Aposentada, 68 anos, ensino fundamental completo, recebe cerca de um salário mínimo por mês.

**História:**  
Shirley mora sozinha e depende de programas sociais e da OSC para acessar atendimento social, atividades comunitárias, lazer, saúde e exercícios físicos. Tem rotina tranquila, porém limitada em mobilidade e acesso à tecnologia.

**Dores:**  
- Esquecer datas de eventos importantes.  
- Dificuldade de acesso às atividades devido à mobilidade reduzida.  
- Falta de informações claras ou atualizadas.  

**Motivações:**  
- Necessidade de apoio social e econômico.  
- Busca por convívio social e segurança.  
- Receber lembretes e notificações para facilitar sua participação.  

**Necessidades:**  
- Participar de eventos para ter acesso a serviços de apoio.  
- Sentir-se acolhida e incluída na comunidade.  
- Manter contato social e atividades que tragam bem-estar.

---

### História de Usuário – Júnior

**Sobre:**  
Gestor do Círculo do Trabalhador Cristão (CTC), 49 anos, responsável por gerenciar dados da OSC.

**História:**  
Júnior é voluntário e cuida dos eventos da instituição e do registro das pessoas envolvidas.

**Dores:**  
- Dificuldade para gerenciar e armazenar dados de voluntários e colaboradores.  

**Motivações:**  
- Dar visibilidade às pessoas que contribuem nos eventos.  
- Melhorar a organização das atividades da instituição.  

**Necessidades:**  
- Facilitar o preenchimento das listas de presença.  
- Registrar e tornar visíveis os colaboradores e voluntários que participam dos eventos.

---

### História de Usuário – Marta

**Sobre:**  
Gestora financeira da OSC, 42 anos, com ensino superior completo.

**História:**  
Marta é responsável pelo controle financeiro da OSC, incluindo relatórios contábeis, declarações e organização de recursos. Trabalha de forma metódica, mas ainda com baixa digitalização.

**Dores:**  
- Excesso de planilhas e documentos físicos, gerando lentidão e risco de erros.  
- Dificuldade para centralizar dados financeiros.  
- Alta chance de inconsistências por falta de automação.  
- Fechamento contábil atrasado devido ao trabalho manual.  

**Motivações:**  
- Garantir transparência e conformidade legal.  
- Aumentar eficiência e reduzir retrabalho.  
- Tomar decisões com base em dados precisos.  

**Necessidades:**  
- Sistema integrado com relatórios automáticos.  
- Alertas de prazos e rastreabilidade financeira.  
- Ferramenta simples e intuitiva.


## 2.2 Lista de Funcionalidades
Os requisitos aqui apresentados correspondem às funcionalidades solicitadas pelo parceiro/cliente na visão de negócio, tais como:
- Gerenciamento de usuários do sistema
- Gerenciamento dos voluntários
- Criação de relatórios financeiros
- Agendamento das atividades internas que serão realizadas no local
- Criação de relatório dos participantes dos eventos
- Notificação no sistema quando um evento estivesse faltando 1 dia para acontecer
- Gerenciamento dos aluguéis
- Gerenciamento dos beneficiários

## 2.3 Requisitos Funcionais
| ID    | Descrição Resumida                                                                                   | Dificuldade | Prioridade |
|-------|--------------------------------------------------------------------------------------------------------|-------------|------------|
| RF01  | O sistema deve permitir que o usuário realize login                                                    | B           | A          |
| RF02  | O sistema deve permitir realizar o gerenciamento de usuários (criar / atualizar / visualizar / deletar)| M           | A          |
| RF03  | O sistema deve permitir realizar gerenciamento de voluntários (criar / atualizar / visualizar / deletar)| M          | M          |
| RF04  | O sistema deve permitir a criação de relatórios financeiros                                            | M           | M          |
| RF05  | O sistema deve permitir realizar o agendamento de atividades no local                                  | M           | M          |
| RF06  | O sistema deve permitir a criação de um relatório de participação dos usuários nos eventos             | M           | A          |
| RF07  | O sistema deve permitir realizar o gerenciamento de eventos (criar / atualizar / visualizar / deletar) | M           | M          |
| RF08  | O sistema deve permitir realizar o gerenciamento de alugueis (criar / atualizar / visualizar / deletar)| M           | M          |
| RF09  | O sistema deve exibir um lembrete na tela principal quando um evento estiver próximo (1 dia)           | B           | B          |
| RF10  | O sistema deve permitir o gerenciamento dos beneficiários (criar / atualizar / visualizar / deletar)   | M           | A          |
| RF11  | O sistema deve permitir que funcionários registrem o histórico de atendimentos dos beneficiários       | M           | B          |
| RF12  | O sistema deve permitir o envio de notificações por e-mail aos usuários sobre eventos agendados        | A           | B          |

*B=Baixa, M=Média, A=Alta.

## 2.4 Requisitos Não Funcionais
| ID     | Descrição                                                                                                                  | Prioridade |
|--------|------------------------------------------------------------------------------------------------------------------------------|------------|
| RNF01  | O sistema deve ser acessível pelos principais navegadores web de forma responsiva.                                           | A          |
| RNF02  | O sistema deve manter a integridade dos dados dos beneficiários e voluntários                                                | A          |
| RNF03  | O sistema deve atender às WCAG, garantindo a acessibilidade de todas as interfaces.                                          | M          |
| RNF04  | O sistema deve ser modularizado e manter padrões de código limpo para facilitar a manutenção posterior                       | M          |
| RNF05  | O sistema deve ser compatível com máquinas com hardware mínimo: processador 1–2 GHz, 100 MB de disco e 4 GB de RAM.          | B          |
| RNF06  | O sistema deve dar feedbacks com mensagens claras ao usuário para operações de sucesso ou falha                              | M          |
| RNF07  | O sistema deve garantir que nenhuma informação cadastrada seja perdida, mesmo em caso de falha do sistema ou desconexão      | A          |

## 2.5.1 Descrição Resumida dos Casos de Uso
| Nome do Caso de Uso        | Descrição                                                                                          | Atores                          | Prioridade | Requisitos Associados               | Fluxo Principal                                                                                     |
|----------------------------|------------------------------------------------------------------------------------------------------|----------------------------------|------------|--------------------------------------|-------------------------------------------------------------------------------------------------------|
| Login Seguro               | Permite autenticação de usuários com verificação de credenciais e bloqueio após tentativas excessivas. | Usuário, Administrador          | Alta       | RNF01, RNF07, RNF08, RNF15          | 1. Usuário acessa tela de login. <br>2. Informa credenciais. <br>3. Sistema valida e aplica criptografia. <br>4. Concede ou nega acesso com mensagem clara. |
| Gerenciar Usuários         | Cadastrar, editar, excluir e definir papéis (RBAC) para usuários internos.                          | Administrador                   | Alta       | RNF01, RNF02, RNF09, RNF15          | 1. Administrador acessa painel. <br>2. Inclui ou altera dados. <br>3. Sistema salva e registra log da operação. |
| Gerenciar Voluntários      | Permite registro, atualização e consulta de voluntários, garantindo integridade dos dados.           | Administrador, Voluntário       | Alta       | RNF01, RNF02, RNF09, RNF15          | 1. Administrador abre módulo. <br>2. Insere ou edita informações. <br>3. Sistema confirma com feedback claro. |
| Gerenciar Eventos          | Criação, edição e divulgação de eventos com atualização em tempo real.                               | Administrador, Visitante        | Média      | RNF01, RNF03, RNF13                 | 1. Administrador cria evento. <br>2. Sistema publica no calendário. <br>3. Atualiza sem recarregar página. |
| Sistema de Agendamento     | Permite reservar espaços e horários, controlando uso simultâneo.                                     | Administrador, Locatário        | Média      | RNF01, RNF07, RNF11, RNF15          | 1. Locatário solicita reserva. <br>2. Sistema verifica disponibilidade. <br>3. Administrador aprova e agenda. |
| Gerar Relatório Financeiro | Registrar entradas/saídas e gerar relatórios em PDF/CSV em até 5 s.                                 | Gestor Financeiro               | Alta       | RNF01, RNF07, RNF10, RNF12, RNF15   | 1. Gestor insere transações. <br>2. Sistema calcula saldo. <br>3. Gera relatório exportável. |
| Relatório de Participação  | Geração de relatórios de presença em eventos, exportável em PDF/CSV.                                | Administrador                   | Média      | RNF01, RNF07, RNF12                 | 1. Administrador seleciona evento. <br>2. Sistema compila dados. <br>3. Exporta arquivo. |
| Gerenciar Aluguéis         | Cadastro de contratos de locação, controle de pagamentos e logs de auditoria.                        | Administrador, Locatário        | Alta       | RNF01, RNF07, RNF14, RNF15          | 1. Locatário solicita locação. <br>2. Administrador aprova. <br>3. Sistema registra alterações. |

## 2.5.2 Histórias de Usuários
| ID   | Eu como (Papel)        | Quero/Preciso (Funcionalidade)                                                               | Para (Motivo/Valor)                                                 |
|------|-------------------------|------------------------------------------------------------------------------------------------|----------------------------------------------------------------------|
| HU01 | Funcionário do CTC      | Ver um lembrete na tela principal quando um evento estiver próximo (faltando 1 dia)           | Não esquecer de preparar e organizar a atividade                     |
| HU02 | Funcionário do CTC      | Criar, atualizar, visualizar e deletar registros de beneficiários                             | Manter o controle das pessoas que recebem ajuda do CTC              |
| HU03 | Funcionário do CTC      | Registrar o histórico de atendimentos de cada beneficiário                                    | Acompanhar o progresso e as necessidades de cada pessoa             |
| HU04 | Funcionário do CTC      | Enviar notificações por e-mail aos usuários sobre eventos agendados                           | Garantir que todos estejam informados e participem das atividades   |

## 2.6 Restrições Arquiteturais
A seguir estão as principais restrições arquiteturais aplicáveis ao projeto. Essas restrições não são requisitos funcionais, mas limitam/condicionam as escolhas tecnológicas e de implementação, sendo que cada item traz um impacto na arquitetura do projeto:
- Aplicação web responsiva: O sistema será entregue como aplicação web acessível por navegadores modernos (desktop e mobile). Impacto: interface responsiva e testes básicos cross-browser.
- Banco de dados relacional: Dados principais (usuários, voluntários, beneficiários, eventos, alugueis, lançamentos financeiros, histórico de atendimentos) devem ficar em um banco relacional (PostgreSQL/MySQL) para garantir integridade e facilitar relatórios.
- Autenticação e controle de papéis: Mecanismo central de login com suporte a roles (Admin, Funcionário, Voluntário) e hashing seguro de senhas. Impacto: autorização por rota/ação e registro de operações sensíveis.
- Execução de tarefas agendada: Lógica de verificação/alerta “1 dia antes” e geração de relatórios deve rodar de forma assíncrona/agendada (cron, worker leve ou serviço gerenciado).
- Envio de e-mail por provedor externo: Notificações por e-mail (lembrança de evento a 1 dia, confirmações) via provedor SMTP ou API com filas/retries básicas.
- Comunicação segura (HTTPS) e backups: Transporte via HTTPS/TLS obrigatório; política básica de backup periódico dos dados e procedimentos mínimos de restauração.
- Operar em infraestrutura de baixo custo: Projetar para rodar bem em ambientes com recursos modestos (otimização de consultas, front leve), preferindo soluções open-source quando possível.

## 2.7 Mecanismos Arquiteturais 
| Análise                 | Design                         | Implementação                               |
|-------------------------|----------------------------------|-----------------------------------------------|
| Persistência            | ORM                              | Entity Framework + SQL Server                 |
| Front end               | Biblioteca JS                    | React, JavaScript, HTML, CSS                  |
| Back end                | Framework .NET                   | C# com ASP.NET Core                           |
| Integração              | API REST / Web Services          | ASP.NET Web API + JSON                        |
| Teste de Software       | Testes unitários                 | Jest (para React), xUnit (para C#)            |
| Deploy                  | CI/CD Pipeline                   | Vercel (Front-end) + IIS (Back-end)           |
| Logs                    | Logging Estruturado              | Serilog                                       |
| Tratamento de Exceções  | Middleware de exceções           | ILogger .NET                                  |
| Servidor de Aplicação   | Servidor Web                     | IIS (Windows Server)                          |


