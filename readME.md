# Aplicativo de Registro de Frequência de Alunos

Este projeto é um aplicativo móvel desenvolvido para permitir que alunos registrem sua presença em aulas de forma rápida e segura via QR Code e acompanhem sua situação acadêmica.

## 🎯 Objetivo do Produto

Simplificar e modernizar o processo de registro de frequência, oferecendo aos alunos uma ferramenta ágil para marcar presença e consultar seu histórico, eliminando a necessidade de listas de papel e otimizando o tempo em sala de aula.

## ✨ Funcionalidades (Backlog do Produto)

O backlog inicial priorizado para o desenvolvimento do aplicativo inclui as seguintes funcionalidades (Histórias de Usuário):

- **US01:** Salvar o número de matrícula localmente no dispositivo para evitar digitação repetida.
- **US02:** Registrar a presença de forma rápida escaneando um QR Code disponibilizado em aula.
- **US03:** Receber notificações instantâneas de sucesso ou erro após a tentativa de registro.
- **US04:** Visualizar um histórico detalhado de presenças e faltas na disciplina.
- **US05:** Consultar a lista de outros alunos que já registraram presença na aula atual.

## 🛠️ Tecnologias

A base tecnológica para a construção deste aplicativo é:

- **React Native**
- **TypeScript**
- Bibliotecas de navegação (ex: React Navigation)
- Bibliotecas de estilização

## 🚀 Roadmap de Desenvolvimento (Sprints)

O projeto está organizado em sprints, cada uma com um objetivo claro para entregar valor de forma incremental.

### Sprint 1: O Caminho Crítico - Registrar Frequência
**Objetivo:** Ao final da Sprint, o aluno será capaz de inserir sua matrícula, salvá-la localmente, e registrar com sucesso sua presença escaneando um QR Code. Esta é a funcionalidade principal do app.

| ID | Tipo | Descrição |
| :--- | :--- | :--- |
| **TS01** | Tarefa Técnica | Configurar a estrutura inicial do projeto (React Native + TypeScript). |
| **US01** | Funcionalidade | Implementar a tela inicial onde o aluno insere sua matrícula, que será salva localmente. |
| **US02** | Funcionalidade | Desenvolver a funcionalidade de câmera para ler o QR Code. |
| **US03** | Funcionalidade | (Parcial) Implementar a chamada à API para o backend e exibir um alerta simples (`alert()`) de sucesso ou erro. |

### Sprint 2: Visibilidade e Informação
**Objetivo:** Ao final da Sprint, o aluno poderá navegar pelo aplicativo para consultar tanto seu histórico de faltas quanto a lista de colegas presentes na aula.

| ID | Tipo | Descrição |
| :--- | :--- | :--- |
| **-** | Tarefa Técnica | Implementar a estrutura de navegação principal (Menu). |
| **US04** | Funcionalidade | Criar a tela "Minhas Faltas", que buscará e exibirá o histórico de frequência do aluno via API. |
| **US05** | Funcionalidade | Criar a tela "Presentes na Aula", que buscará e exibirá a lista de alunos presentes. |
| **US03** | Refinamento | Melhorar o feedback ao usuário, substituindo o `alert()` por componentes de notificação mais elegantes (Toasts, Modais, etc.). |

### Sprint 3: Polimento e Qualidade de Vida
**Objetivo:** Melhorar a experiência do usuário, a robustez do aplicativo e adicionar toques finais.

| ID | Tipo | Descrição |
| :--- | :--- | :--- |
| **-** | Tarefa Técnica | Criar componentes de "loading" (carregamento) para todas as chamadas de rede. |
| **-** | Tarefa Técnica | Implementar um tratamento de erros mais detalhado (Ex: "Sem conexão", "QR Code inválido", etc.). |
| **-** | Refinamento | Refinar a interface (UI) e a experiência do usuário (UX) em todas as telas. |
| **-** | Tarefa Técnica | Adicionar testes unitários para as funções críticas (ex: chamada à API). |