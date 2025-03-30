// Renomeie este arquivo para config.js e preencha com suas informações

// Configuração para acessar a planilha do Google Sheets
const CONFIG = {
    // Substitua pela sua chave de API do Google (não é o ID do cliente OAuth)
    API_KEY: 'AIzaSyD9xL9QfYMr9_ZcYj10vmLBYxOl9qS7VH8',
    
    // Substitua pelo ID da sua planilha
    // (o ID é a parte da URL entre /d/ e /edit)
    // Exemplo: https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit
    SPREADSHEET_ID: '1qQdoNm6dEaOIi3efBtilhGOqtOM5cBjDJsKgr4HQEs0',
    
    // Nome da aba da planilha
    SHEET_NAME: 'Sheet1',
    
    // Range de células (A=nome, B=contato, C=status)
    RANGE: 'A2:C'
};

// Não edite abaixo desta linha
if (typeof module !== 'undefined') {
    module.exports = CONFIG;
} 