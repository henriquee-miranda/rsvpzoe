# Site RSVP para Aniversário de 1 Ano

Um site simples e moderno para confirmação de presença em um aniversário de 1 ano, utilizando Google Sheets como banco de dados.

## Configuração

### 1. Criar uma planilha no Google Sheets

1. Acesse o [Google Sheets](https://sheets.google.com) e crie uma nova planilha
2. Renomeie a primeira aba para "Sheet1" (ou ajuste o nome no arquivo de configuração)
3. Configure as colunas da seguinte forma:
   - A1: Nome
   - B1: Contato
   - C1: Status
4. Preencha as linhas abaixo com os dados dos convidados:
   - Coluna A: Nome do convidado
   - Coluna B: Contato (telefone, email, etc.)
   - Coluna C: deixe em branco (será preenchido pelo site)

### 2. Configurar a API do Google Sheets

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto
3. Ative a API do Google Sheets para este projeto
4. Crie uma chave de API:
   - Menu ≡ > APIs e Serviços > Credenciais
   - Clique em "+ Criar credenciais" > Chave de API
   - Copie a chave gerada
5. Restrinja a chave de API para usar apenas o Google Sheets API por segurança

### 3. Configurar o site

1. Duplique o arquivo `config.js.example` e renomeie para `config.js`
2. Abra o arquivo `config.js` e preencha:
   - `API_KEY`: Sua chave de API do Google
   - `SPREADSHEET_ID`: ID da sua planilha (pode ser encontrado na URL da planilha: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`)
   - `SHEET_NAME`: Nome da aba da planilha (padrão: "Sheet1")
   - `RANGE`: Intervalo de células da planilha (padrão: "A2:C")

**Importante**: O arquivo `config.js` contém informações sensíveis e não deve ser compartilhado publicamente. Ele já está incluído no `.gitignore` para evitar que seja enviado para repositórios públicos.

### 4. Compartilhar a planilha

Certifique-se de que a planilha esteja compartilhada publicamente com permissão de leitura:
1. Clique em "Compartilhar" no Google Sheets
2. Clique em "Alterar para qualquer pessoa com o link"
3. Altere a permissão para "Leitor"
4. Clique em "Concluído"

## Executando localmente

Para testar o site localmente, você pode usar o servidor Node.js simples incluído:

1. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado
2. Abra o terminal/prompt de comando na pasta do projeto
3. Execute o comando:
   ```
   node server.js
   ```
4. Abra seu navegador e acesse `http://localhost:3000`

Se você não tiver Node.js instalado, também pode:
- Usar a extensão "Live Server" no Visual Studio Code
- Usar o servidor embutido do Python: `python -m http.server`
- Usar qualquer outro servidor web local de sua preferência

## Hospedagem

Você pode hospedar este site em qualquer serviço de hospedagem para sites estáticos, como:
- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting

Basta fazer o upload de todos os arquivos para o serviço de hospedagem escolhido.

## Personalização

- Para alterar a imagem de fundo, substitua o arquivo `assets/Cover Forms.png`
- Para ajustar cores e estilos, edite o arquivo `styles.css`
- Para mudar os textos da interface, edite o arquivo `index.html`

## Licença

Este projeto é livre para uso pessoal.

## Contato

Para suporte ou dúvidas, entre em contato com [seu-email@example.com]. 