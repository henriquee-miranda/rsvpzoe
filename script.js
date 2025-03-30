// Configuração da API do Google
let API_KEY, SPREADSHEET_ID, SHEET_NAME, RANGE;

// Tentar carregar configurações do arquivo config.js
try {
    // Se o arquivo config.js existir, carregar configurações dele
    API_KEY = CONFIG.API_KEY;
    SPREADSHEET_ID = CONFIG.SPREADSHEET_ID;
    SHEET_NAME = CONFIG.SHEET_NAME || 'Sheet1';
    RANGE = CONFIG.RANGE || 'A2:C';
    console.log('Configurações carregadas:', { API_KEY, SPREADSHEET_ID, SHEET_NAME, RANGE });
} catch (error) {
    // Caso contrário, usar valores padrão (que precisam ser substituídos)
    console.warn('Arquivo config.js não encontrado. Usando valores padrão.');
    API_KEY = 'YOUR_API_KEY'; // Substitua pelo seu API Key
    SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // Substitua pelo ID da sua planilha
    SHEET_NAME = 'Sheet1'; // Nome da aba da planilha
    RANGE = 'A2:C'; // Range de células (A=nome, B=contato, C=status)
}

// Selecionar elementos DOM
const searchInput = document.getElementById('search-input');
const suggestionsContainer = document.getElementById('suggestions');
const guestInfoContainer = document.getElementById('guest-info');
const guestNameElement = document.getElementById('guest-name');
const guestStatusElement = document.getElementById('guest-status');
const confirmYesButton = document.getElementById('confirm-yes');
const confirmNoButton = document.getElementById('confirm-no');
const confirmationMessage = document.getElementById('confirmation-message');
const searchAgainButton = document.getElementById('search-again');
const loadingSpinner = document.getElementById('loading-spinner');

// Dados dos convidados
let guestData = [];
let selectedGuest = null;

const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbxppULzlQNmgxHXFRiySe-kfruIUacwONTqUUwypXDRWYnjKIuLBG5oT26rvk1Ywoqa/exec'; // Cole a URL que você obteve ao implantar

// Funções auxiliares para mostrar/esconder o spinner
function showLoading() {
    console.log('Mostrando spinner de carregamento');
    // Remover a classe hidden para mostrar o spinner
    loadingSpinner.classList.remove('hidden');
    // Adicionar uma classe no body para prevenir scroll enquanto carrega
    document.body.classList.add('loading-active');
}

function hideLoading() {
    console.log('Escondendo spinner de carregamento');
    // Adicionar a classe hidden para esconder o spinner
    loadingSpinner.classList.add('hidden');
    // Remover a classe do body
    document.body.classList.remove('loading-active');
}

// Inicializar a API do Google
function initGoogleAPI() {
    console.log('Iniciando API do Google...');
    gapi.load('client', async () => {
        try {
            console.log('Carregando cliente da API...');
            await gapi.client.init({
                apiKey: API_KEY,
                discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
            });
            console.log('API Google inicializada com sucesso');
            loadGuestData();
        } catch (error) {
            console.error('Erro ao inicializar API Google:', error);
            alert('Erro ao conectar com a API do Google. Verifique o console para mais detalhes.');
        }
    });
}

// Carregar dados dos convidados da planilha
async function loadGuestData() {
    try {
        console.log('Carregando dados da planilha...');
        
        // Não mostramos o spinner aqui para não confundir o usuário no carregamento inicial
        const response = await fetch(`${WEBAPP_URL}?action=getGuests`);
        const data = await response.json();
        
        if (data.success) {
            guestData = data.guests;
            console.log('Dados carregados com sucesso:', guestData);
        } else {
            console.error('Erro ao carregar dados:', data.error);
        }
    } catch (error) {
        console.error('Erro ao carregar dados da planilha:', error);
        alert('Erro ao carregar dados da planilha. Verifique o console para mais detalhes.');
    }
}

// Atualizar status do convidado na planilha
async function updateGuestStatus(guestName, newStatus) {
    try {
        const rowIndex = guestData.findIndex(guest => guest.name === guestName) + 2;
        
        if (rowIndex < 2) {
            console.error('Convidado não encontrado');
            return false;
        }

        console.log(`Atualizando status para ${guestName} na linha ${rowIndex} para "${newStatus}"`);
        
        // Não mostramos nem escondemos o spinner aqui, isso é controlado por quem chama a função
        
        const response = await fetch(`${WEBAPP_URL}?action=updateStatus&name=${encodeURIComponent(guestName)}&status=${encodeURIComponent(newStatus)}`);
        const data = await response.json();
        
        if (data.success) {
            console.log('Status atualizado com sucesso');
            return true;
        } else {
            console.error('Erro ao atualizar status:', data.error);
            return false;
        }
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        return false;
    }
}

