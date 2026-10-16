# Oficina Mecânica

Aplicação web desenvolvida para o gerenciamento de uma oficina mecânica, permitindo que clientes agendem serviços e que administradores gerenciem os atendimentos.

## Tecnologias utilizadas

- **React** — construção da interface com componentes.
- **JavaScript** — lógica e funcionalidades da aplicação.
- **JSX** — estruturação dos componentes.
- **Bootstrap** — estilização e layout responsivo.
- **API REST** — integração com o backend para gerenciamento dos dados.

## Funcionalidades

### Clientes
- Cadastro e autenticação de usuários.
- Visualização dos serviços disponíveis.
- Consulta de mecânicos e horários disponíveis.
- Agendamento e acompanhamento de serviços.
- Cancelamento de agendamentos, conforme as regras da aplicação.
- Avaliação dos serviços realizados.

### Administradores
- Gerenciamento de serviços e mecânicos.
- Gerenciamento de horários e disponibilidades.
- Visualização e gerenciamento dos agendamentos.
- Controle do andamento dos atendimentos.

## Execução do projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/MatheusFabSouza/oficina-mecanica.git
   ```

2. Acesse a pasta do projeto:
   ```bash
   cd oficina-mecanica
   ```

3. Instale as dependências definidas no lockfile:
   ```bash
   npm ci
   ```

4. Inicie a aplicação em desenvolvimento:
   ```bash
   npm run dev
   ```

5. Valide a compilação de produção:
   ```bash
   npm run build
   npm run preview
   ```

## API

A aplicação utiliza uma API REST externa para autenticação, consulta e gerenciamento dos dados.

- **Documentação:** https://agendamentos.spaincentral.cloudapp.azure.com/api/docs/
- **Organização:** `oficina-mecanica`


