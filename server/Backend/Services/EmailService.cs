using System.Net;
using System.Net.Mail;
using Backend.Models;
 
namespace Backend.Services;
 
public interface IEmailService
{
    Task SendEventNotificationAsync(Event eventData, List<Associados> recipients);
    Task SendEmailAsync(string to, string subject, string body);
}
 
public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;
 
    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }
 
    public async Task SendEventNotificationAsync(Event eventData, List<Associados> recipients)
    {
        _logger.LogInformation($"========== INICIANDO NOTIFICAÇÃO DE EVENTO ==========");
        _logger.LogInformation($"Evento: {eventData.title} (ID: {eventData.id})");
        _logger.LogInformation($"Total de associados: {recipients.Count}");
 
        if (!recipients.Any())
        {
            _logger.LogWarning("❌ Nenhum associado encontrado para notificação de evento");
            return;
        }
 
        var subject = $"Novo Evento: {eventData.title}";
        var body = BuildEventEmailBody(eventData);
 
        var validRecipients = recipients
            .Where(a => !string.IsNullOrEmpty(a.email))
            .ToList();
 
        _logger.LogInformation($"Associados com email válido: {validRecipients.Count}");
        foreach (var r in validRecipients)
        {
            _logger.LogInformation($"  - {r.name}: {r.email}");
        }
 
        if (!validRecipients.Any())
        {
            _logger.LogWarning("❌ Nenhum associado com email válido encontrado para notificação");
            return;
        }
 
        var tasks = validRecipients
            .Select(associado => SendEmailAsync(associado.email ?? "", subject, body));
 
        try
        {
            await Task.WhenAll(tasks);
            _logger.LogInformation($"✅ Emails de notificação do evento '{eventData.title}' enviados para {validRecipients.Count} associados");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erro ao enviar notificações de evento");
        }
 
        _logger.LogInformation($"========== FIM DA NOTIFICAÇÃO DE EVENTO ==========");
    }
 
    public async Task SendEmailAsync(string to, string subject, string body)
    {
        if (string.IsNullOrEmpty(to))
        {
            _logger.LogWarning("❌ Email destinatário é inválido");
            return;
        }
 
        try
        {
            _logger.LogInformation($"📧 Enviando email para: {to}");
 
            var smtpServer = _configuration["Email:SmtpServer"];
            var smtpPortString = _configuration["Email:SmtpPort"];
            var senderEmail = _configuration["Email:SenderEmail"];
            var senderPassword = _configuration["Email:SenderPassword"];
            var senderName = _configuration["Email:SenderName"] ?? "CTC Team";
 
            _logger.LogInformation($"Configuração - SMTP Server: {smtpServer}");
            _logger.LogInformation($"Configuração - SMTP Port: {smtpPortString}");
            _logger.LogInformation($"Configuração - Sender Email: {senderEmail}");
 
            // Validar configurações
            if (string.IsNullOrEmpty(smtpServer) || string.IsNullOrEmpty(senderEmail) || string.IsNullOrEmpty(senderPassword))
            {
                _logger.LogError("❌ Configurações de email incompletas no appsettings.json");
                _logger.LogError($"  SmtpServer: {(string.IsNullOrEmpty(smtpServer) ? "VAZIO" : smtpServer)}");
                _logger.LogError($"  SenderEmail: {(string.IsNullOrEmpty(senderEmail) ? "VAZIO" : senderEmail)}");
                _logger.LogError($"  SenderPassword: {(string.IsNullOrEmpty(senderPassword) ? "VAZIO" : "***")}");
                return;
            }
 
            if (!int.TryParse(smtpPortString, out int smtpPort))
            {
                smtpPort = 587; // porta padrão
                _logger.LogWarning($"⚠️  Porta SMTP inválida, usando 587");
            }
 
            _logger.LogInformation($"Conectando ao SMTP: {smtpServer}:{smtpPort}");
 
            using (var client = new SmtpClient(smtpServer, smtpPort))
            {
                client.EnableSsl = true;
                client.Timeout = 10000;
                client.Credentials = new NetworkCredential(senderEmail, senderPassword);
 
                var mailMessage = new MailMessage
                {
                    From = new MailAddress(senderEmail, senderName),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };
 
                mailMessage.To.Add(to);
 
                _logger.LogInformation($"Enviando mensagem...");
                await client.SendMailAsync(mailMessage);
                _logger.LogInformation($"✅ Email enviado com sucesso para {to}");
            }
        }
        catch (SmtpException ex)
        {
            _logger.LogError(ex, $"❌ Erro SMTP ao enviar email para {to}: {ex.StatusCode} - {ex.Message}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"❌ Erro ao enviar email para {to}: {ex.GetType().Name} - {ex.Message}");
        }
    }
 
    private string BuildEventEmailBody(Event eventData)
    {
        var eventDateFormatted = eventData.event_date?.ToString("dd/MM/yyyy") ?? "Data não especificada";
        var eventTime = eventData.event_time ?? "Horário não especificado";
 
        return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body {{ font-family: Arial, sans-serif; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #4CAF50; color: white; padding: 20px; border-radius: 5px 5px 0 0; }}
        .content {{ background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }}
        .footer {{ background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 5px 5px; }}
        .event-details {{ background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #4CAF50; }}
        .event-field {{ margin: 10px 0; }}
        .event-label {{ font-weight: bold; color: #4CAF50; }}
        .button {{ display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Novo Evento no Círculo de Trabalhadores Cristãos BH!</h1>
        </div>
        <div class='content'>
            <p>Olá,</p>
            <p>Temos o prazer de informar que um novo evento foi criado. Confira os detalhes abaixo:</p>
           
            <div class='event-details'>
                <div class='event-field'>
                    <span class='event-label'>Título:</span>
                    <p>{eventData.title}</p>
                </div>
                <div class='event-field'>
                    <span class='event-label'>Data:</span>
                    <p>{eventDateFormatted}</p>
                </div>
                <div class='event-field'>
                    <span class='event-label'>Horário:</span>
                    <p>{eventTime}</p>
                </div>
                <div class='event-field'>
                    <span class='event-label'>Local:</span>
                    <p>{eventData.location ?? "A ser definido"}</p>
                </div>
                <div class='event-field'>
                    <span class='event-label'>Descrição:</span>
                    <p>{eventData.description ?? "Sem descrição fornecida"}</p>
                </div>
            </div>
 
            <p>Não perca este evento! Acompanhe nosso calendário de eventos para mais informações e atualizações.</p>
        </div>
        <div class='footer'>
            <p>&copy; 2025 CTC Team. Todos os direitos reservados.</p>
            <p>Este é um email automático, não responda a este endereço.</p>
        </div>
    </div>
</body>
</html>";
    }
}