function showSuggestions(suggestions) {
    const suggestionsContainer = document.getElementById('suggestions');
    suggestionsContainer.innerHTML = '';
    
    if (suggestions.length === 0) {
        suggestionsContainer.style.display = 'none';
        suggestionsContainer.style.opacity = '0';
        return;
    }
    
    suggestions.forEach(suggestion => {
        const suggestionElement = document.createElement('div');
        suggestionElement.textContent = suggestion.name;
        
        // Usando a função selectSuggestion consistentemente
        suggestionElement.addEventListener('click', () => {
            selectSuggestion(suggestion);
        });
        
        suggestionsContainer.appendChild(suggestionElement);
    });
    
    // Primeiro definimos display block, depois a opacidade em um pequeno delay
    suggestionsContainer.style.display = 'block';
    // Adicionamos um pequeno atraso para garantir que a transição seja suave
    setTimeout(() => {
        suggestionsContainer.style.opacity = '1';
    }, 10);
}

function hideAllSuggestions() {
    const suggestionsContainer = document.getElementById('suggestions');
    suggestionsContainer.style.opacity = '0';
    // Aguardar a animação terminar antes de esconder completamente
    setTimeout(() => {
        suggestionsContainer.style.display = 'none';
    }, 300);
}

// Função para buscar convidados com base no texto digitado
function searchGuests(searchText) {
    // Implementar busca nos dados de convidados
    if (!searchText || searchText.length < 2) {
        hideAllSuggestions();
        return;
    }
    
    // Filtrar convidados com base no texto digitado
    const filteredGuests = guestData.filter(guest => 
        guest.name.toLowerCase().includes(searchText.toLowerCase())
    );
    
    showSuggestions(filteredGuests);
}

// Função para exibir detalhes do convidado selecionado
function displayGuestDetails(guest) {
    // Implementar lógica para exibir detalhes do convidado
    // Por exemplo, atualizar algum elemento HTML com as informações
    console.log('Convidado selecionado:', guest);
    selectedGuest = guest;
    searchInput.value = guest.name;
    
    // Mostrar informações do convidado
    displayGuestInfo(guest);
}

function displayGuestInfo(guest) {
    const guestInfoElement = document.getElementById('guest-info');
    const guestNameElement = document.getElementById('guest-name');
    const guestStatusElement = document.getElementById('guest-status');
    const confirmYesButton = document.getElementById('confirm-yes');
    const confirmNoButton = document.getElementById('confirm-no');
    const confirmationMessage = document.getElementById('confirmation-message');
    const searchAgainButton = document.getElementById('search-again');
    
    // Certifique-se de que o elemento guest-info não está escondido
    guestInfoElement.classList.remove('hidden');
    
    // Definir nome do convidado
    guestNameElement.textContent = guest.name;
    
    // Resetar mensagem de confirmação e botão de buscar novamente
    confirmationMessage.classList.add('hidden');
    searchAgainButton.classList.add('hidden');
    
    // Mostrar botões de confirmação
    confirmYesButton.classList.remove('hidden');
    confirmNoButton.classList.remove('hidden');
    
    // Exibir status atual
    let statusClass = '';
    let statusText = '';
    
    if (guest.status === 'confirmed') {
        statusClass = 'status-confirmed';
        statusText = 'Presença Confirmada';
    } else if (guest.status === 'declined') {
        statusClass = 'status-declined';
        statusText = 'Não Poderá Comparecer';
    } else {
        statusClass = 'status-pending';
        statusText = 'Aguardando Confirmação';
    }
    
    guestStatusElement.className = 'status-tag ' + statusClass;
    guestStatusElement.textContent = statusText;
    
    // Usar uma abordagem mais suave para scroll, especialmente para mobile
    setTimeout(() => {
        // Verificar se estamos em um dispositivo móvel
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Em dispositivos móveis, usar scroll mais simples
            window.scrollTo({
                top: guestInfoElement.offsetTop - 80,
                behavior: 'smooth'
            });
        } else {
            // Em desktop, usar scrollIntoView
            guestInfoElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center'  // Centralizar na tela em vez de 'start'
            });
        }
        
        console.log("Scroll para exibir informações do convidado");
    }, 300); // Delay maior para garantir que os elementos estão renderizados
}

// Eventos de confirmação de presença
confirmYesButton.addEventListener('click', async () => {
    if (!selectedGuest) return;
    
    console.log('Botão Confirmar Presença clicado');
    
    // Desabilitar os botões durante o carregamento
    confirmYesButton.disabled = true;
    confirmNoButton.disabled = true;
    
    // Mostrar o spinner ANTES de fazer a requisição
    showLoading();
    
    try {
        const success = await updateGuestStatus(selectedGuest.name, 'Confirmado');
        
        if (success) {
            confirmationMessage.textContent = 'Presença confirmada com sucesso!';
            confirmationMessage.classList.remove('hidden');
            searchAgainButton.classList.remove('hidden');
            
            // Atualizar dados locais
            selectedGuest.status = 'Confirmado';
            guestStatusElement.textContent = `Status: ${selectedGuest.status}`;
            
            // Atualizar classe de status
            guestStatusElement.classList.remove('status-pending', 'status-declined');
            guestStatusElement.classList.add('status-confirmed');
        } else {
            confirmationMessage.textContent = 'Erro ao confirmar presença. Tente novamente.';
            confirmationMessage.classList.remove('hidden');
            // Reativar botões em caso de erro
            confirmYesButton.disabled = false;
            confirmNoButton.disabled = false;
        }
    } catch (error) {
        console.error('Erro ao confirmar presença:', error);
        confirmationMessage.textContent = 'Erro ao confirmar presença. Tente novamente.';
        confirmationMessage.classList.remove('hidden');
        confirmYesButton.disabled = false;
        confirmNoButton.disabled = false;
    } finally {
        // Sempre esconder o spinner ao final
        hideLoading();
    }
});

confirmNoButton.addEventListener('click', async () => {
    if (!selectedGuest) return;
    
    console.log('Botão Não Poderei Comparecer clicado');
    
    // Desabilitar os botões durante o carregamento
    confirmYesButton.disabled = true;
    confirmNoButton.disabled = true;
    
    // Mostrar o spinner ANTES de fazer a requisição
    showLoading();
    
    try {
        const success = await updateGuestStatus(selectedGuest.name, 'Não comparecerá');
        
        if (success) {
            confirmationMessage.textContent = 'Ausência registrada com sucesso!';
            confirmationMessage.classList.remove('hidden');
            searchAgainButton.classList.remove('hidden');
            
            // Atualizar dados locais
            selectedGuest.status = 'Não comparecerá';
            guestStatusElement.textContent = `Status: ${selectedGuest.status}`;
            
            // Atualizar classe de status
            guestStatusElement.classList.remove('status-pending', 'status-confirmed');
            guestStatusElement.classList.add('status-declined');
        } else {
            confirmationMessage.textContent = 'Erro ao registrar ausência. Tente novamente.';
            confirmationMessage.classList.remove('hidden');
            // Reativar botões em caso de erro
            confirmYesButton.disabled = false;
            confirmNoButton.disabled = false;
        }
    } catch (error) {
        console.error('Erro ao registrar ausência:', error);
        confirmationMessage.textContent = 'Erro ao registrar ausência. Tente novamente.';
        confirmationMessage.classList.remove('hidden');
        confirmYesButton.disabled = false;
        confirmNoButton.disabled = false;
    } finally {
        // Sempre esconder o spinner ao final
        hideLoading();
    }
});

// Botão para buscar novamente
searchAgainButton.addEventListener('click', () => {
    selectedGuest = null;
    searchInput.value = '';
    guestInfoContainer.classList.add('hidden');
    confirmYesButton.disabled = false;
    confirmNoButton.disabled = false;
});

// Evento de input na barra de busca - aqui é onde os usuários pesquisam os convidados
searchInput.addEventListener('input', (e) => {
    searchGuests(e.target.value);
});

// Esconder sugestões quando clicar fora
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-box')) {
        hideAllSuggestions();
    }
});

// Função auxiliar para selecionar uma sugestão
function selectSuggestion(suggestion) {
    document.getElementById('search-input').value = suggestion.name;
    hideAllSuggestions();
    // Exibir detalhes do convidado quando selecionado
    displayGuestDetails(suggestion);
}

// Inicializar a aplicação e adicionar evento simples de clique na barra de pesquisa
document.addEventListener('DOMContentLoaded', () => {
    console.log('Documento carregado, iniciando aplicação...');
    
    // Garantir que a barra de pesquisa seja clicável
    const searchBox = document.getElementById('search-box') || document.querySelector('.search-box');
    if (searchBox) {
        console.log('Configurando eventos de clique para a barra de pesquisa');
        searchBox.addEventListener('click', function(e) {
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.focus();
                console.log('Clique na barra de pesquisa - dando foco ao input');
            }
        });
    }
    
    // Verificar se o spinner de carregamento existe
    if (!loadingSpinner) {
        console.error('Elemento de carregamento não encontrado! O ID deve ser "loading-spinner".');
    } else {
        // Forçar o estado escondido no carregamento
        loadingSpinner.classList.add('hidden');
        document.body.classList.remove('loading-active');
        console.log('Spinner escondido no carregamento inicial');
    }
    
    // Verificar se todos os elementos necessários foram encontrados
    if (!searchInput || !suggestionsContainer || !guestInfoContainer || 
        !guestNameElement || !guestStatusElement || !confirmYesButton || 
        !confirmNoButton || !confirmationMessage || !searchAgainButton) {
        console.error('Alguns elementos DOM não foram encontrados!');
    }
    
    // Inicializar a API
    initGoogleAPI();
}); 